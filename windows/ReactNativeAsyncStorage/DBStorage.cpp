// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
#include "pch.h"
#include "DBStorage.h"

namespace winrt {
    using namespace Microsoft::ReactNative;
    using namespace Windows::ApplicationModel::Core;
    using namespace Windows::Foundation;
    using namespace Windows::Storage;
} // namespace winrt

namespace {

    void InvokeError(const DBStorage::Callback& callback, const char* message) {
        auto writer = winrt::MakeJSValueTreeWriter();
        writer.WriteObjectBegin();
        winrt::WriteProperty(writer, L"message", message);
        writer.WriteObjectEnd();
        callback(winrt::JSValueArray{ winrt::TakeJSValue(writer) });
    }

    using ExecCallback = int(SQLITE_CALLBACK*)(void*, int, char**, char**);

    // Execute the provided SQLite statement (and optional execCallback & user data
    // in pv). On error, throw a runtime_error with the SQLite error message
    void Exec(sqlite3* db, const char* statement, ExecCallback execCallback = nullptr, void* pv = nullptr) {
        char* errMsg = nullptr;
        int rc = sqlite3_exec(db, statement, execCallback, pv, &errMsg);
        if (errMsg) {
            std::runtime_error exception(errMsg);
            sqlite3_free(errMsg);
            sqlite3_close(db);
            throw exception;
        }
        if (rc != SQLITE_OK) {
            std::runtime_error exception(sqlite3_errmsg(db));
            sqlite3_free(errMsg);
            sqlite3_close(db);
            throw exception;
        }
    }

    // Execute the provided SQLite statement (and optional execCallback & user data
    // in pv). On error, reports it to the callback and returns false.
    bool Exec(
        sqlite3* db,
        const DBStorage::Callback& callback,
        const char* statement,
        ExecCallback execCallback = nullptr,
        void* pv = nullptr) {
        char* errMsg = nullptr;
        int rc = sqlite3_exec(db, statement, execCallback, pv, &errMsg);
        if (errMsg) {
            InvokeError(callback, errMsg);
            sqlite3_free(errMsg);
            return false;
        }
        if (rc != SQLITE_OK) {
            InvokeError(callback, sqlite3_errmsg(db));
            return false;
        }
        return true;
    }

    // Convenience wrapper for using Exec with lambda expressions
    template <class Fn>
    bool Exec(sqlite3* db, const DBStorage::Callback& callback, const char* statement, Fn& fn) {
        return Exec(
            db,
            callback,
            statement,
            [](void* pv, int i, char** x, char** y) { return (*static_cast<Fn*>(pv))(i, x, y); },
            &fn);
    }

    // Checks that the args parameter is an array, that args.size() is less than
    // SQLITE_LIMIT_VARIABLE_NUMBER, and that every member of args is a string.
    // Invokes callback to report an error and returns false.
    bool CheckArgs(sqlite3* db, const std::vector<winrt::JSValue>& args, const DBStorage::Callback& callback) {
        int varLimit = sqlite3_limit(db, SQLITE_LIMIT_VARIABLE_NUMBER, -1);
        auto argCount = args.size();
        if (argCount > INT_MAX || static_cast<int>(argCount) > varLimit) {
            char errorMsg[60];
            sprintf_s(errorMsg, "Too many keys. Maximum supported keys :%d", varLimit);
            InvokeError(callback, errorMsg);
            return false;
        }
        for (int i = 0; i < static_cast<int>(argCount); i++) {
            if (!args[i].TryGetString()) {
                InvokeError(callback, "Invalid key type. Expected a string");
            }
        }
        return true;
    }

    // RAII object to manage SQLite transaction. On destruction, if
    // Commit() has not been called, rolls back the transactions
    // The provided sqlite connection handle & Callback must outlive
    // the Sqlite3Transaction object
    class Sqlite3Transaction {
        sqlite3* m_db{ nullptr };
        const DBStorage::Callback* m_callback{ nullptr };

    public:
        Sqlite3Transaction() = default;
        Sqlite3Transaction(sqlite3* db, const DBStorage::Callback& callback) : m_db(db), m_callback(&callback) {
            if (!Exec(m_db, *m_callback, u8"BEGIN TRANSACTION")) {
                m_db = nullptr;
                m_callback = nullptr;
            }
        }
        Sqlite3Transaction(const Sqlite3Transaction&) = delete;
        Sqlite3Transaction(Sqlite3Transaction&& other) : m_db(other.m_db), m_callback(other.m_callback) {
            other.m_db = nullptr;
            other.m_callback = nullptr;
        }
        Sqlite3Transaction& operator=(const Sqlite3Transaction&) = delete;
        Sqlite3Transaction& operator=(Sqlite3Transaction&& rhs) {
            if (this != &rhs) {
                Commit();
                std::swap(m_db, rhs.m_db);
                std::swap(m_callback, rhs.m_callback);
            }
        }

        explicit operator bool() const {
            return m_db != nullptr;
        }

        void Rollback() {
            if (m_db) {
                Exec(m_db, *m_callback, u8"ROLLBACK");
                m_db = nullptr;
                m_callback = nullptr;
            }
        }

        bool Commit() {
            if (!m_db) {
                return false;
            }
            auto result = Exec(m_db, *m_callback, u8"COMMIT");
            m_db = nullptr;
            m_callback = nullptr;
            return result;
        }

        ~Sqlite3Transaction() {
            Rollback();
        }
    };

    // Appends argcount variables to prefix in a comma-separated list.
    std::string MakeSQLiteParameterizedStatement(const char* prefix, int argCount) {
        assert(argCount != 0);
        std::string result(prefix);
        result.reserve(result.size() + (argCount * 2) + 1);
        result += '(';
        for (int x = 0; x < argCount - 1; x++) {
            result += "?,";
        }
        result += "?)";
        return result;
    }

    // Checks if sqliteResult is SQLITE_OK. If not, reports the error via
    // callback & returns false.
    bool CheckSQLiteResult(sqlite3* db, const DBStorage::Callback& callback, int sqliteResult) {
        if (sqliteResult == SQLITE_OK) {
            return true;
        }
        else {
            InvokeError(callback, sqlite3_errmsg(db));
            return false;
        }
    }

    using Statement = std::unique_ptr<sqlite3_stmt, decltype(&sqlite3_finalize)>;

    // Creates a prepared SQLite statement. On error, returns nullptr
    Statement PrepareStatement(sqlite3* db, DBStorage::Callback& callback, const char* stmt) {
        sqlite3_stmt* pStmt{ nullptr };
        if (!CheckSQLiteResult(db, callback, sqlite3_prepare_v2(db, stmt, -1, &pStmt, nullptr))) {
            return { nullptr, sqlite3_finalize };
        }
        return { pStmt, &sqlite3_finalize };
    }

    // Binds the index-th variable in this prepared statement to str.
    bool BindString(
        sqlite3* db,
        const DBStorage::Callback& callback,
        const Statement& stmt,
        int index,
        const std::string& str) {
        return CheckSQLiteResult(db, callback, sqlite3_bind_text(stmt.get(), index, str.c_str(), -1, SQLITE_TRANSIENT));
    }

    struct slim_shared_lock_guard
    {
        explicit slim_shared_lock_guard(winrt::slim_mutex& m) noexcept :
            m_mutex(m)
        {
            m_mutex.lock_shared();
        }

        ~slim_shared_lock_guard() noexcept
        {
            m_mutex.unlock_shared();
        }

    private:
        winrt::slim_mutex& m_mutex;
    };

} // namespace

DBStorage::DBStorage() {
    std::string path;
    if (auto pathInspectable = winrt::CoreApplication::Properties().TryLookup(s_dbPathProperty)) {
        auto pathHstring = winrt::unbox_value<winrt::hstring>(pathInspectable);
        path = ConvertWstrToStr(std::wstring(pathHstring.c_str()));
    }
    else {
        try {
            auto const localAppDataPath = winrt::ApplicationData::Current().LocalFolder().Path();
            std::wstring wPath(localAppDataPath.data());
            wPath += L"\\AsyncStorage.db";
            path = ConvertWstrToStr(wPath);
        }
        catch (winrt::hresult_error const&) {
            throw std::runtime_error("Please specify 'React-Native-Community-Async-Storage-Database-Path' in CoreApplication::Properties");
        }
    }

    if (sqlite3_open_v2(
        path.c_str(),
        &m_db,
        SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE | SQLITE_OPEN_FULLMUTEX,
        nullptr) != SQLITE_OK) {
        auto exception = std::runtime_error(sqlite3_errmsg(m_db));
        sqlite3_close(m_db);
        throw exception;
    }

    int userVersion = 0;
    auto getUserVersionCallback = [](void* pv, int cCol, char** rgszColText, char** /*rgszColName*/) {
        if (cCol < 1) {
            return 1;
        }
        *static_cast<int*>(pv) = atoi(rgszColText[0]);
        return SQLITE_OK;
    };

    Exec(m_db, u8"PRAGMA user_version", getUserVersionCallback, &userVersion);

    if (userVersion == 0) {
        Exec(
            m_db,
            u8"CREATE TABLE IF NOT EXISTS AsyncLocalStorage(key TEXT PRIMARY KEY, value TEXT NOT NULL); PRAGMA user_version=1");
    }
}

DBStorage::~DBStorage() {
    decltype(m_tasks) tasks;
    {
        // If there is an in-progress async task, cancel it and wait on the
        // condition_variable for the async task to acknowledge cancellation by
        // nulling out m_action. Once m_action is null, it is safe to proceed
        // wth closing the DB connection
        slim_shared_lock_guard guard{ m_lock };
        swap(tasks, m_tasks);
        if (m_action) {
            m_action.Cancel();
            m_cv.wait(m_lock, [this]() { return m_action == nullptr; });
        }
    }
    sqlite3_close(m_db);
}

std::string DBStorage::ConvertWstrToStr(const std::wstring& wstr)
{
    if (wstr.empty()) return std::string();
    int size = WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), NULL, 0, NULL, NULL);
    std::string str(size, 0);
    WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), &str[0], size, NULL, NULL);
    return str;
}

// Under the lock, add a task to m_tasks and, if no async task is in progress,
// schedule it
void DBStorage::AddTask(
    DBStorage::DBTask::Type type,
    std::vector<winrt::Microsoft::ReactNative::JSValue>&& args,
    DBStorage::Callback&& jsCallback) {
    winrt::slim_lock_guard guard(m_lock);
    m_tasks.emplace_back(type, std::move(args), std::move(jsCallback));
    if (!m_action) {
        m_action = RunTasks();
    }
}

// On a background thread, while the async task  has not been cancelled and
// there are more tasks to do, run the tasks. When there are either no more
// tasks or cancellation has been requested, set m_action to null to report
// that and complete the coroutine. N.B., it is important that detecting that
// m_tasks is empty and acknowledging completion is done atomically; otherwise
// there would be a race between the background task detecting m_tasks.empty()
// and AddTask checking the coroutine is running.
winrt::Windows::Foundation::IAsyncAction DBStorage::RunTasks() {
    auto cancellationToken = co_await winrt::get_cancellation_token();
    co_await winrt::resume_background();
    while (!cancellationToken()) {
        decltype(m_tasks) tasks;
        sqlite3* db{ nullptr };
        {
            winrt::slim_lock_guard guard(m_lock);
            if (m_tasks.empty()) {
                m_action = nullptr;
                m_cv.notify_all();
                co_return;
            }
            std::swap(tasks, m_tasks);
            db = m_db;
        }

        for (auto& task : tasks) {
            task.Run(db);
            if (cancellationToken())
                break;
        }
    }
    winrt::slim_lock_guard guard(m_lock);
    m_action = nullptr;
    m_cv.notify_all();
}

void DBStorage::DBTask::Run(sqlite3* db) {
    switch (m_type) {
    case Type::multiGet:
        multiGet(db);
        break;
    case Type::multiSet:
        multiSet(db);
        break;
    case Type::multiRemove:
        multiRemove(db);
        break;
    case Type::clear:
        clear(db);
        break;
    case Type::getAllKeys:
        getAllKeys(db);
        break;
    }
}

void DBStorage::DBTask::multiGet(sqlite3* db) {
    if (!CheckArgs(db, m_args, m_callback)) {
        return;
    }

    auto argCount = static_cast<int>(m_args.size());
    auto sql = MakeSQLiteParameterizedStatement(u8"SELECT key, value FROM AsyncLocalStorage WHERE key IN ", argCount);
    auto pStmt = PrepareStatement(db, m_callback, sql.data());
    if (!pStmt) {
        return;
    }
    for (int i = 0; i < argCount; i++) {
        if (!BindString(db, m_callback, pStmt, i + 1, m_args[i].AsString()))
            return;
    }

    auto result = winrt::JSValueArray{};
    for (auto stepResult = sqlite3_step(pStmt.get()); stepResult != SQLITE_DONE; stepResult = sqlite3_step(pStmt.get())) {
        if (stepResult != SQLITE_ROW) {
            InvokeError(m_callback, sqlite3_errmsg(db));
            return;
        }

        auto key = reinterpret_cast<const char*>(sqlite3_column_text(pStmt.get(), 0));
        if (!key) {
            InvokeError(m_callback, sqlite3_errmsg(db));
            return;
        }
        auto value = reinterpret_cast<const char*>(sqlite3_column_text(pStmt.get(), 1));
        if (!value) {
            InvokeError(m_callback, sqlite3_errmsg(db));
            return;
        }
        result.push_back(winrt::JSValueArray({ key, value }));
    }
    auto writer = winrt::MakeJSValueTreeWriter();
    result.WriteTo(writer);
    std::vector<winrt::JSValue> callbackParams;
    callbackParams.push_back(winrt::JSValueArray());
    callbackParams.push_back(winrt::TakeJSValue(writer));
    m_callback(callbackParams);
}

void DBStorage::DBTask::multiSet(sqlite3* db) {
    Sqlite3Transaction transaction(db, m_callback);
    if (!transaction) {
        return;
    }
    auto pStmt = PrepareStatement(db, m_callback, u8"INSERT OR REPLACE INTO AsyncLocalStorage VALUES(?, ?)");
    if (!pStmt) {
        return;
    }
    for (auto&& arg : m_args) {
        if (!BindString(db, m_callback, pStmt, 1, arg[0].AsString()) ||
            !BindString(db, m_callback, pStmt, 2, arg[1].AsString())) {
            return;
        }
        auto rc = sqlite3_step(pStmt.get());
        if (rc != SQLITE_DONE && !CheckSQLiteResult(db, m_callback, rc)) {
            return;
        }
        if (!CheckSQLiteResult(db, m_callback, sqlite3_reset(pStmt.get()))) {
            return;
        }
    }
    if (!transaction.Commit()) {
        return;
    }
    std::vector<winrt::JSValue> callbackParams;
    callbackParams.push_back(winrt::JSValueArray());
    m_callback(callbackParams);
}

void DBStorage::DBTask::multiRemove(sqlite3* db) {
    if (!CheckArgs(db, m_args, m_callback)) {
        return;
    }

    auto argCount = static_cast<int>(m_args.size());
    auto sql = MakeSQLiteParameterizedStatement(u8"DELETE FROM AsyncLocalStorage WHERE key IN ", argCount);
    auto pStmt = PrepareStatement(db, m_callback, sql.data());
    if (!pStmt) {
        return;
    }
    for (int i = 0; i < argCount; i++) {
        if (!BindString(db, m_callback, pStmt, i+1, m_args[i].AsString())) {
            return;
        }
    }
    for (auto stepResult = sqlite3_step(pStmt.get()); stepResult != SQLITE_DONE; stepResult = sqlite3_step(pStmt.get())) {
        if (stepResult != SQLITE_ROW) {
            InvokeError(m_callback, sqlite3_errmsg(db));
            return;
        }
    }
    std::vector<winrt::JSValue> callbackParams;
    callbackParams.push_back(winrt::JSValueArray());
    m_callback(callbackParams);
}

void DBStorage::DBTask::getAllKeys(sqlite3* db) {
    winrt::JSValueArray result;
    auto getAllKeysCallback = [&](int cCol, char** rgszColText, char**) {
        if (cCol >= 1) {
            result.push_back(rgszColText[0]);
        }
        return SQLITE_OK;
    };

    if (Exec(db, m_callback, u8"SELECT key FROM AsyncLocalStorage", getAllKeysCallback)) {
        auto writer = winrt::MakeJSValueTreeWriter();
        result.WriteTo(writer);
        std::vector<winrt::JSValue> callbackParams;
        callbackParams.push_back(nullptr);
        callbackParams.push_back(winrt::TakeJSValue(writer));
        m_callback(callbackParams);
    }
}

void DBStorage::DBTask::clear(sqlite3* db) {
    if (Exec(db, m_callback, u8"DELETE FROM AsyncLocalStorage")) {
        std::vector<winrt::JSValue> callbackParams;
        callbackParams.push_back(nullptr);
        m_callback(callbackParams);
    }
}

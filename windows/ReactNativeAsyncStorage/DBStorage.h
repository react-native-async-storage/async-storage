// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
#pragma once

#include <winsqlite/winsqlite3.h>

#include "NativeModules.h"

class DBStorage
{
public:
    typedef std::function<void(std::vector<winrt::Microsoft::ReactNative::JSValue> const &)>
        Callback;

    class DBTask
    {
    public:
        enum class Type { multiGet, multiSet, multiRemove, clear, getAllKeys };

        DBTask(Type type,
               std::vector<winrt::Microsoft::ReactNative::JSValue> &&args,
               Callback &&callback)
            : m_type{type}, m_args{std::move(args)}, m_callback{std::move(callback)}
        {
        }

        DBTask(const DBTask &) = delete;
        DBTask(DBTask &&) = default;
        DBTask &operator=(const DBTask &) = delete;
        DBTask &operator=(DBTask &&) = default;
        void Run(sqlite3 *db);

    private:
        Type m_type;
        std::vector<winrt::Microsoft::ReactNative::JSValue> m_args;
        Callback m_callback;

        void multiGet(sqlite3 *db);
        void multiSet(sqlite3 *db);
        void multiRemove(sqlite3 *db);
        void clear(sqlite3 *db);
        void getAllKeys(sqlite3 *db);
    };

    DBStorage();
    ~DBStorage();

    void AddTask(DBTask::Type type,
                 std::vector<winrt::Microsoft::ReactNative::JSValue> &&args,
                 Callback &&jsCallback);

    void AddTask(DBTask::Type type, Callback &&jsCallback)
    {
        AddTask(type,
                std::move(std::vector<winrt::Microsoft::ReactNative::JSValue>()),
                std::move(jsCallback));
    }

    winrt::Windows::Foundation::IAsyncAction RunTasks();

private:
    static constexpr auto s_dbPathProperty = L"React-Native-Community-Async-Storage-Database-Path";

    sqlite3 *m_db;
    winrt::slim_mutex m_lock;
    winrt::slim_condition_variable m_cv;
    winrt::Windows::Foundation::IAsyncAction m_action{nullptr};
    std::vector<DBTask> m_tasks;

    std::string ConvertWstrToStr(const std::wstring &wstr);
};

#pragma once

#include "pch.h"
#include "NativeModules.h"
#include "DBStorage.h"

using namespace winrt::Microsoft::ReactNative;

namespace ReactNativeAsyncStorage
{
    REACT_MODULE(RNCAsyncStorage);
    struct RNCAsyncStorage
    {
        DBStorage dbStorage;

        REACT_METHOD(multiGet);
        void multiGet(std::vector<JSValue> keys, std::function<void(JSValueArray const& errors, JSValueArray const& results)>&& callback) noexcept {
            dbStorage.AddTask(DBStorage::DBTask::Type::multiGet, std::move(keys),
                [callback](std::vector<JSValue> const& callbackParams) {
                    if (callbackParams.size() > 0) {
                        auto& errors = callbackParams[0].AsArray();
                        if (callbackParams.size() > 1) {
                            callback(errors, callbackParams[1].AsArray());
                        }
                        else {
                            callback(errors, {});
                        }
                    }
                });
        }

        REACT_METHOD(multiSet);
        void multiSet(std::vector<JSValue> pairs, std::function<void(JSValueArray const&)>&& callback) noexcept {
            dbStorage.AddTask(DBStorage::DBTask::Type::multiSet, std::move(pairs),
                [callback](std::vector<JSValue> const& callbackParams) {
                    if (callbackParams.size() > 0) {
                        auto& errors = callbackParams[0].AsArray();
                        callback(errors);
                    }
                });
        }

        REACT_METHOD(multiRemove);
        void multiRemove(std::vector<JSValue> keys, std::function<void(JSValueArray const&)>&& callback) noexcept {
            dbStorage.AddTask(DBStorage::DBTask::Type::multiRemove, std::move(keys),
                [callback](std::vector<JSValue> const& callbackParams) {
                    if (callbackParams.size() > 0) {
                        auto& errors = callbackParams[0].AsArray();
                        callback(errors);
                    }
                });
        }

        REACT_METHOD(getAllKeys);
        void getAllKeys(std::function<void(JSValueArray const& errors, JSValueArray const& keys)>&& callback) noexcept {
            dbStorage.AddTask(DBStorage::DBTask::Type::getAllKeys,
                [callback](std::vector<JSValue> const& callbackParams) {
                    if (callbackParams.size() > 0) {
                        auto& errors = callbackParams[0].AsArray();
                        if (callbackParams.size() > 1) {
                            callback(errors, callbackParams[1].AsArray());
                        }
                        else {
                            callback(errors, {});
                        }
                    }
                });
        }

        REACT_METHOD(clear);
        void clear(std::function<void(JSValueArray const&)>&& callback) noexcept {
            dbStorage.AddTask(DBStorage::DBTask::Type::clear,
                [callback](std::vector<JSValue> const& callbackParams) {
                    if (callbackParams.size() > 0) {
                        auto& errors = callbackParams[0].AsArray();
                        callback(errors);
                    }
                });
        }
    };
}
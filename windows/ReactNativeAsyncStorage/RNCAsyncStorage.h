// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
#pragma once

#include "pch.h"
#include "NativeModules.h"
#include "DBStorage.h"

namespace winrt::ReactNativeAsyncStorage::implementation
{
    REACT_MODULE(RNCAsyncStorage);
    struct RNCAsyncStorage
    {
        DBStorage dbStorage;

        REACT_METHOD(multiGet);
        void multiGet(std::vector<JSValue> keys, std::function<void(JSValueArray const& errors, JSValueArray const& results)>&& callback) noexcept {
            dbStorage.AddTask(DBStorage::DBTask::Type::multiGet, std::move(keys),
                [callback{ std::move(callback) }](std::vector<JSValue> const& callbackParams) {
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
                [callback{ std::move(callback) }](std::vector<JSValue> const& callbackParams) {
                    if (callbackParams.size() > 0) {
                        auto& errors = callbackParams[0].AsArray();
                        callback(errors);
                    }
                });
        }

        REACT_METHOD(multiMerge);
        void multiMerge(std::vector<JSValue> pairs, std::function<void(JSValueArray const&)>&& callback) noexcept {
            std::vector<JSValue> keys;
            std::vector<std::string> newValues;
            for (const auto& pair : pairs) {
                keys.push_back(pair.AsArray()[0].AsString());
                newValues.push_back(pair.AsArray()[1].AsString());
            }

            multiGet(std::move(keys), [newValues{ std::move(newValues) }, callback{ std::move(callback) }, this](JSValueArray const& errors, JSValueArray const& results) {
                if (errors.size() > 0) {
                    callback(errors);
                    return;
                }

                std::vector<JSValue> mergedResults;

                for (int i = 0; i < results.size(); i++) {
                    auto& oldPair = results[i].AsArray();
                    auto& key = oldPair[0];
                    auto oldValue = oldPair[1].AsString();
                    auto& newValue = newValues[i];

                    winrt::Windows::Data::Json::JsonObject oldJson;
                    winrt::Windows::Data::Json::JsonObject newJson;
                    if (winrt::Windows::Data::Json::JsonObject::TryParse(winrt::to_hstring(oldValue), oldJson)
                        && winrt::Windows::Data::Json::JsonObject::TryParse(winrt::to_hstring(newValue), newJson)) {
                        MergeJsonObjects(oldJson, newJson);

                        JSValue value;
                        auto writer = MakeJSValueTreeWriter();
                        writer.WriteArrayBegin();
                        WriteValue(writer, key);
                        WriteValue(writer, oldJson.ToString());
                        writer.WriteArrayEnd();
                        mergedResults.push_back(TakeJSValue(writer));
                    }
                    else {
                        auto writer = MakeJSValueTreeWriter();
                        writer.WriteObjectBegin();
                        WriteProperty(writer, L"message", L"Values must be valid Json strings");
                        writer.WriteObjectEnd();
                        callback(JSValueArray{ TakeJSValue(writer) });
                        return;
                    }
                }

                multiSet(std::move(mergedResults), [callback{ std::move(callback) }](JSValueArray const& errors) {
                    callback(errors);
                    });
                });
        }

        REACT_METHOD(multiRemove);
        void multiRemove(std::vector<JSValue> keys, std::function<void(JSValueArray const&)>&& callback) noexcept {
            dbStorage.AddTask(DBStorage::DBTask::Type::multiRemove, std::move(keys),
                [callback{ std::move(callback) }](std::vector<JSValue> const& callbackParams) {
                    if (callbackParams.size() > 0) {
                        auto& errors = callbackParams[0].AsArray();
                        callback(errors);
                    }
                });
        }

        REACT_METHOD(getAllKeys);
        void getAllKeys(std::function<void(JSValue const& error, JSValueArray const& keys)>&& callback) noexcept {
            dbStorage.AddTask(DBStorage::DBTask::Type::getAllKeys,
                [callback{ std::move(callback) }](std::vector<JSValue> const& callbackParams) {
                    if (callbackParams.size() > 0) {
                        auto& error = callbackParams[0];
                        if (callbackParams.size() > 1) {
                            callback(error, callbackParams[1].AsArray());
                        }
                        else {
                            callback(error, {});
                        }
                    }
                });
        }

        REACT_METHOD(clear);
        void clear(std::function<void(JSValue const&)>&& callback) noexcept {
            dbStorage.AddTask(DBStorage::DBTask::Type::clear,
                [callback{ std::move(callback) }](std::vector<JSValue> const& callbackParams) {
                    if (callbackParams.size() > 0) {
                        auto& error = callbackParams[0];
                        callback(error);
                    }
                });
        }

        // Merge newJson into oldJson
        void MergeJsonObjects(winrt::Windows::Data::Json::JsonObject const& oldJson, winrt::Windows::Data::Json::JsonObject const& newJson) {
            for (auto pair : newJson) {
                auto key = pair.Key();
                auto newValue = pair.Value();
                if (newValue.ValueType() == winrt::Windows::Data::Json::JsonValueType::Object
                    && oldJson.HasKey(key)) {
                    auto oldValue = oldJson.GetNamedObject(key);
                    MergeJsonObjects(oldValue, newValue.GetObject());
                    oldJson.SetNamedValue(key, oldValue);
                }
                else {
                    oldJson.SetNamedValue(key, newValue);
                }
            }
        }
    };
}
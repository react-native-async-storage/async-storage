#include "pch.h"

#include "ReactNativeAsyncStorage.h"

namespace winrt::ReactNativeAsyncStorageAsyncStorage
{

// See https://microsoft.github.io/react-native-windows/docs/native-modules for details on writing native modules

void ReactNativeAsyncStorage::Initialize(React::ReactContext const &reactContext) noexcept {
  m_context = reactContext;
}

void ReactNativeAsyncStorage::multiGet(std::vector<std::string> const & keys, std::function<void(::React::JSValueArray const &, ::React::JSValueArray const &)> const & callback) noexcept {
  // temporarily unimplemented
}

void ReactNativeAsyncStorage::multiSet(::React::JSValueArray && kvPairs, std::function<void(::React::JSValueArray const &)> const & callback) noexcept {
  // temporarily unimplemented
}

void ReactNativeAsyncStorage::multiRemove(std::vector<std::string> const & keys, std::function<void(::React::JSValueArray const &)> const & callback) noexcept {
  // temporarily unimplemented
}

void ReactNativeAsyncStorage::multiMerge(::React::JSValueArray && kvPairs, std::function<void(::React::JSValueArray const &)> const & callback) noexcept {
  // temporarily unimplemented
}

void ReactNativeAsyncStorage::getAllKeys(std::function<void(::React::JSValueArray const &, ::React::JSValueArray const &)> const & callback) noexcept {
  // temporarily unimplemented
}

void ReactNativeAsyncStorage::clear(std::function<void(::React::JSValueArray const &)> const & callback) noexcept {
  // temporarily unimplemented
}

} // namespace winrt::ReactNativeAsyncStorageAsyncStorage
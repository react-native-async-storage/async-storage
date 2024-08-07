#pragma once

#include "pch.h"
#include "resource.h"

#if __has_include("codegen\NativeAsyncStorageDataTypes.g.h")
  #include "codegen\NativeAsyncStorageDataTypes.g.h"
#endif
#include "codegen\NativeAsyncStorageModuleSpec.g.h"

#include "NativeModules.h"

namespace winrt::ReactNativeAsyncStorageAsyncStorage
{

REACT_MODULE(ReactNativeAsyncStorage)
struct ReactNativeAsyncStorage
{
  using ModuleSpec = ReactNativeAsyncStorageAsyncStorageCodegen::AsyncStorageModuleSpec;

  REACT_INIT(Initialize)
  void Initialize(React::ReactContext const &reactContext) noexcept;

  REACT_METHOD(multiGet)
  void multiGet(std::vector<std::string> const & keys, std::function<void(::React::JSValueArray const &, ::React::JSValueArray const &)> const & callback) noexcept;

  REACT_METHOD(multiSet)
  void multiSet(::React::JSValueArray && kvPairs, std::function<void(::React::JSValueArray const &)> const & callback) noexcept;

  REACT_METHOD(multiRemove)
  void multiRemove(std::vector<std::string> const & keys, std::function<void(::React::JSValueArray const &)> const & callback) noexcept;

  REACT_METHOD(multiMerge)
  void multiMerge(::React::JSValueArray && kvPairs, std::function<void(::React::JSValueArray const &)> const & callback) noexcept;

  REACT_METHOD(getAllKeys)
  void getAllKeys(std::function<void(::React::JSValueArray const &, ::React::JSValueArray const &)> const & callback) noexcept;

  REACT_METHOD(clear)
  void clear(std::function<void(::React::JSValueArray const &)> const & callback) noexcept;

private:
  React::ReactContext m_context;
};

} // namespace winrt::ReactNativeAsyncStorageAsyncStorage
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

  REACT_SYNC_METHOD(multiply)
  double multiply(double a, double b) noexcept;

private:
  React::ReactContext m_context;
};

} // namespace winrt::ReactNativeAsyncStorageAsyncStorage
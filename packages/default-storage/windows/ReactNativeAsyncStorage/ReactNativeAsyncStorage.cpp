#include "pch.h"

#include "ReactNativeAsyncStorage.h"

namespace winrt::ReactNativeAsyncStorageAsyncStorage
{

// See https://microsoft.github.io/react-native-windows/docs/native-modules for details on writing native modules

void ReactNativeAsyncStorage::Initialize(React::ReactContext const &reactContext) noexcept {
  m_context = reactContext;
}

double ReactNativeAsyncStorage::multiply(double a, double b) noexcept {
  return a * b;
}

} // namespace winrt::ReactNativeAsyncStorageAsyncStorage
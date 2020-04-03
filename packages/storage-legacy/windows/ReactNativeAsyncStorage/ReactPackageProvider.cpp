#include "pch.h"
#include "ReactPackageProvider.h"
#include "ReactPackageProvider.g.cpp"
#include "RNCAsyncStorage.h"

using namespace winrt::Microsoft::ReactNative;
using namespace ReactNativeAsyncStorage;

namespace winrt::ReactNativeAsyncStorage::implementation {

    void ReactPackageProvider::CreatePackage(IReactPackageBuilder const& packageBuilder) noexcept {
        AddAttributedModules(packageBuilder);
    }

} // namespace winrt::ReactNativeAsyncStorage::implementation

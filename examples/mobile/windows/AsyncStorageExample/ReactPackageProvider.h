#pragma once

#include "winrt/Microsoft.ReactNative.h"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::AsyncStorageExample::implementation
{

    struct ReactPackageProvider : winrt::implements<ReactPackageProvider, IReactPackageProvider>
    {
    public: // IReactPackageProvider
        void CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept;
    };

} // namespace winrt::AsyncStorageExample::implementation



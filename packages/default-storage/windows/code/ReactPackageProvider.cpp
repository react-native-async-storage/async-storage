// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
#include "pch.h"

#include "ReactPackageProvider.h"

#include "RNCAsyncStorage.h"
#include "ReactPackageProvider.g.cpp"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::ReactNativeAsyncStorage::implementation
{

    void ReactPackageProvider::CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept
    {
    #ifdef USE_FABRIC    
        AddAttributedModules(packageBuilder, true);
    #else
        AddAttributedModules(packageBuilder);
    #endif
    }

}  // namespace winrt::ReactNativeAsyncStorage::implementation

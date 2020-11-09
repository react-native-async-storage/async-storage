#pragma once

#include "App.xaml.g.h"

namespace winrt::AsyncStorageExample::implementation
{
    struct App : AppT<App> {
        App() noexcept;
    };
}  // namespace winrt::AsyncStorageExample::implementation

#include "pch.h"

#include "App.h"

#include "ReactPackageProvider.h"

using namespace winrt::AsyncStorageExample;
using namespace winrt::AsyncStorageExample::implementation;

/// <summary>
/// Initializes the singleton application object.  This is the first line of
/// authored code executed, and as such is the logical equivalent of main() or
/// WinMain().
/// </summary>
App::App() noexcept
{
    MainComponentName(L"AsyncStorageExample");

#if BUNDLE
    JavaScriptBundleFile(L"index.windows");
    InstanceSettings().UseWebDebugger(false);
    InstanceSettings().UseFastRefresh(false);
#else
    JavaScriptMainModuleName(L"example/index");
    InstanceSettings().UseWebDebugger(true);
    InstanceSettings().UseFastRefresh(true);
#endif

#if _DEBUG
    InstanceSettings().EnableDeveloperMenu(true);
#else
    InstanceSettings().EnableDeveloperMenu(false);
#endif

    // Includes all modules in this project
    PackageProviders().Append(make<ReactPackageProvider>());
    PackageProviders().Append(winrt::ReactNativeAsyncStorage::ReactPackageProvider());

    REACT_REGISTER_NATIVE_MODULE_PACKAGES();  // code-gen macro from autolink

    InitializeComponent();
}

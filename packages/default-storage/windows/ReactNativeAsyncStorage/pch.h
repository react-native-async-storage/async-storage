// pch.h : include file for standard system include files,
// or project specific include files that are used frequently, but
// are changed infrequently
//

#pragma once

#include "targetver.h"

#define NOMINMAX 1
#define WIN32_LEAN_AND_MEAN 1
#define WINRT_LEAN_AND_MEAN 1

// Windows Header Files
#include <windows.h>
#undef GetCurrentTime
#include <unknwn.h>

// WinRT Header Files
#include <CppWinRTIncludes.h>

#include <winrt/Microsoft.ReactNative.h>
#include <winrt/base.h>

// C RunTime Header Files
#include <malloc.h>
#include <memory.h>
#include <stdlib.h>
#include <tchar.h>

// Reference additional headers your project requires here
#include <functional>

#include <winrt/Windows.ApplicationModel.Core.h>
#include <winrt/Windows.Data.Json.h>
#include <winrt/Windows.Foundation.Collections.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Storage.h>

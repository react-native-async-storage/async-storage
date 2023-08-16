#!/bin/bash
set -eo pipefail

BUILD_ACTIONS="$@"

if [[ "$CCACHE_DISABLE" != "1" ]]; then
  if ! command -v ccache 1> /dev/null; then
    brew install ccache
  fi

  CCACHE_HOME=$(dirname $(dirname $(which ccache)))/opt/ccache

  export CCACHE_DIR="$(git rev-parse --show-toplevel)/packages/default-storage-backend/.ccache"

  export CC="${CCACHE_HOME}/libexec/clang"
  export CXX="${CCACHE_HOME}/libexec/clang++"
  export CMAKE_C_COMPILER_LAUNCHER=$(which ccache)
  export CMAKE_CXX_COMPILER_LAUNCHER=$(which ccache)

  ccache --zero-stats 1> /dev/null
fi

# Workaround for `Element StaticText, {{163.0, 836.0}, {156.0, 21.0}}, value: Set native delegate is not hittable`.
# This occurs when a button is not visible in the window. We resize the window
# here to ensure that it is.
defaults write com.microsoft.ReactTestApp "NSWindow Frame MainWindow" "0 0 800 500 0 0 2560 1417 "

xcodebuild \
  -workspace example/macos/AsyncStorageExample.xcworkspace \
  -scheme ReactTestApp \
  -configuration Release \
  -sdk macosx \
  -derivedDataPath example/macos/build \
  $BUILD_ACTIONS

if [[ "$CCACHE_DISABLE" != "1" ]]; then
  ccache --show-stats --verbose
fi

exit $?

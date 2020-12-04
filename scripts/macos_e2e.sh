#!/bin/bash

BUILD_ACTIONS="$@"

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

exit $?

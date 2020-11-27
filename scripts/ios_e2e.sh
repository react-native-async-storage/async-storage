#!/bin/bash

RESOURCE_DIR="$PWD/example/ios/build/Build/Products/Release-iphonesimulator/ReactTestApp.app"
ENTRY_FILE="example/index.js"
BUNDLE_FILE="$RESOURCE_DIR/main.jsbundle"
EXTRA_PACKAGER_ARGS="--entry-file=$ENTRY_FILE"
SIMULATOR_NAME="iPhone 11"

build_project() {
  echo "[Detox e2e] Building iOS project"
  eval "xcodebuild \
    -workspace example/ios/AsyncStorageExample.xcworkspace \
    -scheme ReactTestApp \
    -configuration Release \
    -sdk iphonesimulator \
    -derivedDataPath example/ios/build \
    BUNDLE_FILE=$BUNDLE_FILE \
    EXTRA_PACKAGER_ARGS=$EXTRA_PACKAGER_ARGS"
}

run_simulator() {

  # Find simulator
  devDir=`xcode-select -p`
  devDir=$devDir/Applications/Simulator.app

  # parse output
  availableDevices=$(
    eval "xcrun simctl list devices" |\
    eval "sed '/"$SIMULATOR_NAME"/!d'" |\
    eval "sed '/unavailable/d'" |\
    eval "sed 's/(Shutdown)//; s/(Shutting Down)//; s/(Booted)//; s/ (/*/; s/)//'"
  )

  IFS='*' read -a deviceInfo <<< "$availableDevices"

  if [[ $deviceInfo == "" ]]; then
    echo "[Detox e2e] Could not find device: $SIMULATOR_NAME" >&2
    exit;
  fi

  deviceUUID=${deviceInfo[1]}

  echo "[Detox e2e] Booting up $SIMULATOR_NAME (id: $deviceUUID)"

  # Booting emulator in headless mode
  eval "open $devDir --args -CurrentDeviceUDID $deviceUUID"
  eval "xcrun instruments -w $deviceUUID" >/dev/null 2>&1
  exit 0
}

bundle_js() {
  extraArgs="$@"
  echo
  echo "[Detox e2e] Bundling JS"
  react-native bundle --entry-file index.js --platform ios --bundle-output example/index.ios.jsbundle $extraArgs
}


case $1 in
  build)
    build_project
    ;;
  run_simulator)
    run_simulator
    ;;
  bundle)
    shift; bundle_js $@
    ;;
  *)
    echo -n "Unknown argument: $1"
    ;;
esac

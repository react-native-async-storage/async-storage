#!/bin/bash

RESOURCE_DIR="$PWD/example/ios/build/Build/Products/Release-iphonesimulator/ReactTestApp.app"
ENTRY_FILE="example/index.ts"
BUNDLE_FILE="$RESOURCE_DIR/main.jsbundle"
EXTRA_PACKAGER_ARGS="--entry-file=$ENTRY_FILE"
SIMULATOR_NAME="iPhone 14"

build_project() {
  echo "[iOS E2E] Building iOS project"
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
    echo "[iOS E2E] Could not find device: $SIMULATOR_NAME" >&2
    exit;
  fi

  deviceUUID=${deviceInfo[1]}

  echo "[iOS E2E] Booting up $SIMULATOR_NAME (id: $deviceUUID)"

  # Booting emulator in headless mode
  eval "open $devDir --args -CurrentDeviceUDID $deviceUUID"
  eval "xcrun instruments -w $deviceUUID" >/dev/null 2>&1
  exit 0
}

bundle_js() {
  extraArgs="$@"
  echo
  echo "[iOS E2E] Bundling JS"
  react-native bundle --entry-file index.ts --platform ios --bundle-output example/index.ios.jsbundle $extraArgs
}

assert_appium_server_running() {
  RES=$(curl -Is "http://0.0.0.0:4723/status" | grep HTTP | cut -d ' ' -f2)

  if [ "$RES" != "200" ]; then
    echo "[iOS E2E] Appium server not running! Try starting it:"
    echo
    echo "yarn appium --config example/appium.config.js"
    echo
    exit 2
  fi;
}

run_e2e_test() {
  export NODE_OPTIONS=--experimental-vm-modules
  export E2E_PLATFORM=ios
  assert_appium_server_running

  echo "[iOS E2E] Running tests"
  jest --config example/jest.config.ts --roots=$PWD
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
  test)
    run_e2e_test
    ;;
  *)
    echo -n "Unknown argument: $1"
    ;;
esac

#!/bin/bash

RESOURCE_DIR="$PWD/example/ios/build/Build/Products/Release-iphonesimulator/AsyncStorageExample.app"
ENTRY_FILE="example/index.js"
BUNDLE_FILE="$RESOURCE_DIR/main.jsbundle"
EXTRA_PACKAGER_ARGS="--entry-file=$ENTRY_FILE"


build_project() {
  echo "[Detox e2e] Building iOS project"
  eval "xcodebuild \
    -project example/ios/AsyncStorageExample.xcodeproj \
    -scheme AsyncStorageExample \
    -configuration Release \
    -sdk iphonesimulator \
    -derivedDataPath example/ios/build \
    -UseModernBuildSystem=NO \
    BUNDLE_FILE=$BUNDLE_FILE \
    EXTRA_PACKAGER_ARGS=$EXTRA_PACKAGER_ARGS"
}

run_simulator() {
  if [[ -n $1 ]]; then
    deviceName=$1
  else
    echo "[Detox e2e] Device name not passed!" >&2;
    exit;
  fi


  if [[ $2 = "headless" ]]; then
    runHeadless=1
  else
    runHeadless=0
  fi

  # Find simulator
  devDir=`xcode-select -p`
  devDir=$devDir/Applications/Simulator.app

  # parse output
  availableDevices=$(
    eval "xcrun simctl list devices" |\
    eval "sed '/"$deviceName"/!d'" |\
    eval "sed '/unavailable/d'" |\
    eval "sed 's/(Shutdown)//; s/(Shutting Down)//; s/(Booted)//; s/ (/*/; s/)//'"
  )

  IFS='*' read -a deviceInfo <<< "$availableDevices"

  if [[ $deviceInfo == "" ]]; then
    echo "[Detox e2e] Could not find device: $deviceName" >&2
    exit;
  fi


  deviceUUID=${deviceInfo[1]}

  echo "[Detox e2e] Booting up $deviceName (id: $deviceUUID)"

  # Booting emulator in headless mode
  eval "open $devDir --args -CurrentDeviceUDID $deviceUUID"

  # Decide if should run headless or not
  if [ "$runHeadless" -eq 0 ]; then 
    eval "xcrun instruments -w $deviceUUID" >/dev/null 2>&1 
  else
    echo "[Detox e2e] Running simulator in headless mode."
  fi
}


build_project

sleep 2

run_simulator "$1" "$2"

sleep 10

exit 0

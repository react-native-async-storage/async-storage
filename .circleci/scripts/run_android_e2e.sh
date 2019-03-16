#!/bin/bash

# On CI, waits for emu to be booted
# Locally, builds apk

ROOT_DIR=$PWD

INTERVAL=5 # 5 secs between each check
MAX_RETRIES=60 # wait max 5 minutes for emu to boot

build_apk() {
  echo
  echo "[Detox e2e] Building APK"
  cd "example/android"
  eval "./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release"
  cd ${ROOT_DIR}
}

wait_for_emulator_to_boot() {
  isBooted=$(adb shell getprop sys.boot_completed 2>&1 | tr -d '\r')
  retriesLeft=${MAX_RETRIES}

  echo
  echo "[Detox e2e] Checking if emulator is booted up."

  while [[ "$isBooted" != "1" ]]; do

    if [[ ${retriesLeft} -eq 0 ]]; then
      echo "[Detox e2e] Seems like emulator could not be booted." 1>&2
      exit 125
    fi

    isBooted=$(adb shell getprop sys.boot_completed 2>&1 | tr -d '\r')

    retriesLeft=$((retriesLeft - 1))
    echo "[Detox e2e] $retriesLeft checks left."
    sleep ${INTERVAL}
  done

  echo "[Detox e2e] Emulator booted."
}

if [[ -n $CIRCLECI ]]; then
    wait_for_emulator_to_boot # Run it on CI
else
    build_apk # Run locally
fi

#!/bin/bash

# Builds apk, waits for emulator to be booted up and install apk on it.

ROOT_DIR=$PWD

INTERVAL=5
MAX_RETRIES=11

build_apk() {
  echo
  echo "[Detox e2e] Building APK"
  cd "example/android"
  eval "./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release"
  cd ${ROOT_DIR}
}

wait_for_emulator_to_boot() {
  isBooted=""
  retriesLeft=${MAX_RETRIES}

  echo
  echo "[Detox e2e] Checking if emulator is booted up."

  isBooted=1

  while [[ ${isBooted} != "1" ]]; do

    if [[ ${retriesLeft} -eq 0 ]]; then
      echo "[Detox e2e] Emulator could not be booted." 1>&2
      exit 125
    fi

    isBooted=$(adb -e shell getprop sys.boot_completed 2>&1)

    retriesLeft=$((retriesLeft - 1))
    echo "[Detox e2e] $retriesLeft checks left."
    sleep ${INTERVAL}
  done

  echo "[Detox e2e] Emulator booted."
}

build_apk

if [ -n ${CIRCLECI} ]; then
    wait_for_emulator_to_boot
fi

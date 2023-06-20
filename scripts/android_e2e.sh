#!/bin/bash

INTERVAL=5 # 5 secs between each check
MAX_RETRIES=60 # wait max 5 minutes for emu to boot

build_apk() {
  echo
  echo "[Android E2E] Building APK"
  (cd example/android; ./gradlew assembleRelease -PAsyncStorage_useNextStorage=false --max-workers 2)
}

bundle_js() {
  extraArgs="$@"
  echo
  echo "[Android E2E] Bundling JS"
  react-native bundle --entry-file index.ts --platform android --bundle-output example/index.android.jsbundle $extraArgs
}

wait_for_emulator_to_boot() {
  isBooted=$(adb shell getprop sys.boot_completed 2>&1 | tr -d '\r')
  retriesLeft=${MAX_RETRIES}

  echo
  echo "[Android E2E] Checking if emulator is booted up."

  while [[ "$isBooted" != "1" ]]; do

    if [[ ${retriesLeft} -eq 0 ]]; then
      echo "[Android E2E] Seems like emulator could not be booted." 1>&2
      exit 125
    fi

    isBooted=$(adb shell getprop sys.boot_completed 2>&1 | tr -d '\r')

    retriesLeft=$((retriesLeft - 1))
    echo "[Android E2E] $retriesLeft checks left."
    sleep ${INTERVAL}
  done

  echo "[Android E2E] Emulator booted."
}

assert_appium_server_running() {
  RES=$(curl -Is "http://0.0.0.0:4723/status" | grep HTTP | cut -d ' ' -f2)

  if [ "$RES" != "200" ]; then
    echo "[Android E2E] Appium server not running! Try starting it:"
    echo
    echo "yarn appium --config example/appium.config.js"
    echo
    exit 2
  fi;
}

run_e2e_test() {
  export NODE_OPTIONS=--experimental-vm-modules
  export E2E_PLATFORM=android
  assert_appium_server_running

  echo "[Android E2E] Running tests"
  jest --config example/jest.config.ts --roots=$PWD
}

case $1 in
  wait_for_emulator)
    wait_for_emulator_to_boot
    ;;
  build)
    build_apk
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


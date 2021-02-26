#!/bin/bash

INTERVAL=5 # 5 secs between each check
MAX_RETRIES=60 # wait max 5 minutes for emu to boot

build_apk() {
  echo
  echo "[Detox e2e] Building APK"
  (cd example/android; ./gradlew assembleRelease assembleAndroidTest -PAsyncStorage_useNextStorage=false -DtestBuildType=release --max-workers 2)
}

bundle_js() {
  extraArgs="$@"
  echo
  echo "[Detox e2e] Bundling JS"
  react-native bundle --entry-file index.js --platform android --bundle-output example/index.android.jsbundle $extraArgs
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
  *)
    echo -n "Unknown argument: $1"
    ;;
esac


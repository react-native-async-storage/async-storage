#!/bin/bash

build_apk() {
  echo
  echo "[Android E2E] Building APK"
  (cd example/android; ./gradlew assembleRelease -PAsyncStorage_useNextStorage=false --max-workers 2)
}

bundle_js() {
  extraArgs="$@"
  echo
  echo "[Android E2E] Bundling JS"
  react-native bundle --entry-file index.ts --platform android --bundle-output example/index.android.jsbundle --dev false $extraArgs
}


run_e2e_test() {
  echo "[Android E2E] Running tests"
  wdio run example/__tests__/android.conf.ts
}

case $1 in
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


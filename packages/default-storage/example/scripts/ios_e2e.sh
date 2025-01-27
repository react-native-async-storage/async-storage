#!/bin/bash

build_project() {
  echo "[iOS E2E] Building iOS project"
  eval "xcodebuild \
    -workspace ios/AsyncStorageExample.xcworkspace \
    -scheme ReactTestApp \
    -configuration Release \
    -sdk iphonesimulator \
    -derivedDataPath ios/build"
}

bundle_js() {
  extraArgs="$@"
  echo
  echo "[iOS E2E] Bundling JS"
  react-native bundle --entry-file index.ts --platform ios --bundle-output main.ios.bundle --dev false $extraArgs
}

run_e2e_test() {
  echo "[iOS E2E] Running tests"
  wdio run __tests__/ios.conf.ts
}


case $1 in
  build)
    build_project
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

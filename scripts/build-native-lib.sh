#!/bin/sh

set -e

MODULE_NAME="shared-storage"
RN_MODULE_DIR="packages/async-storage"

ANDROID_BUILD_TASK="bundleAndroidMainAar"
ANDROID_OUTPUT_NAME="local_repo" # Maven local repo
ANDROID_OUTPUT_DIR="$MODULE_NAME/build"
ANDROID_RN_OUTPUT_DIR="$RN_MODULE_DIR/android"
ANDROID_PUBLISH_TASK="publishAndroidPublicationToLocalRepoRepository"

APPLE_BUILD_TASK="assembleSharedAsyncStorageReleaseXCFramework"
APPLE_OUTPUT_NAME="SharedAsyncStorage.xcframework"
APPLE_OUTPUT_DIR="$MODULE_NAME/build/XCFrameworks/release"
APPLE_RN_OUTPUT_DIR="$RN_MODULE_DIR/apple-frameworks"



build_android() {
  log "👷 Assembling android shared-storage"
  ./gradlew :$MODULE_NAME:$ANDROID_BUILD_TASK

  log "Publishing binaries to local repo"
  ./gradlew :$MODULE_NAME:$ANDROID_PUBLISH_TASK

  log "Remove old local repo"
  rm -rf $ANDROID_RN_OUTPUT_DIR/$ANDROID_OUTPUT_NAME

  log "Moving local repo to RN target"
  mv $ANDROID_OUTPUT_DIR/$ANDROID_OUTPUT_NAME $ANDROID_RN_OUTPUT_DIR/$ANDROID_OUTPUT_NAME

  log "🚀 all done"
}

build_apple() {
  log "👷 Assembling apple shared-storage"
  ./gradlew :$MODULE_NAME:$APPLE_BUILD_TASK

  log "recreate Frameworks dir"
  rm -rf $APPLE_RN_OUTPUT_DIR
  mkdir $APPLE_RN_OUTPUT_DIR

  log "move xcframework to RN module"
  mv $APPLE_OUTPUT_DIR/$APPLE_OUTPUT_NAME $APPLE_RN_OUTPUT_DIR/$APPLE_OUTPUT_NAME


  # because osx is using symlinks for versioning, distributing its framework via
  # npm won't work - compression via tar breaks the link.
  # therefore this script resolves the symlinks into actual folders, to match
  # expected structure by macos.
  MAC_OS_FRAMEWORK="$APPLE_RN_OUTPUT_DIR/SharedAsyncStorage.xcframework/macos-arm64_x86_64/SharedAsyncStorage.framework"

  log "fixing macos symlinks"

  # symlinks
  rm "$MAC_OS_FRAMEWORK/Headers" "$MAC_OS_FRAMEWORK/Modules" "$MAC_OS_FRAMEWORK/Resources" "$MAC_OS_FRAMEWORK/SharedAsyncStorage"

  cp -rL "$MAC_OS_FRAMEWORK/Versions/A/Headers" "$MAC_OS_FRAMEWORK/"
  cp -rL "$MAC_OS_FRAMEWORK/Versions/A/Modules" "$MAC_OS_FRAMEWORK/"
  cp -rL "$MAC_OS_FRAMEWORK/Versions/A/Resources" "$MAC_OS_FRAMEWORK/"
  cp -L "$MAC_OS_FRAMEWORK/Versions/A/SharedAsyncStorage" "$MAC_OS_FRAMEWORK/"

  # clear versions, not needed
  rm -r "$MAC_OS_FRAMEWORK/Versions"

  log "🚀 all done"
}

log() {
  local message="$1"
  echo "[AsyncStorage] $message"
}

TARGET=$1

case "$TARGET" in
  android)
    build_android
    ;;
  apple)
    build_apple
    ;;
  all)
    build_all
    ;;
  *)
    echo "Usage: $0 {android|apple}"
    exit 1
    ;;
esac


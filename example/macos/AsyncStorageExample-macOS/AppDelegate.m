/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import "RNCTestAsyncStorageDelegate.h"
#import <RNCAsyncStorage/RNCAsyncStorage.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>

@interface AppDelegate () <RCTBridgeDelegate>

@end

@implementation AppDelegate {
  RNCTestAsyncStorageDelegate *_testDelegate;
}

- (void)awakeFromNib {
  [super awakeFromNib];

  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
  
  _memoryStorage = [NSMutableDictionary dictionary];
}

- (void)application:(NSApplication *)application openURLs:(NSArray<NSURL *> *)urls {
  NSURL *url = [urls firstObject];
  
  if (![url.scheme isEqualToString:@"rnc-asyncstorage"]) {
    return;
  }

  if ([url.host isEqualToString:@"set-delegate"]) {
    if (_testDelegate == nil) {
      _testDelegate = [RNCTestAsyncStorageDelegate new];
    }
    RNCAsyncStorage *asyncStorage = [_bridge moduleForClass:[RNCAsyncStorage class]];
    asyncStorage.delegate = _testDelegate;
  } else if ([url.host isEqualToString:@"unset-delegate"]) {
    RNCAsyncStorage *asyncStorage = [_bridge moduleForClass:[RNCAsyncStorage class]];
    asyncStorage.delegate = nil;
  } else if ([url.host isEqualToString:@"clear-all-data"]) {
    [RNCAsyncStorage clearAllData];
  }
}

#pragma mark - RCTBridgeDelegate Methods

- (NSURL *)sourceURLForBridge:(__unused RCTBridge *)bridge {
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"example/index" fallbackResource:@"main"]; // .jsbundle;
}

@end

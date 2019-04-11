/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import "AppDelegate+RNCAsyncStorageDelegate.h"
#import "RNCTestAsyncStorageDelegate.h"

#import <RNCAsyncStorage/RNCAsyncStorage.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTDevMenu.h>
#import <React/RCTRootView.h>

@implementation AppDelegate {
  __weak RCTBridge *_bridge;
  RNCTestAsyncStorageDelegate *_testDelegate;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(didLoadJavaScript:)
                                               name:RCTJavaScriptDidLoadNotification
                                             object:nil];

  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"example/index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"AsyncStorageExample"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor blackColor];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)addDevMenuItemsForBridge:(RCTBridge *)bridge
{
  _memoryStorage = [NSMutableDictionary dictionary];

  __weak AppDelegate *weakSelf = self;
  RCTDevMenuItem *delegateToggle = [RCTDevMenuItem
      buttonItemWithTitleBlock:^NSString * {
        RNCAsyncStorage *asyncStorage = [bridge moduleForClass:[RNCAsyncStorage class]];
        return asyncStorage.delegate == nil ? @"Set AsyncStorage Delegate"
                                            : @"Unset AsyncStorage Delegate";
      }
      handler:^{
        RNCAsyncStorage *asyncStorage = [bridge moduleForClass:[RNCAsyncStorage class]];
        asyncStorage.delegate = asyncStorage.delegate == nil ? weakSelf : nil;
      }];
  [bridge.devMenu addItem:delegateToggle];
}

- (void)didLoadJavaScript:(NSNotification *)note
{
  RCTBridge *bridge = note.userInfo[@"bridge"];
  if (bridge == nil) {
    return;
  }

  _bridge = bridge;
  [self addDevMenuItemsForBridge:bridge];
}

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  if (![url.scheme isEqualToString:@"rnc-asyncstorage"]) {
    return NO;
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
  }

  return YES;
}

@end

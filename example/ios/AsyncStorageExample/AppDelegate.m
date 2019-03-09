/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <RNCAsyncStorage/RNCAsyncStorage.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTDevMenu.h>
#import <React/RCTRootView.h>

@implementation AppDelegate {
  NSMutableDictionary<NSString *, NSString *> *_memoryStorage;
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

  [self addDevMenuItemsForBridge:bridge];
}

#pragma mark - RNCAsyncStorageDelegate

- (void)allKeys:(nonnull RNCAsyncStorageResultCallback)completion
{
  completion(_memoryStorage.allKeys);
}

- (void)mergeValues:(nonnull NSArray<NSString *> *)values
            forKeys:(nonnull NSArray<NSString *> *)keys
         completion:(nonnull RNCAsyncStorageResultCallback)block
{
}

- (void)removeAllValues:(nonnull RNCAsyncStorageCompletion)completion
{
  [_memoryStorage removeAllObjects];
  completion(nil);
}

- (void)removeValuesForKeys:(nonnull NSArray<NSString *> *)keys
                 completion:(nonnull RNCAsyncStorageResultCallback)completion
{
  for (NSString *key in keys) {
    [_memoryStorage removeObjectForKey:key];
  }
  completion(@[]);
}

- (void)setValues:(nonnull NSArray<NSString *> *)values
          forKeys:(nonnull NSArray<NSString *> *)keys
       completion:(nonnull RNCAsyncStorageResultCallback)completion
{
  for (NSUInteger i = 0; i < values.count; ++i) {
    NSString *value = values[i];
    NSString *key = keys[i];
    [_memoryStorage setObject:value forKey:key];
  }
  completion(@[]);
}

- (void)valuesForKeys:(nonnull NSArray<NSString *> *)keys
           completion:(nonnull RNCAsyncStorageResultCallback)completion
{
  NSMutableArray *values = [NSMutableArray arrayWithCapacity:keys.count];
  for (NSString *key in keys) {
    NSString *value = _memoryStorage[key];
    [values addObject:value == nil ? [NSNull null] : value];
  }
  completion(values);
}

@end

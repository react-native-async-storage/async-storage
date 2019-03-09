/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>

#import <RNCAsyncStorage/RNCAsyncStorageDelegate.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RNCAsyncStorageDelegate>

@property (nonatomic, strong) UIWindow *window;

@end

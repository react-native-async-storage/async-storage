/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <RNCAsyncStorage/RNCAsyncStorageDelegate.h>

/*!
 * Implementation of |RNCAsyncStorageDelegate| used for E2E testing purposes only.
 */
@interface RNCTestAsyncStorageDelegate : NSObject <RNCAsyncStorageDelegate>
@end

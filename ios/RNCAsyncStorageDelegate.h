/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^RNCAsyncStorageCompletion)(NSError *_Nullable error);
typedef void (^RNCAsyncStorageResultCallback)(NSArray<id<NSObject>> * valuesOrErrors);

@protocol RNCAsyncStorageDelegate <NSObject>

- (void)allKeys:(RNCAsyncStorageResultCallback)block;

- (void)mergeValues:(NSArray<NSString *> *)values
            forKeys:(NSArray<NSString *> *)keys
         completion:(RNCAsyncStorageResultCallback)block;

- (void)removeAllValues:(RNCAsyncStorageCompletion)block;

- (void)removeValuesForKeys:(NSArray<NSString *> *)keys
                 completion:(RNCAsyncStorageResultCallback)block;

- (void)setValues:(NSArray<NSString *> *)values
          forKeys:(NSArray<NSString *> *)keys
       completion:(RNCAsyncStorageResultCallback)block;

- (void)valuesForKeys:(NSArray<NSString *> *)keys
           completion:(RNCAsyncStorageResultCallback)block;

@optional

@property (nonatomic, readonly, getter=isPassthrough) BOOL passthrough;

@end

NS_ASSUME_NONNULL_END

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate+RNCAsyncStorageDelegate.h"

#import <RNCAsyncStorage/RNCAsyncStorage.h>

@implementation AppDelegate (RNCAsyncStorageDelegate)

- (void)allKeys:(nonnull RNCAsyncStorageResultCallback)completion
{
  completion(self.memoryStorage.allKeys);
}

- (void)mergeValues:(nonnull NSArray<NSString *> *)values
            forKeys:(nonnull NSArray<NSString *> *)keys
         completion:(nonnull RNCAsyncStorageResultCallback)block
{
  [NSException raise:@"Unimplemented"
              format:@"%@ is unimplemented", NSStringFromSelector(_cmd)];
}

- (void)removeAllValues:(nonnull RNCAsyncStorageCompletion)completion
{
  [self.memoryStorage removeAllObjects];
  completion(nil);
}

- (void)removeValuesForKeys:(nonnull NSArray<NSString *> *)keys
                 completion:(nonnull RNCAsyncStorageResultCallback)completion
{
  for (NSString *key in keys) {
    [self.memoryStorage removeObjectForKey:key];
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
    [self.memoryStorage setObject:value forKey:key];
  }
  completion(@[]);
}

- (void)valuesForKeys:(nonnull NSArray<NSString *> *)keys
           completion:(nonnull RNCAsyncStorageResultCallback)completion
{
  NSMutableArray *values = [NSMutableArray arrayWithCapacity:keys.count];
  for (NSString *key in keys) {
    NSString *value = self.memoryStorage[key];
    [values addObject:value == nil ? [NSNull null] : value];
  }
  completion(values);
}

@end

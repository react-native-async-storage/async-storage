/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNCTestAsyncStorageDelegate.h"

const NSInteger RNCTestAsyncStorageExtraValue = 1000000;

NSString *RNCTestAddExtraValue(NSString *value)
{
  NSInteger i = [value integerValue];
  if (i == 0) {
    return value;
  }
  return [NSString stringWithFormat:@"%ld", (long)i + RNCTestAsyncStorageExtraValue];
}

NSString *RNCTestRemoveExtraValue(NSString *value)
{
  NSInteger i = [value integerValue];
  if (i > RNCTestAsyncStorageExtraValue) {
    i -= RNCTestAsyncStorageExtraValue;
  }
  return [NSString stringWithFormat:@"%ld", (long)i];
}

@implementation RNCTestAsyncStorageDelegate {
  NSMutableDictionary<NSString *, NSString *> *_memoryStorage;
}

- (instancetype)init
{
  if (self = [super init]) {
    _memoryStorage = [NSMutableDictionary dictionary];
  }
  return self;
}

- (void)allKeys:(RNCAsyncStorageResultCallback)completion
{
  completion(_memoryStorage.allKeys);
}

- (void)mergeValues:(nonnull NSArray<NSString *> *)values
            forKeys:(nonnull NSArray<NSString *> *)keys
         completion:(nonnull RNCAsyncStorageResultCallback)completion
{
  NSError *error = nil;
  NSDictionary *dictionary =
      [NSJSONSerialization JSONObjectWithData:[values[0] dataUsingEncoding:NSUTF8StringEncoding]
                                      options:NSJSONReadingMutableContainers
                                        error:&error];
  NSMutableDictionary *modified = [NSMutableDictionary dictionaryWithCapacity:dictionary.count];
  for (NSString *key in dictionary) {
    NSObject *value = dictionary[key];
    if ([value isKindOfClass:[NSString class]]) {
      modified[key] = [(NSString *)value stringByAppendingString:@" from delegate"];
    } else {
      modified[key] = value;
    }
  }

  NSData *data = [NSJSONSerialization dataWithJSONObject:modified options:0 error:&error];
  NSString *str = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  _memoryStorage[keys[0]] = str;
  completion(@[str]);
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
    [_memoryStorage
        setObject:[NSString stringWithFormat:@"%ld", (long)RNCTestAsyncStorageExtraValue]
           forKey:key];
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
    [_memoryStorage setObject:RNCTestRemoveExtraValue(value) forKey:key];
  }
  completion(@[]);
}

- (void)valuesForKeys:(nonnull NSArray<NSString *> *)keys
           completion:(nonnull RNCAsyncStorageResultCallback)completion
{
  NSMutableArray *values = [NSMutableArray arrayWithCapacity:keys.count];
  for (NSString *key in keys) {
    NSString *value = _memoryStorage[key];
    [values addObject:value == nil ? [NSNull null] : RNCTestAddExtraValue(value)];
  }
  completion(values);
}

@end

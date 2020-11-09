#import "AsyncStorageDevSupport.h"

#import <RNCAsyncStorage/RNCAsyncStorage.h>

#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTDevMenu.h>

RNCAsyncStorage *RNCAsyncStorageGetInstance(RCTBridge *bridge)
{
    return [bridge moduleForClass:[RNCAsyncStorage class]];
}

@interface AsyncStorageTestSupport : NSObject <RCTBridgeModule>
@end

@implementation AsyncStorageDevSupport {
    NSMutableDictionary *_memoryStorage;
}

static AsyncStorageDevSupport *_sharedInstance;

+ (void)load
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(didLoadJavaScript:)
                                                 name:RCTJavaScriptDidLoadNotification
                                               object:nil];
}

+ (void)didLoadJavaScript:(NSNotification *)note
{
    RCTBridge *bridge = note.userInfo[@"bridge"];
    if (bridge == nil) {
        return;
    }

    _sharedInstance = [AsyncStorageDevSupport new];

    __weak typeof(_sharedInstance) weakInstance = _sharedInstance;
    RCTDevMenuItem *delegateToggle = [RCTDevMenuItem
        buttonItemWithTitleBlock:^NSString * {
          RNCAsyncStorage *asyncStorage = RNCAsyncStorageGetInstance(bridge);
          return asyncStorage.delegate == nil ? @"Set AsyncStorage Delegate"
                                              : @"Unset AsyncStorage Delegate";
        }
        handler:^{
          RNCAsyncStorage *asyncStorage = RNCAsyncStorageGetInstance(bridge);
          asyncStorage.delegate = asyncStorage.delegate == nil ? weakInstance : nil;
        }];
    [bridge.devMenu addItem:delegateToggle];
}

- (instancetype)init
{
    if (self = [super init]) {
        _memoryStorage = [NSMutableDictionary dictionary];
    }
    return self;
}

#pragma mark - RNCAsyncStorageDelegate implementation details

- (void)allKeys:(RNCAsyncStorageResultCallback)completion
{
    completion(_memoryStorage.allKeys);
}

- (void)mergeValues:(NSArray<NSString *> *)values
            forKeys:(NSArray<NSString *> *)keys
         completion:(RNCAsyncStorageResultCallback)completion
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

- (void)removeAllValues:(RNCAsyncStorageCompletion)completion
{
    [_memoryStorage removeAllObjects];
    completion(nil);
}

- (void)removeValuesForKeys:(NSArray<NSString *> *)keys
                 completion:(RNCAsyncStorageResultCallback)completion
{
    for (NSString *key in keys) {
        [_memoryStorage removeObjectForKey:key];
    }
    completion(@[]);
}

- (void)setValues:(NSArray<NSString *> *)values
          forKeys:(NSArray<NSString *> *)keys
       completion:(RNCAsyncStorageResultCallback)completion
{
    for (NSUInteger i = 0; i < values.count; ++i) {
        NSString *value = values[i];
        NSString *key = keys[i];
        [_memoryStorage setObject:value forKey:key];
    }
    completion(@[]);
}

- (void)valuesForKeys:(NSArray<NSString *> *)keys
           completion:(RNCAsyncStorageResultCallback)completion
{
    NSMutableArray *values = [NSMutableArray arrayWithCapacity:keys.count];
    for (NSString *key in keys) {
        NSString *value = _memoryStorage[key];
        [values addObject:value == nil ? [NSNull null] : value];
    }
    completion(values);
}

@end

#pragma mark - E2E testing details

@implementation AsyncStorageTestSupport

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

// clang-format off
RCT_EXPORT_METHOD(test_setDelegate:(RCTResponseSenderBlock)callback)
// clang-format on
{
    RNCAsyncStorage *asyncStorage = RNCAsyncStorageGetInstance(_bridge);
    asyncStorage.delegate = _sharedInstance;
    callback(@[]);
}

// clang-format off
RCT_EXPORT_METHOD(test_unsetDelegate:(RCTResponseSenderBlock)callback)
// clang-format on
{
    RNCAsyncStorage *asyncStorage = RNCAsyncStorageGetInstance(_bridge);
    asyncStorage.delegate = nil;
    callback(@[]);
}

@end

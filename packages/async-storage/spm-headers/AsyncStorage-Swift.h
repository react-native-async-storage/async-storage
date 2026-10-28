// Private SwiftPM compatibility declarations for apple/AsyncStorage.mm.
// Xcode exposes the generated Swift header through a module map, but does not
// add its directory to this Objective-C++ target's header search paths, and
// disables C++ module imports. Keep these declarations in sync with the public
// @objc API in apple/storage and the compiler-generated AsyncStorage-Swift.h.
// The runtime names are essential: the implementations are the Swift classes,
// whose module remains AsyncStorage. This file contains no implementations.
#pragma once

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

__attribute__((objc_runtime_name("_TtC12AsyncStorage9RNStorage")))
__attribute__((objc_subclassing_restricted))
@interface RNStorage : NSObject
- (void)getWithKeys:(NSArray<NSString *> * _Nonnull)keys resolver:(RCTPromiseResolveBlock _Nonnull)resolver rejecter:(RCTPromiseRejectBlock _Nonnull)rejecter;
- (void)setWithValues:(NSArray<NSDictionary<NSString *, NSString *> *> * _Nonnull)values resolver:(RCTPromiseResolveBlock _Nonnull)resolver rejecter:(RCTPromiseRejectBlock _Nonnull)rejecter;
- (void)removeWithKeys:(NSArray<NSString *> * _Nonnull)keys resolver:(RCTPromiseResolveBlock _Nonnull)resolver rejecter:(RCTPromiseRejectBlock _Nonnull)rejecter;
- (void)allKeysWithResolver:(RCTPromiseResolveBlock _Nonnull)resolver rejecter:(RCTPromiseRejectBlock _Nonnull)rejecter;
- (void)clearWithResolver:(RCTPromiseResolveBlock _Nonnull)resolver rejecter:(RCTPromiseRejectBlock _Nonnull)rejecter;
@end

__attribute__((objc_runtime_name("_TtC12AsyncStorage15StorageRegistry")))
__attribute__((objc_subclassing_restricted))
@interface StorageRegistry : NSObject
@property (nonatomic, class, readonly, strong) StorageRegistry * _Nonnull shared;
+ (StorageRegistry * _Nonnull)shared __attribute__((warn_unused_result));
- (RNStorage * _Nonnull)getRNStorageWithDbName:(NSString * _Nonnull)dbName __attribute__((warn_unused_result));
@end

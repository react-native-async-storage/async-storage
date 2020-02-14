/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <XCTest/XCTest.h>

@interface AsyncStorageExample_macOSUITests : XCTestCase

@end

@implementation AsyncStorageExample_macOSUITests
{
  XCUIApplication *_app;
  XCUIElement *_window;
  XCUIElement *_restartButton;
  XCUIElement *_getSetClearButton;
  XCUIElement *_mergeItemButton;
}

- (void)setUp {
  // In UI tests it is usually best to stop immediately when a failure occurs.
  self.continueAfterFailure = NO;

  _app = [[XCUIApplication alloc] init];
  [_app launch];
  
  _window = _app.windows[@"RNCAsyncStorageExample macOS"];
  XCTAssert(_window.exists);

  _restartButton = _window.otherElements[@"restart_button"].staticTexts.firstMatch;
  XCTAssert(_restartButton.exists);

  _getSetClearButton = _window.buttons[@"testType_getSetClear"].staticTexts.firstMatch;
  XCTAssert(_getSetClearButton.exists);

  _mergeItemButton = _window.buttons[@"testType_mergeItem"].staticTexts.firstMatch;
  XCTAssert(_mergeItemButton.exists);
  
  [_getSetClearButton click];
}

- (void)testExample {
  NSNumberFormatter *numberFormatter = [[NSNumberFormatter alloc] init];
  numberFormatter.numberStyle = NSNumberFormatterDecimalStyle;
  
  XCUIElement *storedNumber = _window.staticTexts[@"storedNumber_text"];
  XCTAssert(storedNumber.exists);
  
  NSNumber *beforeStoredNumber = [numberFormatter numberFromString:storedNumber.label];

  XCUIElement *increaseBy10Button = _window.buttons[@"increaseByTen_button"].staticTexts.firstMatch;
  XCTAssert(increaseBy10Button.exists);

  [increaseBy10Button click];

  NSNumber *afterStoredNumber = [numberFormatter numberFromString:storedNumber.label];

  int difference = afterStoredNumber.intValue - beforeStoredNumber.intValue;
  XCTAssertEqual(difference, 10);
}

@end

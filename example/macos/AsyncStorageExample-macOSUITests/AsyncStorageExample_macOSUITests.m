/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <RNCAsyncStorage/RNCAsyncStorage.h>
#import <XCTest/XCTest.h>

@interface AsyncStorageExample_macOSUITests : XCTestCase

@end

@implementation AsyncStorageExample_macOSUITests {
    XCUIApplication *_app;
    XCUIElement *_window;
    XCUIElement *_restartButton;
    XCUIElement *_getSetClearButton;
    XCUIElement *_mergeItemButton;
}

- (void)setUp
{
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

    [self sendTestAppCommand:@"rnc-asyncstorage://clear-all-storage"];
}

- (void)testShouldStoreValueInAsyncStorage
{
    [self sendTestAppCommand:@"rnc-asyncstorage://unset-delegate"];

    [_getSetClearButton click];

    XCUIElement *storedNumber = _window.staticTexts[@"storedNumber_text"];

    XCTAssertEqualObjects(storedNumber.label, @"");

    XCUIElement *increaseBy10Button =
        _window.buttons[@"increaseByTen_button"].staticTexts.firstMatch;

    int tapTimes = arc4random_uniform(10) + 1;

    for (int i = 0; i < tapTimes; i++) {
        [increaseBy10Button click];
    }

    NSString *expectedText = [NSString stringWithFormat:@"%d", tapTimes * 10];

    XCTAssertEqualObjects(storedNumber.label, expectedText);
}

- (void)testShouldClearItem
{
    [self sendTestAppCommand:@"rnc-asyncstorage://unset-delegate"];

    [_getSetClearButton click];

    XCUIElement *increaseBy10Button =
        _window.buttons[@"increaseByTen_button"].staticTexts.firstMatch;
    [increaseBy10Button click];

    XCUIElement *clearButton = _window.buttons[@"clear_button"].staticTexts.firstMatch;
    [clearButton click];
    [_restartButton click];

    XCUIElement *storedNumber = _window.staticTexts[@"storedNumber_text"];
    XCTAssertEqualObjects(storedNumber.label, @"");
}

- (NSString *)performInputWithFormat:format
{
    NSString *name = arc4random_uniform(2) == 0 ? @"Jerry" : @"Sarah";
    NSString *age = arc4random_uniform(2) == 0 ? @"21" : @"23";
    NSString *eyeColor = arc4random_uniform(2) == 0 ? @"blue" : @"green";
    NSString *shoeSize = arc4random_uniform(2) == 0 ? @"9" : @"10";

    XCUIElement *nameInput = _window.textFields[@"testInput-name"];
    [nameInput click];
    [nameInput typeText:name];

    XCUIElement *ageInput = _window.textFields[@"testInput-age"];
    [ageInput click];
    [ageInput typeText:age];

    XCUIElement *eyesInput = _window.textFields[@"testInput-eyes"];
    [eyesInput click];
    [eyesInput typeText:eyeColor];

    XCUIElement *showInput = _window.textFields[@"testInput-shoe"];
    [showInput click];
    [showInput typeText:shoeSize];

    return [NSString stringWithFormat:format, name, age, eyeColor, shoeSize];
}

- (void)testShouldMergeItemsInAsyncStorage
{
    [self sendTestAppCommand:@"rnc-asyncstorage://unset-delegate"];

    [_mergeItemButton click];

    XCUIElement *saveItemButton = _window.buttons[@"saveItem_button"].staticTexts.firstMatch;
    XCUIElement *restoreItemButton = _window.buttons[@"restoreItem_button"].staticTexts.firstMatch;
    XCUIElement *mergeItemButton = _window.buttons[@"mergeItem_button"].staticTexts.firstMatch;
    XCUIElement *storyText = _window.staticTexts[@"storyTextView"];

    NSString *messageFormat = @"%@ is %@, has %@ eyes and shoe size of %@.";

    NSString *story = [self performInputWithFormat:messageFormat];
    [saveItemButton click];
    [_restartButton click];
    [restoreItemButton click];
    XCTAssertEqualObjects(storyText.label, story);
    [_restartButton click];

    // merging here

    NSString *newStory = [self performInputWithFormat:messageFormat];
    [mergeItemButton click];
    [_restartButton click];
    [restoreItemButton click];
    XCTAssertEqualObjects(storyText.label, newStory);
}

- (void)testMergeItemDelegate
{
    [self sendTestAppCommand:@"rnc-asyncstorage://set-delegate"];

    [_mergeItemButton click];

    XCUIElement *saveItemButton = _window.buttons[@"saveItem_button"].staticTexts.firstMatch;
    XCUIElement *restoreItemButton = _window.buttons[@"restoreItem_button"].staticTexts.firstMatch;
    XCUIElement *mergeItemButton = _window.buttons[@"mergeItem_button"].staticTexts.firstMatch;
    XCUIElement *storyText = _window.staticTexts[@"storyTextView"];

    NSString *story =
        [self performInputWithFormat:
                  @"%@ from delegate is %@ from delegate, has %@ eyes and shoe size of %@."];
    [mergeItemButton click];
    [_restartButton click];
    [restoreItemButton click];
    XCTAssertEqualObjects(storyText.label, story);
}

- (void)sendTestAppCommand:(NSString *)URLString
{
    [[NSWorkspace sharedWorkspace] openURL:[NSURL URLWithString:URLString]];
    sleep(.25);
}

@end

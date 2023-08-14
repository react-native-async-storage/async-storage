---
id: jest
title: Jest integration
sidebar_label: Jest integration
---

Async Storage module is tightly coupled with its `NativeModule` part - it needs
a running React Native application to work properly. In order to use it in
tests, you have to provide its separate implementation. Follow these steps to
add a mocked `Async Storage` module.

## Using Async Storage mock

You can use one of two ways to provide mocked version of `AsyncStorage`:

### With **mocks** directory

1. In your project root directory, create
   `__mocks__/@react-native-async-storage` directory.
2. Inside that folder, create `async-storage.js` file.
3. Inside that file, export `Async Storage` mock.

```javascript
export * from '@react-native-async-storage/async-storage/jest/async-storage-mock';
```

### With Jest setup file

1. In your Jest config (probably in `package.json`) add setup files location:

```json
"jest": {
  "setupFiles": ["./path/to/jestSetupFile.js"]
}
```

2. Inside your setup file, set up Async Storage mocking:

```javascript
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

## Testing with mock

Each public method available from `Async Storage` is
[a mock function](https://jestjs.io/docs/en/mock-functions), that you can test
for certain condition, for example, if `.getItem` has been called with a
specific arguments:

```javascript
it('checks if Async Storage is used', async () => {
  await asyncOperationOnAsyncStorage();

  expect(AsyncStorage.getItem).toBeCalledWith('myKey');
});
```

## Overriding Mock logic

You can override mock implementation, by replacing its inner functions:

```javascript
// somewhere in your configuration files
import AsyncStorageMock from '@react-native-async-storage/async-storage/jest/async-storage-mock';

AsyncStorageMock.multiGet = jest.fn(([keys], callback) => {
  // do something here to retrieve data
  callback([]);
});

export default AsyncStorageMock;
```

You can
[check its implementation](https://github.com/react-native-async-storage/async-storage/blob/main/jest/async-storage-mock.js)
to get more insight into methods signatures.

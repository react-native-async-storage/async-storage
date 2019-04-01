# Jest integration

Async Storage module is tighly coupled with a `Native Module`, meaning it needs a running React Native application to work properly. In order to use it in tests, you have to provide its separate implementation. Follow those steps to add mocked `Async Storage` to your test cases.

## Using Async Storage mock

Select a method that suits your needs:

### Mock `node_modules`

1. In your project root directory, create `__mocks__/@react-native-community` directory.
2. Inside that folder, create `async-storage.js` file.
3. Inside that file, export `Async Storage` mock.

```javascript
export default from '@react-native-community/async-storage/jest/async-storage-mock'
```

### Use Jest setup files

1. In your Jest config (probably in `package.json`) add setup files location:

```json
  "jest": {
    "setupFiles": ["./path/to/jestSetupFile.js"]
  }
```

2. Inside your setup file, set up Async Storage mocking:

```javascript
  import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

  jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
```
## Testing with mock

Each public method available from `Async Storage` is [a mock function](https://jestjs.io/docs/en/mock-functions), that you can test for certain condition, for example, check if it has been called with a specific arguments:

```javascript
  it('checks if Async Storage is used', async () => {
    await asyncOperationOnAsyncStorage();

    expect(AsyncStorage.getItem).toBeCalledWith('myKey');
  })
```

## Overriding Mock logic

You can override Async Storage mock implementation, by replacing its inner functions:

```javascript
// somewhere in your configuration files
import AsyncStorageMock from '@react-native-community/async-storage/jest/async-storage-mock';

AsyncStorageMock.multiGet = jest.fn(([keys], callback) => {
  // do something here to retrieve files
  callback([]);
})

export default AsyncStorageMock;
```

You can [check mock implementation](../jest/async-storage-mock.js) to get more insight into its signatures.

## Troubleshooting

### **`SyntaxError: Unexpected token export` in async-storage/lib/index.js**

This is likely because `Jest` is not transforming Async Storage. You can point it to do so, by adding `transformIgnorePatterns` setting in Jest's configuration.


```json
"jest": {
    "transformIgnorePatterns": ["/node_modules/@react-native-community/async-storage/(?!(lib))"]
  }
```

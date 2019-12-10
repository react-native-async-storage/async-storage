# Async Storage

A collection of persistent data storages, unified into a single API.

## Work in progress

Async Storage v2 is under development.

If you're looking for published and operational Async Storage version, please check out [`LEGACY`](https://github.com/react-native-community/async-storage/tree/LEGACY) branch. 

## Features

- Unified API to consume any supported storage
- Different type of storage for different purpose, see [available storages](#available-storages) 
- Extensible functionality, to leverage full storage potential
- Support for Mobile, Web and more

## Getting started

### Install

1. Get required core

```bash
yarn add @react-native-community/async-storage@next
```

2. Pick desired [storage for your platform.](#available-storages) 


### Usage

Example usage [be found here.](./packages/core/docs/Usage.md)


## Available storages

- [Legacy](./packages/storage-legacy/README.md) - for React Native 
- [Web](./packages/storage-web/README.md) - for Web applications


## Documentation

- [API documentation](./packages/core/docs/API.md)
- [Creating custom Storage backend](./packages/core/docs/Writing_Storage_Backend.md)


## License

MIT.




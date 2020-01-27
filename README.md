# Async Storage

A collection of persistent data storages, targeting different platforms, unified within a single API.

## Work in progress

Async Storage v2 is under development.

If you're looking for published and operational Async Storage version, please check out [`LEGACY`](https://github.com/react-native-community/async-storage/tree/LEGACY) branch.

## Features

- One, unified API to support different storages
- [Extensible functionality](./packages/core/docs/API.md#extensions)
- Targets Mobile, Web and more


## Getting started

### Install

1. Install Core dependency

```bash
yarn add @react-native-community/async-storage@next
```

2. Select a [storage for your platform.](#available-storages)


### Usage

See usage can [be found here.](./packages/core/docs/Usage.md)


## Available storages

- [Legacy](./packages/storage-legacy/README.md) - for React Native apps
- [Web](./packages/storage-web/README.md) - for Web apps


## Documentation

- [API documentation](./packages/core/docs/API.md)
- [Creating custom Storage backend](./packages/core/docs/Writing_Storage_Backend.md)


## License

MIT.




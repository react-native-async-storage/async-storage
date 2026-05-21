# Development Guide

## shared-storage

The **shared-storage** module is a **Kotlin Multiplatform (KMP)** library that encapsulates the storage logic.
It is used as the core backend for android and apple platforms.

### Android

Android's `shared-storage` is distributed via maven local repo, which is then consumed by React Native module.
To build the sdk, run:

```shell
yarn build:android
```

This runs `publishToMavenLocal` and makes the artifact available at `~/.m2`. The example app resolves it from there via
`mavenLocal()`.

### Apple (iOS/macOS)

`shared-storage` for apple platforms is distributed as `xcframework` containing both Debug and Release binaries.

To build it:

```shell
yarn build:apple
```

The artifact is then moved to `packages/async-storage/apple/Frameworks` for distribution.

## Documentation

Documentation should follow major.minor version of Async Storage. Update the documentation version in root's
package.json:

```json
{
  "versionDocs": "3.0"
}
```

### Deployment

Add new remote where docs are hosted:

```shell
# use https if not using ssh
git remote add docs git@github.com:react-native-async-storage/react-native-async-storage.github.io.git
```

Fetch gh-pages branch:

```shell
git fetch docs gh-pages
```

Use python 3 to install dependencies:

```shell
pip install --no-deps -r .github/requirements.txt
```

Run `mike deploy` to deploy docs and mark them as latest:

```shell
mike deploy -u -r docs --push DOCS_VERSION_FROM_PCK_JSON latest
mike set-default latest -r docs --push
```

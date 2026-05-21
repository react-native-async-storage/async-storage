# Release instructions

## Code check

Run tests with

```shell
yarn test:lint
```

```shell
yarn test:ts
```

```shell
yarn test:format
```

## Release new Shared Storage for Android Maven Central

1. Update `VERSION_NAME` in [gradle.properties](shared-storage/gradle.properties)
2. Commit changes ("release shared-storage-android vX.X.X")
3. Create PR, NO CHANGESET LOG, Merge.
4. Release artifact via `./gradlew :shared-storage:publishToMavenCentral --no-configuration-cache`
5. Publish deployment on [Sonatype Central](https://central.sonatype.com/publishing/deployments)

## Release new Async Storage version

1. Update version of Shared Storage for Android binary
   in [gradle.properties](packages/async-storage/android/gradle.properties)
2. Create a PR with changeset log.
3. Merge Release PR and CI will publish new version.
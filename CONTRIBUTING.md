# Contributing to React Native Async Storage

Thank you for helping out with Async Storage!
We'd like to make contributions as pleasent as possible, so here's a small guide of how we see it. Happy to hear your feedback about anything, so please let us know.


## Tests
We use `flow` for type check, `eslint` with `prettier` for linting/formatting, `jest/detox` for tests (unit and e2e). All tests are run on CircleCI for all opened pull requests, but you should use them locally when making changes.

* `yarn test`: Run all tests, except for e2e (see note below).
* `yarn test:lint`: Run `eslint` check.
* `yarn test:flow`: Run `flow` type check.
* `yarn test:e2e:<ios|android|macos>`: Runs e2e tests. Before you can run it, you should build the app that can be run, by using `yarn build:e2e:<ios|android|macos>`.


## Sending a pull request
When you're sending a pull request:

* Communication is a key. If you want fix/add something, please open new/find existing issue, so we can discuss it.
* We prefer small pull requests focused on one change, as those are easier to test/check.
* Please make sure that all tests are passing on your local machine.
* Please make sure you've run formatters and linters locally.
  * In VS Code, you can press ⇧+Alt+F or ⇧⌥F to format the current file.
    * To format C++ and Objective-C files, make sure you have the [C/C++ extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) installed.
    * To format JavaScript files, please install [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).
  * From the command line, you can run `yarn format:c` and `yarn format:js` to format C-based languages and JavaScript respectively. The first command requires that you've already installed [ClangFormat](https://clang.llvm.org/docs/ClangFormat.html).
* Follow the template when opening a PR.


## Commits and versioning
All PRs are squashed into `master` branch and wrapped up in a single commit, following [conventional commit message](https://www.conventionalcommits.org/en/v1.0.0-beta.3). Combined with [semantic versioning](https://semver.org/), this allows us to have a frequent releases of the library.

*Note*: We don't force this convention on Pull Requests from contributors, but it's a clean way to see what type of changes are made, so feel free to follow it.


Most notably prefixes you'll see:

* **fix**: Bug fixes, triggers *patch* release
* **feat**: New feature implemented, triggers *minor*
* **chore**: Changes that are not affecting end user (CI config changes, scripts, ["grunt work"](https://stackoverflow.com/a/26944812/3510245))
* **docs**: Documentation changes.
* **perf**: A code change that improves performance.
* **refactor**: A code change that neither fixes a bug nor adds a feature.
* **test**: Adding missing tests or correcting existing tests.


## Release process
We use [Semantic Release](http://semantic-release.org) to automatically release new versions of the library when changes are merged into `master` branch, which we plan to keep stable. Bug fixes take priority in the release order.

## Reporting issues
You can report issues on our [bug tracker](https://github.com/react-native-community/react-native-async-storage/issues). Please search for existing issues and follow the issue template when opening an one.


## License
By contributing to React Native Async Storage, you agree that your contributions will be licensed under the **MIT** license.

#!/bin/sh

if [ -z ${CI+x} ]
then
  # not on CI
  exit 0
fi

if [ -z ${GITHUB_NAME+x} ] || [ -z ${GITHUB_EMAIL+x} ] || [ -z ${GITHUB_TOKEN+x} ]
then
  echo "Make sure GITHUB_NAME, GITHUB_EMAIL and GITHUB_TOKEN variables are set"
  exit 1
fi

git config user.name "$GITHUB_NAME"
git config user.email "$GITHUB_EMAIL"
echo "machine github.com login $GITHUB_NAME password $GITHUB_TOKEN" > "$HOME/.netrc"

if [ "$GIT_SET_GLOBAL_USER" = "true" ]
then
  git config --global user.name "$GITHUB_NAME"
  git config --global user.email "$GITHUB_EMAIL"
fi

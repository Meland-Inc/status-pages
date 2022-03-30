#!/bin/bash
set -o errexit
# 运行cmcli

### get project dir
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
readonly PROJECT_ROOT="$(dirname $DIR)"
readonly BRANCH_TO_BUILD="main"
RUN_ROOT="$PROJECT_ROOT"
cd $PROJECT_ROOT;

if [[ "$VERCEL_GIT_COMMIT_REF" == "$BRANCH_TO_BUILD" ]] ; then
    yarn next build
else
  # Don't build
  echo "🛑 - Build canceled"
  exit 0;
fi
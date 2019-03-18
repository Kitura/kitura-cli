#!/bin/bash

if [ -z "$TMPDIR" ];then
    TMPDIR=/tmp
fi

TESTDIR="$TMPDIR/kitura-cli-test"
DIRNAME="test"

echo "Cleaning any prior test directory $TESTDIR"
rm -rf "$TESTDIR"

echo "Creating test directory $TESTDIR"
mkdir -p "$TESTDIR"
PATH=$TESTDIR/bin:$PATH

echo "Installing kitura-cli"
echo "- Creating package"
PKG=$(npm pack) || exit 1

echo "- Installing package ($PKG) to test directory as global module"
if ! npm install -g --prefix="$TESTDIR" "$PKG"
then
    echo "Failed to install"
    rm "$PKG"
    rm -rf "$TESTDIR"
    exit 1
fi
echo "Installation complete"
rm "$PKG"

install_swift() {
  swiftFile = ".swift-version"
  if [ -f "$file" ]
  then
    echo "swiftenv is already installed"
  else
    git clone --depth 1 https://github.com/kylef/swiftenv.git ~/.swiftenv
    export SWIFTENV_ROOT="$HOME/.swiftenv"
    export PATH="$SWIFTENV_ROOT/bin:$SWIFTENV_ROOT/shims:$PATH"
  fi

  if [ -f "$file" ] || [ -n "$SWIFT_VERSION" ]; then
    swiftenv install -s
  else
    swiftenv rehash
  fi
}

cd "$TESTDIR" || exit 1

echo "Testing: kitura --version"
if ! kitura --version
then
    echo "Failed"
    rm -rf "$TESTDIR"
    exit 1
fi

create_project() {
  mkdir $DIRNAME
  cd $DIRNAME || exit 1
  if ! kitura $*
  then
    echo "Failed to create project"
    rm -rf "$TESTDIR"
    exit 1
  fi

  if [ -d swiftserver ]
  then
    cd swiftserver
  fi
}

swift_build() {
  if ! swift build
  then
    echo "swift build failed"
    rm -rf "$TESTDIR"
    exit 1
  fi
}

cleanup() {
  cd ..
  rm -rf $DIRNAME
}

test_kitura_build() {

  echo "Testing: $*"

  #Create project which also creates the '.swift-version' file
  create_project $*

  #Install Swift on Linux using the '.swift-version' file so we get the correct version of Swift
  if [[ ${OSTYPE} == *"linux"* ]]; then
    install_swift
  fi

  swift_build

  cleanup
}

test_kitura_build init --skip-build
test_kitura_build create --app --spec '{"appType":"scaffold","appName":"test"}' --skip-build .
test_kitura_build create --app --spec '{"appType":"scaffold","appName":"test"}' --skip-build .

echo "Testing: kitura kit"
if ! kitura kit
then
    echo "Failed"
    rm -rf "$TESTDIR"
    exit 1
fi

echo "Cleaning up test directory"
rm -rf $TESTDIR

echo "Testing Succeeded"

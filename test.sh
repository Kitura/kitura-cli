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

cd "$TESTDIR" || exit 1

echo "Testing: kitura --version"
if ! kitura --version
then
    echo "Failed"
    rm -rf "$TESTDIR"
    exit 1
fi

install_swiftenv() {
  if ! swiftenv version
  then
    echo "Installing swiftenv"
    git clone https://github.com/kylef/swiftenv.git ~/.swiftenv
    echo 'export SWIFTENV_ROOT="$HOME/.swiftenv"' >> ~/.bash_profile
    echo 'export PATH="$SWIFTENV_ROOT/bin:$PATH"' >> ~/.bash_profile
    echo 'eval "$(swiftenv init -)"' >> ~/.bash_profile
  else
    echo "swiftenv already installed"
  fi
}

create_project() {
  mkdir $DIRNAME
  cd $DIRNAME || exit 1
  if ! kitura $*
  then
    echo "Failed to create project"
    rm -rf "$TESTDIR"
    exit 1
  fi
}

install_swift() {
  if ! swift --version
  then
    echo "Installing Swift"
    if ! swiftenv install
    then
      echo "Failed to install swift"
      rm -rf "$TESTDIR"
      exit 1
    fi
  else
    echo "Swift already installed"
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

  echo "Testing: + $*"

  install_swiftenv

  create_project $*

  install_swift

  swift_build

  cleanup
}

echo "Testing: kitura kit"
if ! kitura kit
then
    echo "Failed"
    rm -rf "$TESTDIR"
    exit 1
fi

test_kitura_build init --skip-build
test_kitura_build create --app --spec '{"appType":"scaffold","appName":"test"}'
test_kitura_build create --app --spec '{"appType":"scaffold","appName":"test"}'

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

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
  # Get the ID and VERSION_ID from /etc/os-release, stripping quotes
  distribution=`grep '^ID=' /etc/os-release | sed -e's#.*="\?\([^"]*\)"\?#\1#'`
  version=`grep '^VERSION_ID=' /etc/os-release | sed -e's#.*="\?\([^"]*\)"\?#\1#'`
  version_no_dots=`echo $version | awk -F. '{print $1$2}'`
  export UBUNTU_VERSION="${distribution}${version}"
  export UBUNTU_VERSION_NO_DOTS="${distribution}${version_no_dots}"

  SWIFT_SNAPSHOT=`cat .swift-version`

  echo "Installing '${SWIFT_SNAPSHOT}'..."

  wget --progress=dot:giga https://swift.org/builds/$SNAPSHOT_TYPE/$UBUNTU_VERSION_NO_DOTS/$SWIFT_SNAPSHOT/$SWIFT_SNAPSHOT-$UBUNTU_VERSION.tar.gz
  tar xzf $SWIFT_SNAPSHOT-$UBUNTU_VERSION.tar.gz
  export PATH=$projectFolder/$SWIFT_SNAPSHOT-$UBUNTU_VERSION/usr/bin:$PATH
  rm $SWIFT_SNAPSHOT-$UBUNTU_VERSION.tar.gz
}

if [[ ${OSTYPE} == *"linux"* ]]; then
  install_swift
fi
echo "----------------------------------"
echo ${OSTYPE}
echo "----------------------------------"

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

  create_project $*

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

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

if ! kitura --version
then
    echo "Failed"
    rm -rf "$TESTDIR"
    exit 1
fi

mkdir $DIRNAME
cd $DIRNAME || exit 1
if ! kitura init --skip-build
then
    echo "Failed"
    cd ..
    rm -rf "$TESTDIR"
    exit 1
fi
cd ..
rm -rf $DIRNAME

echo "Cleaning up test directory"
rm -rf $TESTDIR

echo "Testing Succeeded"

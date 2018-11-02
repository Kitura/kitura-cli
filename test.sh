#!/bin/bash

/*
 * Copyright IBM Corporation 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

echo "Testing: kitura init --skip-build"
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

echo "Testing: kitura basic --skip-build"
mkdir $DIRNAME
cd $DIRNAME || exit 1
if ! kitura basic --skip-build
then
    echo "Failed"
    cd ..
    rm -rf "$TESTDIR"
    exit 1
fi
cd ..
rm -rf $DIRNAME

echo "Testing: kitura api --skip-build"
mkdir $DIRNAME
cd $DIRNAME || exit 1
if ! kitura api --skip-build
then
    echo "Failed"
    cd ..
    rm -rf "$TESTDIR"
    exit 1
fi
cd ..
rm -rf $DIRNAME

echo "Testing: kitura create --app --skip-build --spec '{ \"appType\": \"scaffold\", \"appName\": \"test\"}'"
if ! kitura create --app --skip-build --spec '{ "appType": "crud", "appName": "test"}'
then
    echo "Failed"
    rm -rf "$TESTDIR"
    exit 1
fi
echo "Cleaning up generated project"
rm -rf swiftserver

echo "Testing: kitura create --app --skip-build --spec '{ \"appType\": \"scaffold\", \"appName\": \"test\"}'"
if ! kitura create --app --skip-build --spec '{ "appType": "scaffold", "appName": "test"}'
then
    echo "Failed"
    rm -rf "$TESTDIR"
    exit 1
fi
echo "Cleaning up generated project"
rm -rf swiftserver

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

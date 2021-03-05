#!/bin/bash
set -ex

if [ -z "$1" ]; then
    echo "Usage: build.sh <release>"
    echo " - where <release> is a SemVer version in the format x.y.z"
    exit 1
fi

export RELEASE=$1

function failCmdFound() {
    echo "Error - 'kitura' command already exists"
    echo "Existing  kitura --version: `kitura --version`"
    exit 1
}

function test_Darwin() {
    # Todo: Test brew installation
    # Check that command does not already exist
    kitura && failCmdFound || echo "Command 'kitura' not found - OK"
    # Check reported CLI version matches our release
    cliVersion=`./darwin-amd64/kitura --version`
    if [ "$cliVersion" == $RELEASE ]; then
        echo "kitura --version reports $cliVersion - OK"
    else
        echo "Error - kitura --version reports $cliVersion, expected $RELEASE"
	exit 1
    fi
    # Check that kitura init successfully produces a project
    ./darwin-amd64/kitura init --dir TestProj
    rm -rf TestProj
}

function test_Linux() {
    # Check that command does not already exist
    kitura && failCmdFound || echo "Command 'kitura' not found - OK"
    sudo dpkg -i kitura-cli_${RELEASE}_amd64.deb
    # Check reported CLI version matches our release
    cliVersion=`kitura --version`
    if [ "$cliVersion" == $RELEASE ]; then
        echo "kitura --version reports $cliVersion - OK"
    else
        echo "Error - kitura --version reports $cliVersion, expected $RELEASE"
	exit 1
    fi
    # Check that kitura init successfully produces a project
    kitura init --dir TestProj
    rm -rf TestProj
}


case `uname` in
  Darwin)
    make build-darwin package-darwin
    test_Darwin
    ;;
  Linux)
    URL=https://swift.org/builds/swift-5.3.3-release/ubuntu1804/swift-5.3.3-RELEASE/swift-5.3.3-RELEASE-ubuntu18.04.tar.gz
    wget "${URL}"
    export PATH="${PWD}/swift-5.3.3-RELEASE-ubuntu18.04/usr/bin/:${PATH}"

    make
    test_Linux
    ;;
  *)
    echo "Unsupported OS: `uname`"
    exit 1
esac

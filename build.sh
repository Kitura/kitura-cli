#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: build.sh <release>"
    echo " - where <release> is a SemVer version in the format x.y.z"
    exit 1
fi

export PROJ_SRC=$PWD

export RELEASE=$1

export GOPATH=$HOME/kitura-cli
KITURA_PROJ=$GOPATH/src/kitura

# Write version number into sources
sed -i -e"s#@@RELEASE@@#${RELEASE}#g" install.sh linux-amd64/DEBIAN/control

# Copy sources into right location for Go to find them
mkdir -p $KITURA_PROJ
cp -R -p * $KITURA_PROJ/

# Install dependencies
# cobra (https://github.com/spf13/cobra)
go get -v -u github.com/spf13/cobra/cobra
# go-git (https://github.com/src-d/go-git)
go get -v -u gopkg.in/src-d/go-git.v4/...

# Set umask to ensure deb contents have right permissions
umask 022
chmod -R 755 linux-amd64

# Build for Mac
cd $KITURA_PROJ
mkdir -p $PROJ_SRC/darwin-amd64
env GOOS=darwin GOARCH=amd64 go build -v -o $PROJ_SRC/darwin-amd64/kitura

# Build for Linux
mkdir -p $PROJ_SRC/linux-amd64/usr/local/bin
env GOOS=linux GOARCH=amd64 go build -v -o $PROJ_SRC/linux-amd64/usr/local/bin/kitura

# Package macOS binary into downloadable tar.gz
cd $PROJ_SRC && tar -czf kitura-cli-${RELEASE}_darwin.tar.gz darwin-amd64

# Package linux binary into .deb
cd $PROJ_SRC && cp -R -p linux-amd64 kitura-cli_${RELEASE} && dpkg-deb --build kitura-cli_${RELEASE} && mv kitura-cli_${RELEASE}.deb kitura-cli_${RELEASE}_amd64.deb && rm -r kitura-cli_${RELEASE}

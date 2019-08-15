#!/bin/bash

export PROJ_SRC=$PWD

export RELEASE=0.0.17

export GOPATH=$HOME/kitura-cli
KITURA_PROJ=$GOPATH/src/kitura

# Write version number into sources
sed -i -e"s#@@RELEASE@@#${RELEASE}#g" install.sh linux-amd64/DEBIAN/control

# Copy sources into right location for Go to find them
mkdir -p $KITURA_PROJ
cp -R -p * $KITURA_PROJ/

# Install dependencies
# cobra (https://github.com/spf13/cobra)
go get -u github.com/spf13/cobra/cobra
# go-git (https://github.com/src-d/go-git)
go get -u gopkg.in/src-d/go-git.v4/...

# Build for Mac
cd $KITURA_PROJ
mkdir -p $PROJ_SRC/darwin-amd64
env GOOS=darwin GOARCH=amd64 go build -o $PROJ_SRC/darwin-amd64/kitura

# Build for Linux
mkdir -p $PROJ_SRC/linux-amd64/usr/local/bin
env GOOS=linux GOARCH=amd64 go build -o $PROJ_SRC/linux-amd64/usr/local/bin/kitura

# Package macOS binary into downloadable tar.gz
cd $PROJ_SRC && tar -czf kitura-cli-${RELEASE}.tar.gz darwin-amd64

# Package linux binary into .deb
cd $PROJ_SRC && ln -s linux-amd64 kitura-cli_${RELEASE} && dpkg-deb --build kitura-cli_${RELEASE} && rm kitura-cli_${RELEASE}


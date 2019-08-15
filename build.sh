#!/bin/bash

export PROJ_SRC=$PWD

export GOPATH=$HOME/kitura-cli
KITURA_PROJ=$GOPATH/src/kitura

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
env GOOS=darwin GOARCH=amd64 go build -o $PROJ_SRC/darwin-amd64/kitura

# Build for Linux
env GOOS=linux GOARCH=amd64 go build -o $PROJ_SRC/linux-amd64/kitura

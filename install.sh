#!/bin/sh
RELEASE=@@RELEASE@@
PKG_NAME=kitura-cli-${RELEASE}_amd64.deb
PKG_URL=https://github.com/IBM-Swift/kitura-cli/releases/download/v${RELEASE}/${PKG_NAME}

wget -q $PKG_URL && dpkg -i $PKG_NAME && rm $PKG_NAME && echo kitura-cli v${RELEASE} successfully installed.

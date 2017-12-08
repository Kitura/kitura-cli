# Kitura command-line interface

This Node.js package provides a `kitura` command-line interface, to simplify the process of creating [Kitura](https://github.com/IBM-Swift/Kitura) applications.

## Installation via Homebrew

```
$ brew tap ibm-swift/kitura
$ brew install kitura
```

Installing via Homebrew will also install the latest version of Node.js on your system.

## Installation via NPM

```
$ npm install -g kitura-cli
```

> If you encounter permissions errors such as `ENOENT` you may need to make changes to your NPM configuration. See [here](https://docs.npmjs.com/getting-started/fixing-npm-permissions) for further details.

## Usage

```
$ kitura

  Usage: kitura [options] [command]

  Kitura command-line interface


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    build       build the project in a local container
    create      interactively create a Kitura project
    idt         install IBM Cloud Developer Tools
    init        scaffold a bare-bones Kitura project
    kit         print Cocoapods boilerplate for KituraKit
    run         run the project in a local container
    help [cmd]  display help for [cmd]
```

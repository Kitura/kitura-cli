# Kitura command-line interface

This Go package provides a `kitura` command-line interface, to simplify the process of creating [Kitura](https://github.com/IBM-Swift/Kitura) applications.

## Installation on macOS (via Homebrew)

```
$ brew tap ibm-swift/kitura
$ brew install kitura
```

## Installation on Ubuntu

As a one-liner:
```
$ curl https://github.com/IBM-Swift/kitura-cli/releases/download/v0.0.17/install.sh | sudo bash
```

Or if you prefer to install manually:
```
curl -O https://github.com/IBM-Swift/kitura-cli/releases/download/v0.0.17/kitura-cli-v0.0.17_amd64.deb
sudo dpkg -i kitura-cli-v0.0.17_amd64.deb
```

## Usage

```
Usage:
  kitura [command]

Available Commands:
  build       Build the project in a local container
  help        Help about any command
  idt         Install IBM Cloud Developer Tools
  init        Initialize a Kitura project
  run         Run the project in a local container.

Flags:
  -h, --help     help for kitura
  -v, --version   Prints the kitura-cli version number.
```

## Release process
Instructions on releasing a new version of the kitura-cli can be found [here](Release-Process.md).

# Kitura command-line interface

This Go package provides a `kitura` command-line interface, to simplify the process of creating [Kitura](https://github.com/IBM-Swift/Kitura) applications.

## Installation on macOS (via Homebrew)

Kitura's CLI may be installed using [Homebrew](https://brew.sh):
```
$ brew tap ibm-swift/kitura
$ brew install kitura
```

## Installation (simple)

You can install (either on Mac or Linux) with this one-liner:
```
$ curl -fsSL https://github.com/IBM-Swift/kitura-cli/releases/latest/download/install.sh | sudo bash
```
The `kitura` binary will be placed in your `/usr/local/bin` directory.

## Installation (manual)

If you'd prefer not to use a script, the binary can be installed manually by downloading the release binary from GitHub. In the following commands, substitute `<release>` for the version of the CLI you are installing.

On Mac:
```
$ curl -LO https://github.com/IBM-Swift/kitura-cli/releases/download/<release>/kitura-cli_<release>_darwin.tar.gz
$ tar -xzf kitura-cli_<release>_darwin.tar.gz
$ sudo mv darwin-amd64/kitura /usr/local/bin/
```

On Linux:
```
curl -LO https://github.com/IBM-Swift/kitura-cli/releases/download/<release>/kitura-cli_<release>_amd64.deb
sudo dpkg -i kitura-cli_<release>_amd64.deb
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

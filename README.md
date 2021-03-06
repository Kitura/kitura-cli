# Kitura command-line interface

This Swift package provides a `kitura` command-line interface, to simplify the process of creating [Kitura](https://github.com/Kitura/Kitura) applications.

(Note: this Swift version is still an early work-in-progress.  Please check again in a bit for more features)

## Installation on macOS (via Homebrew)

Kitura's CLI may be installed using [Homebrew](https://brew.sh):
```
$ brew tap kitura/kitura
$ brew install kitura
```

## Installation (simple)

You can install (either on Mac or Linux) with this one-liner:
```
$ curl -fsSL https://github.com/Kitura/kitura-cli/releases/latest/download/install.sh | sudo bash
```
The `kitura` binary will be placed in your `/usr/local/bin` directory.

## Installation (manual)

If you'd prefer not to use a script, the binary can be installed manually by downloading the release binary from GitHub. In the following commands, substitute `<release>` for the version of the CLI you are installing.

On Mac:
```
$ curl -LO https://github.com/Kitura/kitura-cli/releases/download/<release>/kitura-cli_<release>_darwin.tar.gz
$ tar -xzf kitura-cli_<release>_darwin.tar.gz
$ sudo mv darwin-amd64/kitura /usr/local/bin/
```

On Linux:
```
curl -LO https://github.com/Kitura/kitura-cli/releases/download/<release>/kitura-cli_<release>_amd64.deb
sudo dpkg -i kitura-cli_<release>_amd64.deb
```

## Usage

To start a new project:

```
kitura init MyProject
cd MyProject
swift build
swift run
```


Default help message:

```
OVERVIEW: A utility for initializing a Kitura project

USAGE: kitura <subcommand>

OPTIONS:
  -h, --help              Show help information.

SUBCOMMANDS:
  init                    Initialize a new kitura project

  See 'kitura help <subcommand>' for detailed help.
```

## Release process
Instructions on releasing a new version of the kitura-cli can be found [here](Release-Process.md).

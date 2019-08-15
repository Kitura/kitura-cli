## kitura-cli Release Process

The following instructions are for releasing a new version of kitura-cli:

- Tag the release using the format `v0.0.17`
- Run the `build.sh` script to build and package the binary
- Attach the `kitura-cli_0.0.17_amd64.deb`, `kitura-cli-0.0.17_darwin.tar.gz` and `install.sh` files to the release.

### Updating homebrew

- Clone https://github.com/IBM-Swift/homebrew-kitura and create a new branch.
- In `kitura.rb` change the strings specified by `url` and `version` to match the new version you've just attached.
- Run `shasum -a 256 <name of .tar.gz file>` on the .tar.gz file that you've just generated. Change then string specified by `sha256` to the the hash that came out of running this command.
- Push your changes, then raise and merge the PR.
- Update your version of the cli by running `brew upgrade kitura` and do a final check to make sure your updates are running as expected.

## kitura-cli Release Process

The following instructions are for releasing a new version of kitura-cli:

- Tag the release using the format `0.0.17`, which will trigger a build.
  - Travis will then execute `build.sh <TAG>`, building and packaging the binary.
  - Travis will attach the `kitura-cli_0.0.17_amd64.deb`, `kitura-cli_0.0.17_darwin.tar.gz`, `install.sh` and `kitura.rb` files to the release.

### Updating homebrew

- Clone https://github.com/IBM-Swift/homebrew-kitura and create a new branch.
- Replace the `kitura.rb` file with the one that is attached to the release.
- Push your changes, then raise and merge the PR.
- Update your version of the cli by running `brew upgrade kitura` and do a final check to make sure your updates are running as expected.

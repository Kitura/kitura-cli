## kitura-cli Release Process

The following instructions are for releasing a new version of kitura-cli on both npm and homebrew:


**Make sure you run `npm test` on your changes before creating a PR.**

Once your PR has been merged:

#### npm

- Run `npm version patch` (or replace 'patch' with 'major'/'minor' based on your changes).
- Check that the right version has been created by running `git tag` and making sure the new version is listed.
- Run `npm publish`. You'll need to log in using `npm adduser` and make sure you are a collaborator on https://www.npmjs.com/package/kitura-cli/).
- Check to make sure the [npm package](https://www.npmjs.com/package/kitura-cli/) has been updated.
- Run `git status` and `git diff <commit hash of previous commit>` to check that the version has been updated by npm in the project. You can find the previous commit hash by using `git log`.
- If everything looks ok, switch to a new branch by running `git checkout -b update-version` and run `git push` to push the update version changes. Raise and merge the PR.
- Run `git push --tags`.

### homebrew

- Clone https://github.com/IBM-Swift/homebrew-kitura and create a new branch.
- In `kitura.rb` change the strings specified by `url` and `version` to match the new version you've just uploaded to npm.
- Download the new .tgz file specified by `url` and run `shasum -a 256 <name of .tgz file>`. Change then string specified by `sha256` to the the hash that came out of running this command.
- Push your changes, then raise and merge the PR.
- Update your version of the cli by running `brew upgrade kitura` and do a final check to make sure your updates are running as expected.

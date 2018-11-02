/*
 * Copyright IBM Corporation 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const chalk = require('chalk');
const spawnSync = require('child_process').spawnSync;
const os = require('os');
const fs = require('fs');
const path = require('path');
var args;
var projName;
const gitURL = 'https://github.com/IBM-Swift/generator-swiftserver-projects';

module.exports = {
  checkArgs: function checkArgs() {
    args = process.argv.slice(2);
    exports.args = args;
    if (args.length > 0) {
        if (args.indexOf('--help') > -1) {
            printHelp();
            process.exit(0);
        }
    }
  },

  validateProjectName: function validateProjectName() {
    let currentDirPath = path.resolve("./");
    let currentDir = path.basename(currentDirPath);
    // Replace spaces with hyphens so Xcode project will build.
    projName = currentDir.replace(/ /g, "-");

    if (projName.charAt(0) === '.') {
        console.error(chalk.red('Application name cannot start with .: %s'));
        process.exit(1);
    }
  },

  validateDirectoryName: function validateDirectoryName() {
    var problemChars = /[%:;="<>”|\\\/]/;
    if (problemChars.test(projName)) {
      console.error(chalk.red('Error: ') + 'Project directory cannot contain the following characters:  %":;=<>”|\\');
      process.exit(1);
    }
  },

  checkCurrentDirIsEmpty: function checkCurrentDirIsEmpty() {
      try {
          var data = fs.readdirSync('.');
          if (data.length !== 0) {
              console.error(chalk.red('Error: ') + 'Current directory is not empty.');
              console.error(chalk.red('Please repeat the command in an empty directory.'));
              process.exit(1);
          }
      } catch (err) {
          console.error(chalk.red('Error: ') + 'could not create project.');
          console.error(err.message);
          process.exit(err.errno);
      }
  },

  cloneProject: function cloneProject(branch) {
      console.log('Creating project...');
      let clone = spawnSync('git', ['clone', '-b', branch, gitURL, '.']);

      if (clone.status !== 0) {
          console.error(chalk.red('Error: ') + 'failed to run git clone.');
          console.error('Please check your network connection and that you have git installed.');
          console.error('Head to https://git-scm.com/downloads for instructions on installing git.');
          process.exit(clone.status);
      } else {
          console.log(chalk.green('Project created successfully.'));
          if ((args.includes('--skip-build'))) {
              console.log('Next steps:');
              console.log('');
              console.log('Generate your Xcode project:');
              console.log(chalk.grey('   $ swift package generate-xcodeproj'));
              console.log('');
              console.log('Or, build your project from the terminal:');
              console.log(chalk.grey('   $ swift build'));
          }
      }

      // Remove git remote
      let git = spawnSync('rm', ['-rf', '.git']);
      if (git.status !== 0) {
          console.error(chalk.red('Error: ') + 'failed to remove .git directory.');
          process.exit(git.status);
      }
  },

  renameProject: function renameProject(branch) {
      let projNameLowercase = projName.toLowerCase();
      // Only contains alphanumeric characters.
      let projNameClean = projName.replace(/^[^a-zA-Z]*/, '')
          .replace(/[^a-zA-Z0-9]/g, '');
      // Does not contain uppercase letters.
      let projNameCleanLowercase = projNameClean.toLowerCase()
      let oldProjName = "Generator-Swiftserver-Projects";
      let oldProjNameLowercase = "generator-swiftserver-projects";
      let oldProjNameClean = "GeneratorSwiftserverProjects";
      let oldProjNameCleanLowercase = "generatorswiftserverprojects"

      // Rename directories (charts can't contain special characters or uppercase characters).
      try {
        if (branch !== 'basic') {
          fs.renameSync("./chart/" + oldProjNameCleanLowercase, "./chart/" + projNameCleanLowercase);
          fs.renameSync("./Sources/" + oldProjName, "./Sources/" + projName);
        } else {
          fs.renameSync("./Sources/" + oldProjNameLowercase, "./Sources/" + projName);
        }
      } catch (err) {
          console.error(chalk.red('Error: ') + 'could not rename directories.');
          console.error(err.message);
          process.exit(err.errno);
      }
      // Rename instances of project name (charts can't contain special characters)
      var renameClean = spawnSync('find', ['.', '-exec', 'sed', '-i', '', 's/' + oldProjNameClean + '/' + projNameClean + '/g', '{}', ';'])
      if (renameClean.status !== 0) {
          console.error(chalk.red('Error: ') + 'could not rename project.');
          console.error(renameClean.stderr.toString());
          process.exit(renameClean.status);
      }
      var renameLowercase = spawnSync('find', ['.', '-exec', 'sed', '-i', '', 's/' + oldProjNameLowercase + '/' + projNameLowercase + '/g', '{}', ';'])
      if (renameClean.status !== 0) {
          console.error(chalk.red('Error: ') + 'could not rename project.');
          console.error(renameClean.stderr.toString());
          process.exit(renameClean.status);
      }
      var renameLowercaseClean = spawnSync('find', ['.', '-exec', 'sed', '-i', '', 's/' + oldProjNameCleanLowercase + '/' + projNameCleanLowercase + '/g', '{}', ';'])
      if (renameClean.status !== 0) {
          console.error(chalk.red('Error: ') + 'could not rename project.');
          console.error(renameClean.stderr.toString());
          process.exit(renameClean.status);
      }
      // Rename instances of project name which can't contain Uppercase characters
      var rename = spawnSync('find', ['.', '-exec', 'sed', '-i', '', 's/' + oldProjName + '/' + projName + '/g', '{}', ';'])
      if (rename.status !== 0) {
          console.error(chalk.red('Error: ') + 'could not rename project.');
          console.error(rename.stderr.toString());
          process.exit(rename.status);
      }
  },

  buildProject: function buildProject() {
    if (!(args.includes('--skip-build'))) {
      console.log('Running `swift build` to build project...');

      var build = spawnSync('swift', ['build'], { stdio:[0,1,2] });
      if (build.status !== 0) {
          console.error(chalk.red('Failed to complete build.'));
          process.exit(build.status);
      } else {
          console.log('Running `swift package generate-xcodeproj` to generate Xcode Project...');

          var xcodeProj = spawnSync('swift', ['package', 'generate-xcodeproj'], { stdio:[0,1,2] });
          if (xcodeProj.status !== 0) {
              console.error(chalk.red('Failed to generate Xcode Project.'));
              process.exit(xcodeProj.status);
          } else {
              console.log(chalk.green('Project built successfully.'));
              console.log('Next steps:');
              console.log('');
              console.log('Open your Xcode project:');
              console.log(chalk.grey('   $ open ' + projName + '.xcodeproj'));
              console.log('');
              console.log('Or, run your app from the terminal:');
              console.log(chalk.grey('   $ swift run'));
          }
      }
    }
  }
}

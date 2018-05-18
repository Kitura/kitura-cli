#!/usr/bin/env node

const chalk = require('chalk');
const spawnSync = require('child_process').spawnSync;
const os = require('os');
const fs = require('fs');
const path = require('path');

const initURL = 'https://github.com/IBM-Swift/generator-swiftserver-projects'
const initBranch = 'init'

let args = process.argv.slice(2);

if (args.length > 0) {
    if (args.indexOf('--help') > -1) {
        printHelp();
        process.exit(0);
    }
}

let currentDirPath = path.resolve("./");
let currentDir = path.basename(currentDirPath);
// Replace spaces with hyphens so Xcode project will build.
let projName = currentDir.replace(/ /g, "-");

if (projName.charAt(0) === '.') {
    console.error(chalk.red('Application name cannot start with .: %s'));
    process.exit(1);
}

// Make sure directory doesn't contain problem characters.
validateDirectoryName();

// Make sure directory is empty.
checkCurrentDirIsEmpty();

// Clone repo contents into current directory.
cloneProject(initURL, initBranch);

// Rename project to match current directory
renameProject();

// If '--skip-build' not specified, then build project.
if (!(args.includes('--skip-build'))) {
    buildProject();
}

function validateDirectoryName(){
  var problemChars = /[%:;="<>”|\\\/]/;
  if (problemChars.test(projName)) {
    console.error(chalk.red('Error: ') + 'Project directory cannot contain the folowwing characters:  %":;=<>”|\\');
    process.exit(1);
  }
  else {
    console.log("false")
  }
}

function checkCurrentDirIsEmpty() {
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
}

function cloneProject(url, branch) {
    console.log('Creating project...');
    let clone = spawnSync('git', ['clone', '-b', branch, url, '.']);

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
}

function renameProject() {
    // Only contains alphanumeric characters.
    let projNameClean = projName.replace(/^[^a-zA-Z]*/, '')
        .replace(/[^a-zA-Z0-9]/g, '');
    // Does not contain uppercase letters.
    let projNameCleanLowercase = projNameClean.toLowerCase()
    let oldProjName = "Generator-Swiftserver-Projects";
    let oldProjNameClean = "GeneratorSwiftserverProjects";
    let oldProjNameCleanLowercase = "generatorswiftserverprojects"

    // Rename directories (charts can't contain special characters).
    try {
        fs.renameSync("./chart/" + oldProjNameClean, "./chart/" + projNameClean);
        fs.renameSync("./Sources/" + oldProjName, "./Sources/" + projName);
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
    var renameLowercase = spawnSync('find', ['.', '-exec', 'sed', '-i', '', 's/' + oldProjNameCleanLowercase + '/' + projNameCleanLowercase + '/g', '{}', ';'])
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
}

function buildProject() {
    console.log('Running `swift build` to build project...');

    var build = spawnSync('swift', ['build'])
    if (build.status !== 0) {
        console.error(chalk.red('Failed to complete build.'));
        console.log(build.stderr.toString());
        process.exit(build.status);
    } else {
        console.log(chalk.green('Project built successfully.'));
        console.log('Next steps:');
        console.log('');
        console.log('Generate your Xcode project:');
        console.log(chalk.grey('   $ swift package generate-xcodeproj'));
        console.log('');
        console.log('Or, run your app from the terminal:');
        console.log(chalk.grey('   $ .build/debug/' + projName));
    }
}



function printHelp() {
    console.log("");
    console.log("  Usage: kitura init [options]");
    console.log("");
    console.log("  Scaffold a bare-bones Kitura project.");
    console.log("");
    console.log("  Options:");
    console.log("");
    console.log("    --help            print this help");
    console.log("    --skip-build      do not build the project");
    console.log("");
}

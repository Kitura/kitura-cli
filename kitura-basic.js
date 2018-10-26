#!/usr/bin/env node

const path = require('path');
const tools = require('./helper');

const gitURL = 'https://github.com/IBM-Swift/generator-swiftserver-projects';
const gitBranch = 'basic';

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
tools.validateDirectoryName(projName);

// Make sure directory is empty.
tools.checkCurrentDirIsEmpty();

// Clone repo contents into current directory.
tools.cloneProject(gitURL, gitBranch, args);

// Rename project to match current directory
tools.renameProject(projName, gitBranch);

// If '--skip-build' not specified, then build project.
if (!(args.includes('--skip-build'))) {
    tools.buildProject(projName);
}

function printHelp() {
    console.log("");
    console.log("  Usage: kitura basic [options]");
    console.log("");
    console.log("  Scaffold a skeleton Kitura project.");
    console.log("");
    console.log("  Options:");
    console.log("");
    console.log("    --help            print this help");
    console.log("    --skip-build      do not build the project");
    console.log("");
}

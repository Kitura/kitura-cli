#!/usr/bin/env node

const chalk = require('chalk');
const spawnSync = require('child_process').spawnSync;
const os = require('os');
const fs = require('fs');
const path = require('path');
const replaceInFile = require('replace-in-file');

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

function validateDirectoryName() {
  var problemChars = /[%:;="<>”|\\\/]/;
  if (problemChars.test(projName)) {
    console.error(chalk.red('Error: ') + 'Project directory cannot contain the following characters:  %":;=<>”|\\');
    process.exit(1);
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
        fs.renameSync("./chart/" + oldProjNameCleanLowercase, "./chart/" + projNameCleanLowercase);
        fs.renameSync("./Sources/" + oldProjName, "./Sources/" + projName);
    } catch (err) {
        console.error(chalk.red('Error: ') + 'could not rename directories.');
        console.error(err.message);
        process.exit(err.errno);
    }

    const lowercaseCurrentArtifacts = getArtifactsFor(oldProjNameCleanLowercase, "lowercase");
    const lowercaseNewArtifacts = getArtifactsFor(projNameClean, "lowercase");


    const uppercaseCurrentArtifacts = getArtifactsFor(oldProjName, "uppercase");
    const uppercaseNewArtifacts = getArtifactsFor(projName, "uppercase");

    for (const fileName of Object.keys(lowercaseCurrentArtifacts)) {
      if (fileName === "chart") {
         const filePath = `chart/${projNameCleanLowercase}/values.yaml`
         replaceProjectStringsInArtifact(filePath, lowercaseCurrentArtifacts[fileName], lowercaseNewArtifacts[fileName]);
      } else {
        replaceProjectStringsInArtifact(fileName, lowercaseCurrentArtifacts[fileName], lowercaseNewArtifacts[fileName]);
      }
    }
    for (const fileName of Object.keys(uppercaseCurrentArtifacts)) {
      replaceProjectStringsInArtifact(fileName, uppercaseCurrentArtifacts[fileName], uppercaseNewArtifacts[fileName]);
    }
}

function getArtifactsFor(name, valueCase) {
  return getArtifacts(name)[valueCase];
}

function getArtifacts(name) {
  return {
    lowercase: {
      "cli-config.yml" : [`container-name-run : "${name}-swift-run"`, `container-name-tools : "${name}-swift-tools"`, `image-name-run : "${name}-swift-run"`, `image-name-tools : "${name}-swift-tools"`, `chart-path : "chart/${name}"`],
      "debian/control" : [`Source: ${name}-0.0`, `Package: ${name}-0.0`],
      "debian/changelog" : [`${name}-0.0 (1-1) unstable; urgency=low`],
      "chart" : [`repository: registry.ng.bluemix.net/replace-me-namespace/${name}`]
    },
    uppercase: {
      "cli-config.yml" : [`debug-cmd : "/swift-utils/tools-utils.sh debug ${name} 1024"`],
      "debian/install" : [`.build/              usr/src/${name}`, `terraform/scripts/install.sh usr/src/${name}`, `terraform/scripts/start.sh   usr/src/${name}`],
      "iterative-dev.sh" : [`pid="$(pgrep ${name})"`, `echo "killing ${name}"`, `/swift-utils/tools-utils.sh debug ${name} 1024`, `./.build/debug/${name} &`],
      "Package.swift" : [`name: "${name}",`, `.target(name: "${name}", dependencies: [ .target(name: "Application"), "Kitura" , "HeliumLogger"]),` ],
      "terraform/scripts/start.sh" : [`./${name}`],
      "terraform/variables.tf" : [`default = "${name}-01"`],
      "Dockerfile" : [`CMD [ "sh", "-c", "cd /swift-project && .build-ubuntu/release/${name}" ]`]
    }
  }
}

function replaceProjectStringsInArtifact(filePath, fromStrings, toStrings) {
  for (const i in fromStrings) {
    const options = {
      files: filePath,
      from: fromStrings[i],
      to: toStrings[i]
    }
    replaceInFile.sync(options);
  }
}

function buildProject() {
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

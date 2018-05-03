#!/usr/bin/env node

const chalk = require('chalk');
const spawnSync = require('child_process').spawnSync;
var os = require('os');
var fs = require('fs');

let args = process.argv.slice(2);

if (args.length > 0) {
    if (args.indexOf('--help') > -1) {
        printHelp();
        process.exit(0);
    }
}

let path = require("path");
let currentDirPath = path.resolve("./");
let currentDir = path.basename(currentDirPath);
// Replace spaces with hyphens so Xcode project will build.
let projName = currentDir.replace(/ /g,"-")

if (projName.charAt(0) === '.') {
     console.error('Application name cannot start with .: %s')
   }
   if (projName.toLowerCase() === 'node_modules') {
    console.error('Application name cannot be {node_modules}')
   }
   if (projName.toLowerCase() === 'favicon.ico') {
     console.error('Application name cannot be {favicon.ico}')
}

// Make sure directory is empty.
checkEmptyDir()

// Clone repo contents into current directory.
cloneProject()

// Rename project to match current directory
renameProject()

// If '--skip-build' not specified, then build project.
if (!(args.includes('--skip-build'))) {
    buildProject()
}

function checkEmptyDir() {
  try {
    var data = fs.readdirSync('.')
    if (data.length !== 0) {
      console.error(chalk.red('Current directory is not empty.'));
      console.error(chalk.red('Please repeat the command in an empty directory.'));
      process.exit()
    }

  } catch(err) {
    console.error(err)
    process.exit()
  }
}

function cloneProject() {
  console.log('Creating project...')
  let clone = spawnSync('git', ['clone', '-b', 'init', 'https://github.com/IBM-Swift/generator-swiftserver-projects', '.'])

  if (clone.status !== 0) {
    console.error(chalk.red('Error: ') + 'failed to run git clone.');
    console.error('Please check that you have git installed.');
    console.error('Head to https://git-scm.com/downloads for more info.');
    process.exit(clone.status);
  }
  else {
    console.log(chalk.green('Project created successfully.'));
    if ((args.includes('--skip-build'))) {
      console.log('Next steps:')
      console.log('')
      console.log('Generate your Xcode project:')
      console.log(chalk.grey('   $ swift package generate-xcodeproj'))
      console.log('')
      console.log('Or, build your project from the terminal:')
      console.log(chalk.grey('   $ swift build -Xlinker -lc++'))
    }
  }

  // Remove git tracking
  let git = spawnSync('rm', ['-rf', '.git'])
  if (git.status !== 0) {
    console.error(chalk.red('Error: ') + 'failed to remove git tracking.');
    process.exit(git.status);
  }
}

function renameProject() {
  let projNameClean = projName.replace(/^[^a-zA-Z]*/, '')
                                  .replace(/[^a-zA-Z0-9]/g, '');
  let oldProjName = "generator-swiftserver-projects"
  let oldProjNameClean = "generatorswiftserverprojects"

  // Rename directories (charts can't contain special characters).
  try {
    fs.renameSync("./chart/" + oldProjNameClean, "./chart/" + projNameClean);
    fs.renameSync("./Sources/" + oldProjName, "./Sources/" + projName);
  } catch (err) {
    console.error(err)
    process.exit()
  }
  // Rename instances of project name (charts can't contain special characters)
  var renameClean = spawnSync('find', ['.', '-exec', 'sed', '-i', '', 's/'+oldProjNameClean+'/'+projNameClean+'/g', '{}', ';'])
  if (renameClean.status !== 0){
    console.error(chalk.red('Error: ') + 'could not rename project.');
    console.log(renameClean.stderr.toString())
    process.exit()
  }
  var rename = spawnSync('find', ['.', '-exec', 'sed', '-i', '', 's/'+oldProjName+'/'+projName+'/g', '{}', ';'])
  if (rename.status !== 0){
    console.error(chalk.red('Error: ') + 'could not rename project.');
    console.log(rename.stderr.toString())
    process.exit()
  }
}

function buildProject() {
  console.log('Running `swift build -Xlinker -lc++` to build project...')
    var opts = []
          if (os.platform() === 'darwin') {
            opts = ['-Xlinker', '-lc++']
          }

    var build = spawnSync('swift', ['build'].concat(opts))
    if (build.status !== 0) {
      console.error(chalk.red('Failed to complete build.'));
      console.log(build.stderr.toString())
      process.exit(build.status);
    }
    else {
      console.log(chalk.green('Project built successfully.'));
      console.log('Next steps:')
      console.log('')
      console.log('Generate your Xcode project:')
      console.log(chalk.grey('   $ swift package generate-xcodeproj'))
      console.log('')
      console.log('Or, run your app from the terminal:')
      console.log(chalk.grey('   $ .build/debug/' + projName))
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

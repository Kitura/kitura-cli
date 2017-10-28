#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;

program
    .parse(process.argv);

// Run NPM to install the Yeoman generator
var npm = spawnSync('npm', ['install', '-g', 'generator-swiftserver'], { stdio: 'inherit' });
if (npm.error) {
    console.error(chalk.red('Error: ') + 'NPM package installation failed');
    process.exit(npm.status);
}

let child = spawn('yo', ['swiftserver', '--init'], { stdio: 'inherit' });
child.on('error', (err) => {
    console.error(err);
});
child.on('close', (code) => {
    process.exit(code);
});

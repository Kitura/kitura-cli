#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const spawn = require('child_process').spawn;

program
    .parse(process.argv);

let child = spawn('bx', ['dev', 'run'], { stdio: 'inherit' });
child.on('error', (err) => {
    console.error(chalk.red('Error: ') + 'failed to run IBM Cloud Developer Tools');
    console.error('Run `kitura idt` to install');
});
child.on('close', (code) => {
    process.exit(code);
});

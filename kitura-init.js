#!/usr/bin/env node

const program = require('commander');

program
    .parse(process.argv);

const spawn = require('child_process').spawn;

spawn('yo', ['swiftserver', '--init'], { stdio: 'inherit' });

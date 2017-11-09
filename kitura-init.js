#!/usr/bin/env node

const program = require('commander');
const spawn = require('child_process').spawn;

let args = process.argv.slice(2);

let options = ['-p', 'yo@1', '-p', 'generator-swiftserver', '--', 'yo', 'swiftserver'];

if (args.length > 0) {
    options.push(args);
}

options.push('--init');

let child = spawn('npx', options, { stdio: 'inherit' });
child.on('error', (err) => {
    console.error(err);
});
child.on('close', (code) => {
    process.exit(code);
});

#!/usr/bin/env node

const program = require('commander');

program
    .parse(process.argv);

const spawn = require('child_process').spawn;

try {
    var child = spawn('yo', ['swiftserver'], { stdio: 'inherit' });
    child.on('error', (err) => {
        console.error(err);
    });
    child.on('close', (code) => {
        process.exit(code);
    });
} catch(err) {
    console.error(err);
}

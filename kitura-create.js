#!/usr/bin/env node

const program = require('commander');
const spawn = require('child_process').spawn;

program
    .parse(process.argv);

try {
    let child = spawn('yo', ['swiftserver'], { stdio: 'inherit' });
    child.on('error', (err) => {
        console.error(err);
    });
    child.on('close', (code) => {
        process.exit(code);
    });
} catch(err) {
    console.error(err);
}

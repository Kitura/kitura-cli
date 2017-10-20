#!/usr/bin/env node

const program = require('commander');

program
    .parse(process.argv);

const spawn = require('child_process').spawn;

try {
    var child = spawn('yo', ['swiftserver', '--init'], { stdio: 'inherit' });
    child.on('error', function(err) {
        console.log(err);
    });
} catch(err) {
    console.log(err);
}

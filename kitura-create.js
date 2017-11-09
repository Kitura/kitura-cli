#!/usr/bin/env node

const program = require('commander');
const spawn = require('child_process').spawn;

program
    .arguments('[modelname]')
    .parse(process.argv);

let options = ['-p', 'yo@1', '-p', 'generator-swiftserver', '--', 'yo'];

// If a parameter is passed, use this as a model name
if (program.args[0]) {
    options.push('swiftserver:model', program.args[0]);
} else {
    options.push('swiftserver');
}

// Run the generator
let child = spawn('npx', options, { stdio: 'inherit' });
child.on('error', (err) => {
    console.error(err);
});
child.on('close', (code) => {
    process.exit(code);
});

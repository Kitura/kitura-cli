#!/usr/bin/env node

const spawn = require('child_process').spawn;

let args = process.argv.slice(2);

let options = ['-p', 'yo@1', '-p', 'generator-swiftserver', '--', 'yo', 'swiftserver'];

if (args.length > 0) {
    if (args.indexOf('--help') > -1) {
        printHelp();
        process.exit(0);
    }
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

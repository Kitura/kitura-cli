#!/usr/bin/env node

const pjson = require('./package.json');
const program = require('commander');

program
    .version(pjson.version)
    .description('Kitura command-line interface')
    .command('build', 'build the project in a local container')
    .command('create', 'interactively create a Kitura project')
    .command('idt', 'install IBM Cloud Developer Tools')
    .command('init', 'scaffold a bare-bones Kitura project')
    .command('kit', 'print Cocoapods boilerplate for KituraKit')
    .command('run', 'run the project in a local container')
    .parse(process.argv);

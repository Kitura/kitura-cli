#!/usr/bin/env node

const pjson = require('./package.json');
const program = require('commander');

program
    .version(pjson.version)
    .description('Kitura command-line interface')
    .command('build', 'build the project in a local container')
    .command('create', 'interactively create a Kitura project').alias('c')
    .command('idt', 'install IBM Cloud Developer Tools')
    .command('init', 'scaffold a bare-bones Kitura project').alias('i')
    .command('run', 'run the project in a local container')
    .parse(process.argv);

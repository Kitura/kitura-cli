#!/usr/bin/env node

const pjson = require('./package.json');
const program = require('commander');

program
    .version(pjson.version)
    .description('Kitura command-line interface')
    .command('init', 'scaffold a bare-bones Kitura project').alias('i')
    .command('create', 'interactively create a Kitura project').alias('c')
    .parse(process.argv);

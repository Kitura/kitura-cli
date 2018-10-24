#!/usr/bin/env node

const pjson = require('./package.json');
const program = require('commander');

program
    .version(pjson.version)
    .description('Kitura command-line interface')
    .command('init', 'scaffold a bare-bones Kitura project')
    .command('api', 'scaffold a Kitura project with OpenAPI')
    .command('basic', 'create a skeleton Kitura project')
    .command('create', 'interactively create a Kitura project')
    .command('sdk', 'generate a client SDK from an OpenAPI/Swagger spec')
    .command('idt', 'install IBM Cloud Developer Tools')
    .command('kit', 'print Cocoapods boilerplate for KituraKit')
    .command('build', 'build the project in a local container')
    .command('run', 'run the project in a local container')
    .parse(process.argv);

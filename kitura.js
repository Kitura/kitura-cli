#!/usr/bin/env node

/*
 * Copyright IBM Corporation 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const pjson = require('./package.json');
const program = require('commander');

program
    .version(pjson.version)
    .description('Kitura command-line interface')
    .command('init', 'scaffold a cloud ready Kitura project.')
    .command('api', 'scaffold a Kitura project with OpenAPI')
    .command('basic', 'scaffold a skeleton Kitura project')
    .command('create', 'interactively create a Kitura project')
    .command('sdk', 'generate a client SDK from an OpenAPI/Swagger spec')
    .command('idt', 'install IBM Cloud Developer Tools')
    .command('kit', 'print Cocoapods boilerplate for KituraKit')
    .command('build', 'build the project in a local container')
    .command('run', 'run the project in a local container')
    .parse(process.argv);

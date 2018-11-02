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

const chalk = require('chalk');
const spawn = require('child_process').spawn;

// Remove the node executable and script name
let args = process.argv.slice(2);

let options = ['sdk', 'generate'];

if (args.length > 0) {
    if (args.indexOf('--help') > -1) {
        printHelp();
        process.exit(0);
    }

    // Add on the rest of the arguments
    options = options.concat(args);
}

let child = spawn('bx', options, { stdio: 'inherit' });
child.on('error', (err) => {
    console.error(chalk.red('Error: ') + 'failed to run IBM Cloud Developer Tools');
    console.error('Run `kitura idt` to install');
});
child.on('close', (code) => {
    process.exit(code);
});

function printHelp() {
    console.log("");
    console.log("  Usage: kitura sdk [target] [options]");
    console.log("");
    console.log("  Create a client SDK from an OpenAPI/Swagger specification.");
    console.log("");
    console.log("  Targets:");
    console.log("    --ios             Create an iOS SDK");
    console.log("    --android         Create an Android SDK");
    console.log("    --js              Create a JavaScript SDK");
    console.log("");
    console.log("  Options:");
    console.log("    -l <location>     Use a locally hosted specification, eg. http://localhost:8080/openapi");
    console.log("    -f <location>     Use a local file for the specification");
    console.log("    --help            print this help");
    console.log("");
    console.log("  Sample Usage:");
    console.log("    kitura sdk --android -l http://localhost:8080/openapi");
}

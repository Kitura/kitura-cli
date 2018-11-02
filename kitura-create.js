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

let options = ['-p', 'yo@1', '-p', 'generator-swiftserver', '--', 'yo', 'swiftserver'];

if (args.length > 0) {
    if (args.indexOf('--help') > -1) {
        printHelp();
        process.exit(0);
    }

    // If the first argument starts with '--' assume it is the name
    // of the subgenerator to run and replace 'swiftserver' with
    // 'swiftserver:subgeneratorname'.
    if (args[0].startsWith('--') && args[0].length > 2) {
        options[options.length - 1] = options[options.length - 1] + ':' + args.shift().substr(2);
    }

    // Add on the rest of the arguments
    options = options.concat(args);
}

// Run the generator
let child = spawn('npx', options, { stdio: 'inherit' });
child.on('error', (err) => {
    console.error(chalk.red('Error: ') + 'failed to run npx.');
    console.error('Please check `node -v` is >= v8.2.0 and `npm -v` is >= 5.2.0.');
});
child.on('close', (code) => {
    process.exit(code);
});

function printHelp() {
    console.log("");
    console.log("  Usage: kitura create [<name>] [options]");
    console.log("");
    console.log("  Interactively create a Kitura project.");
    console.log("");
    console.log("  Options:");
    console.log("");
    console.log("    <name>            project name");
    console.log("    --help            print this help");
    console.log("    --model [<name>]  run the model subgenerator");
    console.log("    --property        run the property subgenerator");
    console.log("    --skip-build      do not build the project");
    console.log("");
}

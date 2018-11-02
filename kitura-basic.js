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

const tools = require('./helper');
const gitBranch = 'basic';

// If '--help' is specified then print help.
tools.checkArgs();

// Make sure project name doesn't start with problem characters.
tools.validateProjectName();

// Make sure directory doesn't contain problem characters.
tools.validateDirectoryName();

// Make sure directory is empty.
tools.checkCurrentDirIsEmpty();

// Clone repo contents into current directory.
tools.cloneProject(gitBranch);

// Rename project to match current directory
tools.renameProject(gitBranch);

// If '--skip-build' not specified, then build project.
tools.buildProject();

function printHelp() {
    console.log("");
    console.log("  Usage: kitura basic [options]");
    console.log("");
    console.log("  Scaffold a skeleton Kitura project.");
    console.log("");
    console.log("  Options:");
    console.log("");
    console.log("    --help            print this help");
    console.log("    --skip-build      do not build the project");
    console.log("");
}

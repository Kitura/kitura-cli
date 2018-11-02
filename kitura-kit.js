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

const program = require('commander');

program
    .parse(process.argv);

console.log('Add the following lines to your Podfile to install KituraKit into your iOS app using CocoaPods:');
console.log('');
console.log('# Pod for KituraKit');
console.log('pod \'KituraKit\', :git => \'https://github.com/IBM-Swift/KituraKit.git\', :branch => \'pod\'');

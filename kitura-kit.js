#!/usr/bin/env node

const program = require('commander');

program
    .parse(process.argv);

console.log('Add the following lines to your Podfile to install KituraKit into your iOS app using CocoaPods:');
console.log('');
console.log('# Pod for KituraKit');
console.log('pod \'KituraKit\'');


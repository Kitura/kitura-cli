#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const request = require('request');

program
    .parse(process.argv);

const url = 'tbc'; // FIXME
const filename = 'KituraKit.zip';

// Download KituraKit from GitHub
console.log('Downloading...');

request
    .get({url, followAllRedirects: true})
    .on('error', (err) => {
        console.error(chalk.red('Error: ') + 'download failed.');
    })
    .on('response', (response) => {
        console.log('KituraKit downloaded to ' + filename);
    })
    .pipe(fs.createWriteStream(filename));

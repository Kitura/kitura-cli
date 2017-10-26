#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const request = require('request');

program
    .parse(process.argv);

const url = 'https://api.github.com/repos/IBM-Swift/KituraKit/zipball';
const filename = 'KituraKit.zip';

// Download KituraKit from GitHub
console.log('Downloading...');

request
    .get({url, followAllRedirects: true, headers: { 'User-Agent': 'node.js'}})
    .on('error', (err) => {
        console.error(chalk.red('Error: ') + 'download failed.');
    })
    .on('response', (response) => {
        console.log('KituraKit downloaded to ' + filename);
    })
    .pipe(fs.createWriteStream(filename));

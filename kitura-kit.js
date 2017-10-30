#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const program = require('commander');
const request = require('request');

program
    .parse(process.argv);

const options = {
    method: "GET",
    followAllRedirects: true,
    headers: {
        "user-agent": "node.js"
    }
};

const url = 'https://api.github.com/repos/IBM-Swift/KituraKit/releases';
const filename = 'KituraKit.zip';

// Download KituraKit from GitHub
console.log('Downloading KituraKit...');

request(url, options, function(error, response, body) {
    if (error) {
        console.error(chalk.red('Error: ') + 'failed to get releases from GitHub.');
        return;
    }

    let latestKit;
    try {
        let releases = JSON.parse(body);
        latestKit = releases[0].assets[0].browser_download_url
    } catch (err) {
        console.error(chalk.red('Error: ') + 'failed to find release URL from GitHub');
        return;
    }

    request
        .get(latestKit, options)
        .on('error', (err) => {
            console.error(chalk.red('Error: ') + 'download failed.');
        })
        .on('response', (response) => {
            console.log('KituraKit downloaded to ' + filename);
        })
        .pipe(fs.createWriteStream(filename));
    });

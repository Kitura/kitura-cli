#!/usr/bin/env node

const program = require('commander');
const request = require('request');
const spawn = require('child_process').spawn;

program
    .parse(process.argv);

const url = 'https://ibm.biz/kitura-idt';

// Run bash, setting stdin as a pipe
let child = spawn('bash', [], { stdio: ['pipe', 'inherit', 'inherit'] });
child.on('error', (err) => {
    console.error(err);
});
child.on('close', (code) => {
    process.exit(code);
});

// Ensure that Ctrl-C also kills the child
process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit();
});

// Download the IDT installer and pipe it to the child
request
    .get({url, followAllRedirects: true})
    .on('error', (err) => { console.error(err); })
    .pipe(child.stdin);

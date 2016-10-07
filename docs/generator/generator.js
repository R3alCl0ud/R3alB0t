const fs = require('fs-extra');
const Scanner = require('./scanner');

const scanner = new Scanner(this);

scanner.scan('./lib/').then(console.log).catch(console.log);
console.log("test")
var install = require("./index");
var argv = require('minimist')(process.argv.slice(2));
var commands = argv._;


install.plugin(commands);

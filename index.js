var path = require("path");
var chalk = require("chalk");
var execSync = require('child_process').execSync;

function getPrefix() {
  try {
    return execSync('npm config get prefix').toString().trim();
  } catch (err) {
    throw new Error(`exec npm config get prefix ERROR: ${err.message}`);
  }
}
module.exports = {
  plugin : function(cmd){
    console.log(chalk.green("Plugin \`Install\` load Done."));
    console.log(getPrefix());
  }
}

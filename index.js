const path = require("path");
const os = require("os");
const chalk = require("chalk");
const execSync = require('child_process').execSync;
const co = require('co');
const npminstall = require('npminstall');

var commands = null;

function getPrefix() {
  try {
    return execSync('npm config get prefix').toString().trim();
  } catch (err) {
    throw new Error(`exec npm config get prefix ERROR: ${err.message}`);
  }
}

function getNodeModulePath(name) {
  return `${getPrefix()}/lib/node_modules/${name}/`;
}

function installPackage(pkg,name) {
  co(function*() {
    yield npminstall({
      // install root dir
      root: getNodeModulePath(name),
      // optional packages need to install, default is package.json's dependencies and devDependencies
      pkgs: [{
        name: pkg
      }],
      // install to specific directory, default to root
      // targetDir: '/home/admin/.global/lib',
      // link bin to specific directory (for global install)
      // binDir: '/home/admin/.global/bin',
      // registry, default is https://registry.npmjs.org
      // registry: 'https://registry.npmjs.org',
      // debug: false,
      // storeDir: root + 'node_modules',
      storeDir: path.join(os.homedir(), '.uba', 'install')
      // ignoreScripts: true, // ignore pre/post install scripts, default is `false`
      // forbiddenLicenses: forbit install packages which used these licenses
    });
  }).catch(err => {
    console.error(err.stack);
  });
}
module.exports = {
  plugin: function(options) {
    commands = options.cmd;
    console.log(options);
    console.log(chalk.green("Plugin \`Install\` load Done."));
    installPackage(commands[1],options.name);
  }
}

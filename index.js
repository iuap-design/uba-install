const path = require("path");
const os = require("os");
const chalk = require("chalk");
const execSync = require('child_process').execSync;
const co = require('co');
const fs = require('fs');
const npminstall = require('npminstall');

var commands = null,
  pluginname = null;
var installDir = os.homedir() + "/.uba";
var ubaVersionPath = installDir + "/uba-plugin.json";

function getPrefix() {
  try {
    return execSync('npm config get prefix').toString().trim();
  } catch (err) {
    throw new Error(`exec npm config get prefix ERROR: ${err.message}`);
  }
}

function getNodeModulePath(name) {
  return os.platform() == "darwin" ? `${getPrefix()}/lib/node_modules/${name}/` : `${getPrefix()}/node_modules/${name}/`;
}

function getPlatform() {
  return os.platform();
}

function uninstall(pkgname) {
  fs.readFile(ubaVersionPath, "utf8", (err, data) => {
    var configObj = JSON.parse(data);
    console.log(configObj);
    delete configObj["version"][pkgname];
    console.log(configObj);
    fs.writeFile(ubaVersionPath, JSON.stringify(configObj), (err) => {
      if (err) throw err;
    });
  });
}

function updateVersion(pkgname) {
  var version = require(`${getNodeModulePath(pluginname)}node_modules/uba-${pkgname}/package.json`).version;
  fs.readFile(ubaVersionPath, "utf8", (err, data) => {
    var configObj = JSON.parse(data);
    configObj["version"][pkgname] = version;
    fs.writeFile(ubaVersionPath, JSON.stringify(configObj), (err) => {
      if (err) throw err;
      console.log(chalk.green(`plugin uba-${pkgname} success installed.`));
    });
  });
}

function installPackage(pkg, name) {
  co(function*() {
    yield npminstall({
      // install root dir
      root: getNodeModulePath(name),
      // optional packages need to install, default is package.json's dependencies and devDependencies
      pkgs: [{
        name: "uba-" + pkg
      }],
      // install to specific directory, default to root
      // targetDir: '/home/admin/.global/lib',
      // link bin to specific directory (for global install)
      // binDir: '/home/admin/.global/bin',
      // registry, default is https://registry.npmjs.org
      registry: 'https://registry.npm.taobao.org',
      // debug: false,
      // storeDir: root + 'node_modules',
      storeDir: path.join(os.homedir(), '.uba', 'install')
      // ignoreScripts: true, // ignore pre/post install scripts, default is `false`
      // forbiddenLicenses: forbit install packages which used these licenses
    });
  }).catch(err => {
    console.error(err.stack);
  }).then(function(value) {
    console.log(chalk.green("Plugin installed."));
    updateVersion(pkg);
  });
}
module.exports = {
  plugin: function(options) {
    commands = options.cmd;
    pluginname = options.name;
    console.log(chalk.green("Plugin \`Install\` load Done."));
    installPackage(commands[1], options.name);
  }
}

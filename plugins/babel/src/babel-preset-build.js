const { resolve } = require('path');

module.exports = function plugin(config) {
  const plugin = resolve(__dirname, './plugin.js');
  config.plugins.push([plugin]);
};

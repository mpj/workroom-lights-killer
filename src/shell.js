var core = require('./core')
var services = {
  fs: require('fs'),
  hue: require('node-hue-api'),
  console: console
}
var shell = function() {
  return core(services)
}
module.exports = shell

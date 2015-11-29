var core = require('./core')
module.exports = core.bind(null, {
  fs: require('fs'),
  hue: require('node-hue-api'),
  console: console
})

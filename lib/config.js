var config = require('../config.json');

// Set configuration defaults
config.directory = require('path').resolve(config.directory);
config.port = config.port || 3036;

config.files = [];

module.exports = config;

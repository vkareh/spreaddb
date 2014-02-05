#!/usr/bin/env node
process.title = 'spreaddb';

// Set configuration defaults
var config = require('./config.json');
config.directory = require('path').resolve(config.directory);
config.port = config.port || 3036;

// Store configuration globally
global.spreaddb = config;

// Initialize
require('./lib/init');

// Start express server
require('./lib/server').listen(config.port);
console.log('SpreadDB listening on port ' + config.port);

#!/usr/bin/env node
process.title = 'spreaddb';

var config = require('./lib/config');

// Initialize
require('./lib/init');

// Start express server
require('./lib/server').listen(config.port);
console.log('SpreadDB listening on port ' + config.port);

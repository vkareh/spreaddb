var csv = require('csv');

var CSV = {};

CSV.data = function(filename, callback) {
    csv()
    .from.path(filename, {columns: true})
    .to.array(function(data) {
        callback(null, data);
    })
    .on('error', function(err) {
        callback(err);
    });
}

module.exports = CSV;

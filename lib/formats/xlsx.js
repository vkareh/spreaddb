var xlsx = require('xlsx');

var XLSX = {};

XLSX.data = function(filename, callback) {
    var file = xlsx.readFile(filename),
        sheet = file.Sheets[file.SheetNames[0]],
        data = xlsx.utils.sheet_to_row_object_array(sheet);

    callback(null, data);
};

module.exports = XLSX;

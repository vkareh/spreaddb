SpreadDB
========

SpreadDB is a spreadsheet-oriented database server. It currently exposes csv,
xls, and xlsx files as JSON data through a REST API. This is work in progress
and currently only exposes non-indexed read-only data.

Usage
-----
This software requires node.js >=0.10.

A sample configuration file is included (`config.json`) which defaults the
service port to 3036 and the data directory to `./test`.

Start the server (`node spreaddb.js` or `npm start`) and browse to
[http://localhost:3036](http://localhost:3036). You should be greeted with the
welcome message.

There are several service endpoints:

* `/_all` returns an array of all spreadsheet files. It takes one optional query
string: `?stats=true`.
* `/<filename>` requesting the full filename (extension included) will return
all data for that spreadsheet file, in JSON format. It also takes the following
query strings:
    - `skip=<number>` Skip this number of records. Used for pagination.
    - `limit=<number>` Limit result set to this number of records. Used for
    pagination.
    - `sort=<attr>` Sort by this specific attribute
    - `reverse=<true|false>` Reverse sort. Defaults to `false`
    - `columns[]=<attr>` Returns only the listed columns. Pass this argument
    multiple times to select specific columns. For example:
    `?columns[]=name&columns[]=email`
* `/<filename>/<row>` returns the first record in `<filename>` for which the
first attribute is the passed value. Most useful when the first column of the
spreadsheet is a unique ID.

To do
-----
* Add internal Lucene-style indexing and corresponding `POST` endpoint
* Allow `PUT`, `POST`, `PATCH`, `DELETE` for spreadsheet files
* Allow `GET`, `POST` for config file
* Create bundled web-based UI
* Create basic access-control layer
* Add support for .ods files
* Add support for multiple worksheets
* Tests!

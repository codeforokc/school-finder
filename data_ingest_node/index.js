/**
* © 2014 CodeForOKC. All rights reserved.
* Author: Adam Veldhousen
* Author: Karl Kirch <karlkrch@gmail.com>
*/

var async = require('async');
var fs = require('fs');
var schools = require('./schoolData');
var schoolDistricts = require('./schoolDistrictData')

init();

function init() {

  var ingestType = process.argv[2];
  var inputFileName = process.argv[3];
  var validInput = true;
  var ingestFn = function(dataString, cb){cb();}; //noop
  var uploadFn = function(dataObj, cb){cb();}; //noop

  if (!ingestType) {
    console.error("Invalid ingest type. Must be one of [school]");
    validInput = false;
  }
  if (!inputFileName) {
    console.error("Invalid file name.");
    validInput = false;
  }

  if (!validInput) {
    process.exit(1);
  }

  if (ingestType == "school") {
    ingestFn = function(stringData, cb) {
      return cb(undefined, schools.parseData(stringData));
    }
    uploadFn = function(dataObj, cb) {
      console.log(JSON.stringify(dataObj, null, 2));
      cb();
    }
  }

  if (ingestType == "schoolDistrict") {
    ingestFn = function(stringData, cb) {
      return cb(undefined, schoolDistricts.parseData(stringData));
    }
    uploadFn = function(dataObj, cb) {
      console.log(JSON.stringify(dataObj, null, 2));
      cb();
    }
  }

  async.waterfall([
    async.apply(fs.readFile, inputFileName, { encoding: 'utf8'}),
    async.apply(ingestFn),
    async.apply(uploadFn)
  ], function(err) {
    var exitCode = 0;
    if (err) {
      console.error(err);
      exitCode = 1;
    }
    process.exit(exitCode);
  });
}

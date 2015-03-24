/**
* © 2014 CodeForOKC. All rights reserved.
* Author: Adam Veldhousen
* Author: Karl Kirch <karlkrch@gmail.com>
*/

var async = require('async');
var fs = require('fs');
var schools = require('./schoolData');
var schoolDistricts = require('./schoolDistrictData');
var policeStations = require('./policeData');
var fireStations = require('./fireStationData');
var topojson = require('topojson');

var parseTypeFns = {
  school: schools.parseData,
  schoolDistrict: schoolDistricts.parseData,
  policeStation: policeStations.parseData,
  fireStation: fireStations.parseData
};
var outputTransformFns = {
  geojson: noop,
  topojson: toTopoJson
};

init();

function init() {

  var ingestTypeStr = process.argv[2];
  var outputTypeStr = process.argv[3];
  var inputFileName = process.argv[4];

  var validInput = true;
  var parseFn = parseTypeFns[ingestTypeStr];
  var outputTransformFn = outputTransformFns[outputTypeStr];
  var uploadFn = function(dataObj, cb){
    //just log for now
    console.log(JSON.stringify(dataObj, null, 2));
    cb();
  };

  if (!parseFn) {
    console.error("Invalid ingest type. Must be one of %s", JSON.stringify(Object.keys(ingestTypeFns)));
    validInput = false;
  }
  if (!inputFileName) {
    console.error("Invalid file name.");
    validInput = false;
  }
  if (!outputTransformFn) {
    console.error("Invalid output type. Must be one of %s", JSON.stringify(Object.keys(outputTransformFns)));
    validInput = false;
  }

  if (!validInput) {
    process.exit(1);
  }

  async.waterfall([
    async.apply(fs.readFile, inputFileName, { encoding: 'utf8'}),
    async.apply(function(dataStr, cb) {
      return cb(undefined, parseFn(dataStr));
    }),
    async.apply(outputTransformFn),
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

function toTopoJson(geojson, cb) {
  return cb(undefined, topojson.topology({
    collection: geojson
  },{
    'property-transform': function propertyTransform(feature) {
      return feature.properties;
    }
  }));
}

function noop(geojson, cb) {
  cb(undefined, geojson);
}

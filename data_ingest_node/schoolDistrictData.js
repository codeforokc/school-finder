/**
* © 2014 CodeForOKC. All rights reserved.
* Author: Adam Veldhousen
* Author: Karl Kirch <karlkrch@gmail.com>
*/

var async = require('async');
var WKT = require('terraformer-wkt-parser');

var preReplacePatterns = {};
// special cases
var postReplacePatterns = {};
var schoolNameColumnIndex = 1;

module.exports = exports = {
  parseData: parseData
};

function parseData(stringData) {
  var rows = stringData.split(/\n/);
  var rowAggregator = createRowAggregator(rows);
  var schoolDistrictObjArray = rows.slice(1, rows.length - 1).reduce(rowAggregator, []);
  return featureCollection = {
    type: "FeatureCollection",
    features: schoolDistrictObjArray.map(schoolDistrictToGeoJson)
  };
}

function createRowAggregator(rows) {
  var columnHeaders = rows[0].split(";");

  // clean up the header names a bit
  columnHeaders = columnHeaders.map(function(header) {
    return header.trim().toLowerCase();
  });

  return function aggregateRows(acc, item){
    var columnValues = item.split(/;/),
    rowObj = columnValues.reduce(function(obj, columnValue, index) {
      var columnHeader = columnHeaders[index];
      var val = columnValue.trim();
      obj[columnHeader] = val;
      return obj;
    }, {});

    acc.push(rowObj);

    return acc;
  };
};


function schoolDistrictToGeoJson(schoolDistrict) {
  return geoJson = {
    id: schoolDistrict.object_id,
    type: "Feature",
    geometry: WKT.parse(schoolDistrict.shape),
    properties: {
      schoolDistrictCode: schoolDistrict.school_district_code,
      schoolDistrictName: schoolDistrict.school_district_name
    }
  };
}

/**
* © 2014 CodeForOKC. All rights reserved.
* Author: Adam Veldhousen
* Author: Karl Kirch <karlkrch@gmail.com>
*/

var async = require('async');
var reproject = require('./reproject');
var WKT = require('terraformer-wkt-parser');

var preReplacePatterns = {
  "\\bES\\b": "Elementary School",
  "\\bMS\\b": "Middle School",
  "\\bJHS\\b": "Junior High",
  "\\bJH\\b": "Junior High",
  "\\bHS\\b": "High School",
  "\\bIS\\b": "Independent School",
  "\\bSCHL\\b": "School",
  "\\bSCH\\b": "School",
  "\\bCS\\b": "Charter School",
  "\\bALTERNATIVE\\b": "Alternative School",
  "\\bCONT\\b": "Continuing",
  "\\bSTUD\\b": "Studies",
  "\\bSCI\\b": "Science",
  "\\bACAD\\b": "Academy",
  "\\bNE\\b": "North East",
  "\\bOKLA\\b": "Oklahoma",
  "PERF\.": "Performing",
  "\\bMHS\\b": "High School", // Mustang MHS is Mustang High School
  "\\bCTR\\b": "Center",
};
// special cases
var postReplacePatterns = {
  "\\bokc\\b": "OKC",
  "Emerson Alternative School Ed\. (Middle School)": "Emerson Alternative Education (Middle School)",
};
var schoolNameColumnIndex = 1;

module.exports = exports = {
  parseData: parseData
};

function parseData(stringData) {
  var rows = stringData.split(/\n/);
  var rowAggregator = createRowAggregator(rows);
  var schoolObjArray = rows.slice(1, rows.length - 1).reduce(rowAggregator, []);
  return featureCollection = {
    type: "FeatureCollection",
    features: schoolObjArray.map(schoolToGeoJson)
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
      if (index == schoolNameColumnIndex) {
        obj["school_name"] = cleanSchoolName(val);
        obj["original_school_name"] = val;
      } else {
        obj[columnHeader] = val;
      }
      return obj;
    }, {});

    acc.push(rowObj);

    return acc;
  };
};

function cleanSchoolName(schoolName) {
  var replacePatternKeys = Object.keys(preReplacePatterns);
  var i, pattern;
  for (i = 0; i < replacePatternKeys.length; ++i) {
    pattern = replacePatternKeys[i];
    schoolName = schoolName.replace(new RegExp(pattern, "gi"), preReplacePatterns[pattern]);
  }
  schoolName = nameCase(schoolName);
  replacePatternKeys = Object.keys(postReplacePatterns);
  for (i = 0; i < replacePatternKeys.length; ++i) {
    pattern = replacePatternKeys[i];
    schoolName = schoolName.replace(new RegExp(pattern, "gi"), postReplacePatterns[pattern]);
  }
  return schoolName;
}
function nameCase(str) {
  return str.toLowerCase().replace(/\b([\w']+)\b/gi, capitalizeFirstLetter);
}

function capitalizeFirstLetter(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
}

function schoolToGeoJson(school) {
  return geoJson = {
    id: school.object_id,
    type: "Feature",
    geometry: reproject.reprojectGeometry(WKT.parse(school.shape)),
    properties: {
      schoolName: school.school_name,
      originalSchoolName: school.original_school_name
    }
  };
}

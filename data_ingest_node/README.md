# Data Ingest

This describes the data ingest process for the school-finder application.

There are pre derived data sets in the data folder (these may be stale though). Feel free to use these for development until there's an official home for up to date data.

## Technical Details

This is a node application that is designed be run against data sets provided by data.okc.gov. Node 0.10.x is required to run this app. It specifically takes in the CSV products provided by the city and returns a geojson FeatureCollection or topojson with the derived data.

## App structure

* `index.js` - the app entry point
* `schoolData.js` - parser for schools data
* `schoolDistrictData.js` - parser for school districts data
* `reproject.js` - utilities to reproject geojson features

## Generating a data set

Currently the two supported data sets are:
* Schools - ingestFileType of `school`
* School District Boundaries - ingestFileType of `schoolDistrict`

School data will output point features and school district data will output polygon/multipolygon features.

Currently the two supported output types are:
* `geojson`
* `topojson`

To generate a data set:
* Install the required dependencies - `npm install`
* Download the original CSV file from data.okc.gov
* Run the app (will dump output to STDOUT) - `node index.js <ingestFileType> <outputFileType> <ingestFilePath>`

If you want to dump the output to a file, `node index.js <ift> <oft> <ifpth> > out.geojson`

## Data set format

#### Schools
Feature collection with each school being represented as a geojson/topojson feature (point). The `properties` object on each school feature will be in the following format:
```json
"properties": {
  "schoolName": <string>, // cleaned school name
  "originalSchoolName": <string> // original school name from dataset
}
```

#### School Districts
Feature collection with each school being represented as a geojson/topojson feature (polygon or multipolygon). The `properties` object on each school district feature will be in the following format:
```json
"properties": {
  "schoolDistrictCode": <string>, // school district code
  "schoolDistrictName": <string> // school district name
}
```


## Copyright and license

Copyright 2014 Code for OKC. Licensed under the MIT License.

# Data Ingest

This describes the data ingest process for the school-finder application.

There are pre derived data sets in the data folder (these may be stale though). Feel free to use these for development until there's an official home for up to date data.

## Technical Details

This is a node application that is designed be run against data sets provided by data.okc.gov. Node 0.10.x is required to run this app. It specifically takes in the semicolon delimited data files provided by the city and returns a geojson FeatureCollection or topojson with the derived data.

## App structure

* `index.js` - the app entry point
* `schoolData.js` - parser for schools data
* `schoolDistrictData.js` - parser for school districts data
* `reproject.js` - utilities to reproject geojson features

## Generating a data set

Currently the two supported data sets are:
* Schools - ingestFileType of `school`
* School District Boundaries - ingestFileType of `schoolDistrict`

Currently the two supported output types are:
* `geojson`
* `topojson`

To generate a data set:
* Install the required dependencies - `npm install`
* Download the original CSV file from data.okc.gov
* Run the app (will dump output to STDOUT) - `node index.js <ingestFileType> <outputFileType> <ingestFilePath>`

If you want to dump the output to a file, `node index.js <ift> <oft> <ifpth> > out.geojson`

## Data set format examples

#### Schools
```json
{
  "type": "FeatureCollection",
  "features":[
    {
      "id": <string>,
      "type": "Feature",
      "geometry": {/* school geometry */},
      "properties": {
        "schoolName": <string>,
        "originalSchoolName": <string>
      }
    },
    ...
  ]
}
```

#### School Districts
```json
{
  "type": "FeatureCollection",
  "features":[
    {
      "id": <number>,
      "type": "Feature",
      "geometry": {/* school geometry */},
      "properties": {
        "schoolDistrictName": <string>,
        "schoolDistrictCode": <string>
      }
    },
    ...
  ]
}
```

## Copyright and license

Copyright 2014 Code for OKC. Licensed under the MIT License.

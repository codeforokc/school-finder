# Data Ingest

This describes the data ingest process for the school-finder application.

There are pre derived data sets in the data folder (these may be stale though). Feel free to use these for development until there's an official home for up to date data.

## Technical Details

This is a node application that is designed be run against data sets provided by data.okc.gov. Node 0.10.x is required to run this app. It specifically takes in the semicolon delimited data files provided by the city and returns a geojson FeatureCollection or topojson with the derived data.

## App structure

* `index.js` - the app entry point
* `schoolData.js` - parser for schools data
* `schoolDistrictData.js` - parser for school districts data
* `policeData.js` - parser for police stations data
* `fireStationData.js` - parser for fire stations data
* `reproject.js` - utilities to reproject geojson features

## Generating a data set

Currently the four supported data sets are Schools, School District Boundaries, Police Stations, and Fire Stations (with their ingestFileType being `school`, `schoolDistrict`, `policeStation`, and `fireStation` respectfully). There is a link to their specific page for [school](http://data.okc.gov/applications/datadownload/forms/DownloadDetails.aspx?DataSetID=17) and [school disrict](http://data.okc.gov/applications/datadownload/forms/DownloadDetails.aspx?DataSetID=3), or a direct link to the semicolon file for [school](http://data.okc.gov/DataFiles/FilesForDownload/Schools.txt) and [school district](http://data.okc.gov/DataFiles/FilesForDownload/SchoolDistrictBoundaries.txt).
The police and fire data was requested via the City's open data request.

Currently the two supported output types are:
* `geojson`
* `topojson`

To generate a data set:
* Install the required dependencies - `npm install`
* Download the semicolon delimented file from data.okc.gov, either for [school](http://data.okc.gov/applications/datadownload/forms/DownloadDetails.aspx?DataSetID=17) or [school disrict](http://data.okc.gov/applications/datadownload/forms/DownloadDetails.aspx?DataSetID=3).
Or use the data set in the data folder.
* Run the app (will dump output to STDOUT) - `node index.js <ingestFileType> <outputFileType> <ingestFilePath>`

If you want to dump the output to a file, `node index.js [school|schoolDistrict] [geojson|topojson] <ifpth> > out.geojson`

## Data set format examples

#### Schools
```json
{
  "type": "FeatureCollection",
  "features":[
    {
      "id": <string>,
      "type": "Feature",
      "geometry": {/* school geometry (polygon or multipolygon) */},
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
      "geometry": {/* school district geometry (polygon or multipolygon) */},
      "properties": {
        "schoolDistrictName": <string>,
        "schoolDistrictCode": <string>
      }
    },
    ...
  ]
}
```

#### Police Stations
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "id": <string>,
      "type": "Feature",
      "geometry": {/* police station geometry (point) */},
      "properties": {
        "facility": <string description of facility>,
        "address": <string>
      }
    },
    ...
  ]
}
```

#### Fire Stations
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "id": <string>,
      "type": "Feature",
      "geometry": {/* fire station geometry (point) */},
      "properties": {
        "station_num": <string>,
        "address": <string>
      }
    },
    ...
  ]
}
```

## Copyright and license

Copyright 2014, 2015 Code for OKC. Licensed under the MIT License.

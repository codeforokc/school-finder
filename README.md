# OKC School Finder

[![Join the chat at https://gitter.im/codeforokc/school-finder](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/codeforokc/school-finder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Geolocation-based web app for locating schools and school districts near you.

This project consists of several modules.  Please see the README for
each module to find out how to work with that part of the project.

* [User facing frontend](https://github.com/codeforokc/school-finder/tree/master/school-finder-frontend)
* [Backend data ingest](https://github.com/codeforokc/school-finder/tree/master/data_ingest_node)

### Phase 1
See issues for things that need to be done.

### Phase 2
TBD

## Technical Details

### Data Upload/Translate Process

* *Ongoing discussion: https://github.com/codeforokc/school-finder/issues/4*

### Client

* Create [Mapbox](https://www.mapbox.com/) map without dataset
* Use [Turf](http://turfjs.org/) to query for distance information
* Use [Leaflet](http://leafletjs.com/) or [Turf](http://turfjs.org/) to query for polygon information at a point
* Use [Leaflet](http://leafletjs.com/) to visualize schools/school districts on top of Mapbox map via dataset
* Use [Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/) for reverse geocoding addresses

## Data

* [School District Boundaries](http://data.okc.gov/applications/datadownload/forms/DownloadDetails.aspx?DataSetID=3) via data.okc.gov
* [Schools](http://data.okc.gov/applications/datadownload/forms/DownloadDetails.aspx?DataSetID=17) via data.okc.gov

## Contributing

If you would like to contribute code, just fork the repository and work on a new branch. You can submit a pull request to our repository and a member of Code for OKC will approve and merge it.

To work on a specific feature: 
* if it is a service - create a new file for your service in the services folder and include your service code in it. Also include some sort of test code, whether it is full blown unit tests or just example integration code (ie a simple page using the service). Also include some documentation with your service in the form of comments. Make a PR.
* if it affects the main app logic - update the app itself. Make a PR

## Copyright and license

Copyright 2014 Code for OKC. Licensed under the MIT License.

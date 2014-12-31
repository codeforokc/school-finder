/**
* © 2014 CodeForOKC. All rights reserved.
* Author: Karl Kirch <karlkrch@gmail.com>
*/

var proj4 = require('proj4');

// via http://spatialreference.org/ref/epsg/2267/
// and http://spatialreference.org/ref/epsg/2267/proj4js
var nad83OklahomaNorthProj = '+proj=lcc +lat_1=36.76666666666667 +lat_2=35.56666666666667 +lat_0=35 +lon_0=-98 +x_0=600000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs';

module.exports = exports = {
  reprojectGeometry: reprojectGeometry
};

function reprojectGeometry(geometry) {
  var type = geometry.type;
  var reprojectFn = (type == "Polygon")
                      ? reprojectPolygonFeature
                      : reprojectMultiPolygonFeature;
  geometry.coordinates = reprojectFn(geometry.coordinates);
  return geometry;
}

function reprojectMultiPolygonFeature(multipolygonArray) {
  return multipolygonArray.map(reprojectPolygonFeature);
}

function reprojectPolygonFeature(polygonCoordArray) {
  return polygonCoordArray.map(reprojectPoints);
}

function reprojectPoints(pointsArray) {
  return pointsArray.map(function(point) {
    return proj4(nad83OklahomaNorthProj, 'EPSG:4326', point);
  });
}

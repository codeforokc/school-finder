var SCHOOL_FINDER = (function(){

  function init() {
    console.debug("Started initting app");

    // create module
    var sfApp = angular.module('sfApp', ["leaflet-directive"]);

    // register services
    sfApp.service("currentLocationService", SCHOOL_FINDER_CLS.CurrentLocationService);

    sfApp.controller("sfController",
      ["$scope",
      "leafletData",
      "currentLocationService",
      function($scope, leafletData, currentLocationService){
        angular.extend($scope, {
          mapCenter: {
            lat: 35.4826479,
            lng: -97.4791974,
            zoom: 10
          },
          mapboxTiles: {
            name: 'Mapbox example',
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            type: 'xyz',
            options: {
              // TODO(joekarl): use real api key
              apikey: 'pk.eyJ1IjoibWJvY2t1cyIsImEiOiJGSVhxeUJzIn0.dFVS1mpYRCuR8fn_l0FWew',
              mapid: 'jvrousseau.l059j5gf'
            }
          },
          updatingCurrentLocation: false,
          markers: {
            centerMarker: undefined
          }
        });

        $scope.updateCurrentLocation = function() {
          if ($scope.updatingCurrentLocation) {
            return;
          }
          $scope.updatingCurrentLocation = true;
          $scope.markers.centerMarker = undefined;
          currentLocationService.getCurrentLocation(navigator.geolocation, {timeout: 5000}, function(err, coordinates){
            $scope.updatingCurrentLocation = false;
            if (err) {
              // TODO(joekarl): Make this not be terrible
              console.log(err);
              alert(JSON.stringify(err));
            } else {
              $scope.mapCenter.lat = coordinates.latitude;
              $scope.mapCenter.lng = coordinates.longitude;
              $scope.mapCenter.zoom = 12;
              $scope.markers.centerMarker = {
                lat: coordinates.latitude,
                lng: coordinates.longitude,
                focus: true,
                draggable: false
              };
            }
            $scope.$apply(); // trigger angular digest
          });
        }
      }
    ]);

    // TODO(joekarl): split this out somewhere
    sfApp.directive("asyncButtonDisable", function(){
      return {
        link: function(scope, el, attrs) {
          var button = el[0];
          button.innerHTML = attrs.defaultText;
          button.disabled = false;
          button.onclick = function(){
            scope.$apply(attrs.callFunction);
          };
          scope.$watch(attrs.watchValue, function(newValue, oldValue){
            if (newValue) {
              button.innerHTML = attrs.workingText;
              button.disabled = true;
            } else {
              button.innerHTML = attrs.defaultText;
              button.disabled = false;
            }
          });
        }
      };
    });

    console.debug("Finished initting app");
  }

  return {
    init: init
  };
}());

SCHOOL_FINDER.init();

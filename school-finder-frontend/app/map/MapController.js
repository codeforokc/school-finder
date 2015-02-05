(function () {
  var sfApp = angular.module('sfApp');

  var MapCtrl = function($scope, geolocationFactory){
    $scope.coords = null;
    angular.extend($scope, {
      defaults: {
        maxZoom: 18
      },
      center: {
        // initalize over OKC
        lat: 35.478,
        lng: -97.519,
        zoom: 12
      },
      tiles: {
        name: 'Mapbox Tiles',
        url: 'http://{s}.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
        type: 'xyz',
        options: {
          apikey: 'pk.eyJ1IjoibWxvZmZsYW5kIiwiYSI6Ik5leC11NlUifQ.h2UgWXhT5l7zjts894SySw',
          mapid: 'mloffland.l3746b9b'
        }
      }
    });

    $scope.setPosition = function () {

      var options = {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 0
      };

      geolocationFactory.getCurrentPosition(options)
        .then(
          // success
          function(position){
            var coords = position.coords;
            $scope.coords = coords;
            // we have the coords in a scope variable so we can do what we want with them...  Just centering and zooming in for now.
            angular.extend($scope, {
              center: {
                lat: coords.latitude,
                lng: coords.longitude,
                zoom: 17
              },
              markers: {
                youarehere: {
                  lat: coords.latitude,
                  lng: coords.longitude,
                  focus: true,
                  message: "You are here",
                  draggable: false
                }
              }
            });
        },
        // error
        function(data){
          $scope.error = "Error: " + data.error.message;
        }
      );
    };
  };

  MapCtrl.$inject = ['$scope','geolocationFactory'];
  sfApp.controller('MapController', MapCtrl);

}());

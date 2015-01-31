(function () {
  var sfApp = angular.module('sfApp', ["leaflet-directive"]);

  sfApp.controller('mapmain', ['$scope', function ($scope) {
    $scope.locationfound = false;

    angular.extend($scope, {
      defaults: {
        maxZoom: 18
      },
      center: {
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

    $scope.$on("leafletDirectiveMap.locationfound", function (event) {
      var eventScopeCenter = event.currentScope.center;
      $scope.locationfound = true;
      angular.extend($scope, {
        markers: {
          ml: {
            lat: eventScopeCenter.lat,
            lng: eventScopeCenter.lng,
            focus: true,
            message: "You are here (approximately)",
            draggable: false
          }
        }

      });
    });

    $scope.setPosition = function () {
      angular.extend($scope, {
        center: {
          zoom: 15,
          autoDiscover: true
        }
      });
    };

  }]);

}());

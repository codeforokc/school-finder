(function () {
  var sfApp = angular.module('sfApp');

  var MapCtrl = function ($scope, $http, geolocationFactory) {
    $scope.coords = null;
    $scope.schoolDataMaster = null;
    $scope.schoolTypeList = null;
    $scope.styleObject = {};
    $scope.mapCache = {};
    var baseColors = ['#ff4040', '#ffd700', '#00ffff', '#0000ee', '#ff1493', '#68228b', '#cd950c', '#8b7355', '#458b74', '#006400', '#b4eeb4', '#ffb5c5', '#7fffd4', '#525252', '#000'];

    function eachSchool(feature, layer) {
      layer.bindPopup(feature.properties.schoolName);
    }

    function style(feature) {
      return {
        fillColor: $scope.styleObject[feature.properties.schoolType].color,
        weight: 2,
        opacity: 1,
        color: '#323232',
        dashArray: '2',
        fillOpacity: 0.7
      };
    }

    function getColorvalues(obj) {
      var retArr = [];
      for (var key in obj) {
        retArr.push(obj[key].color);
      }
      return retArr;
    }


    function populateColors() {
      $scope.schoolTypeList.forEach(function (st) {
        $scope.styleObject[st] = {color: baseColors.shift()};
      });
    }

    $http.get("schools.geojson")
      .success(function (data) {
        $scope.schoolTypeList = data.schoolTypeList; // transfer schooltypes into a scope array
        populateColors(); // setup colors for each school type
        $scope.schoolDataMaster = data; // create a master data object on the scope

        angular.extend($scope, {
          geojson: {
            data: data,
            style: style,
            onEachFeature: eachSchool
          },
          legend: {
            position: 'topright',
            colors: getColorvalues($scope.styleObject),
            labels: Object.keys($scope.styleObject)
          }
        });

        setTimeout(function () { // give the legend time to populate
          // transfer legend HTML into #legendSmall div below map so we can display it when the map is rendered on mobile (default legend was taking up too much space)
          document.getElementById("legendSmall").innerHTML = document.querySelector(".legend").innerHTML;
        }, 1000);
      })
      .error(function (data, status) {
        $scope.error = "Error: Unable to retreive geojson file [" + status + "]";
      });


    angular.extend($scope, {
      defaults: {
        maxZoom: 18
      },
      center: {
        // initalize over OKC
        lat: 35.478,
        lng: -97.519,
        zoom: 13
      },
      tiles: {
        name: 'Mapbox Tiles',
        url: 'http://{s}.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
        type: 'xyz',
        options: {
          apikey: 'pk.eyJ1IjoibWxvZmZsYW5kIiwiYSI6Ik5leC11NlUifQ.h2UgWXhT5l7zjts894SySw',
          mapid: 'mloffland.l3746b9b'
        }
      },
      markers: {}
    });

    $scope.toggleSchoolTypes = function (schooltype) {
      var sdCopy = {};

      !schooltype ? schooltype = 'All' : schooltype;

      if($scope.mapCache[schooltype]){ //cached
        $scope.geojson = $scope.mapCache[schooltype];
      }else{ // not cached
        if (schooltype && schooltype !== 'All') {
          // get a specific school type
          sdCopy.features = $scope.schoolDataMaster.features.filter(function (feature) {
            return feature.properties.schoolType.toLowerCase() == schooltype.toLowerCase();
          });
        } else {
          // get all school types
          sdCopy.features = $scope.schoolDataMaster.features.slice(0);
        }

        angular.extend($scope, {
          geojson: {
            data: sdCopy,
            style: style,
            onEachFeature: eachSchool
          }
        });
        $scope.mapCache[schooltype] = $scope.geojson; // add to cache
      }

    };

    $scope.setPosition = function () {

      $scope.finding = "Finding position";
      $scope.markers.youarehere = undefined;

      var options = { timeout: 8000 };

      geolocationFactory.getCurrentPosition(options)
        .then(function (position) {
          // success
          var coords = position.coords;
          $scope.finding = undefined;
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
        function (data) {
          // error
          $scope.error = "Error: " + data.error.message;
        });
    };
  };

  MapCtrl.$inject = ['$scope', '$http', 'geolocationFactory'];
  sfApp.controller('MapController', MapCtrl);

}());

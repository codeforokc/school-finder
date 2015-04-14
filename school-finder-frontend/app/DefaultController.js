/**
* © 2015 CodeForOKC. All rights reserved.
* Author: Karl Kirch <karlkrch@gmail.com>
* Author: Mike Loffland <mloffland@outlook.com>
*
* Default page controller
*/

(function () {
  var sfApp = angular.module('sfApp');

  var DefaultCtrl = function ($scope, $http, staticDataFactory, geolocationFactory) {

    $scope.dataTypeList = staticDataFactory.dataTypeList;
    $scope.defaultDataType = 'schools';
    $scope.selectedDataTypes = [];
    $scope.selectedDataTypes.push($scope.defaultDataType);
    console.log('Selected DataTypes');
    console.log($scope.selectedDataTypes);
    $scope.validation;
    $scope.dataType = $scope.dataTypeList[0];
    $scope.searchQuery = "";

    $scope.myapitoken = 'pk.eyJ1IjoibWxvZmZsYW5kIiwiYSI6Ik5leC11NlUifQ.h2UgWXhT5l7zjts894SySw';

    $scope.mapboxoptions = {
      defaultPlaceHolderText: 'Search Address, City or Zip',
      excludeEntriesWithNoPlaceName: true,
      minLength: 3,
      includeThisKeyword: 'oklahoma'
    };

    // watch the addressSelection model
    $scope.$watchCollection('addressSelection',function(){
      // just spit it out to the console for now
      if(angular.isDefined($scope.addressSelection)){
        console.log('Selected address/city/zip info');
        console.log($scope.addressSelection);
      }
    });

    // watch the results model
    $scope.$watchCollection('results',function(){
      // just spit it out to the console for now
      if(angular.isDefined($scope.results)){
        console.log('Submitted query results');
        console.log($scope.results);
      }
    });

    $scope.onDataSelect = function(dataID){
      var iLoc = $scope.selectedDataTypes.indexOf(dataID);
      iLoc < 0 ?
        $scope.selectedDataTypes.push(dataID) :
        $scope.selectedDataTypes.splice(iLoc,1);

      // make sure there is always at least one data type selected
      if($scope.selectedDataTypes.length == 0){
        $scope.selectedDataTypes.push($scope.defaultDataType);
      }
      console.log('Selected DataTypes');
      console.log($scope.selectedDataTypes);
    };

    $scope.useCurrentPosition = function (event) {
      $scope.finding = "Finding position";
      event.preventDefault();
      var options = { timeout: 8000 };

      geolocationFactory.getCurrentPosition(options)
        .then(function (position) {
          // success
          $scope.finding = undefined;
          $scope.userCoordinates = {latitude: position.coords.latitude, longitude: position.coords.longitude};
          console.log('Use my current location info');
          console.log($scope.userCoordinates);
        },
        function (data) {
          // error
          $scope.error = "Error: " + data.error.message;
        });
    };

    $scope.addressSearch = function() {
      // TODO(karl): Is this better as an angular directive?
       if (!$scope.searchQuery) {
        $scope.validation = "Address required";
      } else {
        $scope.validation = undefined;
        // TODO(karl): Change route to map with data type and address
        window.alert("Searching " + JSON.stringify($scope.dataType) + " near " + $scope.searchQuery);
      }
    };

    $scope.locationSearch = function() {
      // TODO(karl): Change route to map with data type and current location option
      window.alert("Searching " + JSON.stringify($scope.dataType) + " near my current location");
    };

  };

  DefaultCtrl.$inject = ['$scope', '$http', 'staticDataFactory', 'geolocationFactory'];
  sfApp.controller('DefaultController', DefaultCtrl);
}());

/**
* © 2015 CodeForOKC. All rights reserved.
* Author: Karl Kirch <karlkrch@gmail.com>
*
* Default page controller
*/

(function () {
  var sfApp = angular.module('sfApp');

  var DefaultCtrl = function ($scope, $http, staticDataFactory) {

    $scope.dataTypeList = staticDataFactory.dataTypeList;

    $scope.validation;
    $scope.dataType = $scope.dataTypeList[0];
    $scope.searchQuery = "";

    $scope.addressSearch = function() {
      // TODO(karl): Is this better as an angular directive?
      if (!$scope.searchQuery) {
        $scope.validation = "Address required";
      } else {
        $scope.validation = undefined;
        // TODO(karl): Change route to map with data type and address
        window.alert("Searching " + JSON.stringify($scope.dataType) + " near " + $scope.searchQuery);
      }
    }

    $scope.locationSearch = function() {
      // TODO(karl): Change route to map with data type and current location option
      window.alert("Searching " + JSON.stringify($scope.dataType) + " near my current location");
    }
  };

  DefaultCtrl.$inject = ['$scope', '$http', 'staticDataFactory'];
  sfApp.controller('DefaultController', DefaultCtrl);
}());

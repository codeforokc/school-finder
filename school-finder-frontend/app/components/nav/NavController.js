(function () {
  var sfApp = angular.module('sfApp');

  var NavCtrl = function($scope, $location){
      $scope.isActive = function (viewLocation) {
          return viewLocation === $location.path().replace(/^(?:\/)+/, "");;
      };
  };

  NavCtrl.$inject = ['$scope', '$location'];
  sfApp.controller('NavController', NavCtrl);

}());

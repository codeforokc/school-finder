/**
* © 2015 CodeForOKC. All rights reserved.
* Author: Mike Loffland <mloffland@outlook.com>
*
* Factory to determine the user's current location
* Based off of https://github.com/ninjatronic/ngGeolocation
*/

(function () {
  var sfApp = angular.module('sfApp');

  var geolocationFactory = function ($window, $q) {
    //
    function supported() {
      return 'geolocation' in $window.navigator;
    }

    var retVal = {
      getCurrentPosition: function (options) {
        var deferred = $q.defer();
        if (supported()) {
          $window.navigator.geolocation.getCurrentPosition(
            function (position) {
              deferred.resolve(position);
            },
            function (error) {
              deferred.reject({error: error});
            }, options);
        } else {
          deferred.reject({
            error: {
              code: 2,
              message: 'This web browser does not support HTML5 Geolocation'
            }
          });
        }
        return deferred.promise;
      },
      position: {}
    };

    return retVal;
  };

  geolocationFactory.$inject = ['$window', '$q'];
  sfApp.factory('geolocationFactory', geolocationFactory);

}());

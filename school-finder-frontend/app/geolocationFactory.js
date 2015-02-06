(function () {
  var sfApp = angular.module('sfApp');

  var geolocationFactory = function ($rootScope, $window, $q) {
    // https://github.com/ninjatronic/ngGeolocation
    function supported() {
      return 'geolocation' in $window.navigator;
    }

    var retVal = {
      getCurrentPosition: function (options) {
        var deferred = $q.defer();
        if (supported()) {
          $window.navigator.geolocation.getCurrentPosition(
            function (position) {
              $rootScope.$apply(function () {
                retVal.position.coords = position.coords;
                retVal.position.timestamp = position.timestamp;
                deferred.resolve(position);
              });
            },
            function (error) {
              $rootScope.$apply(function () {
                deferred.reject({error: error});
              });
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

  geolocationFactory.$inject = ['$rootScope', '$window', '$q'];
  sfApp.factory('geolocationFactory', geolocationFactory);

}());
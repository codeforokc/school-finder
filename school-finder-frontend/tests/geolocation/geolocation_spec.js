

describe('School Finder: geolocationFactory', function () {

  var geolocationFactory,
    $rootScope,
    $window,
    $q,
    backupGeo,
    options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

  beforeEach(
    module('sfApp')
  );

  beforeEach(
    inject(function(_geolocationFactory_, _$rootScope_, _$window_, _$q_) {
    geolocationFactory = _geolocationFactory_;
    $rootScope = _$rootScope_;
    $window = _$window_;
    $q = _$q_;
  }));

  describe('Call to getCurrentPosition()', function () {
    it('should return a promise', function() {
      var ret = geolocationFactory.getCurrentPosition();
      return geolocationFactory.getCurrentPosition().should.be.fulfilled;
    });
  });

  describe('If the Geolocation API is not available', function () {
    beforeEach(function(){
      backupGeo = $window.navigator.geolocation;
      delete $window.navigator.geolocation;
    });

    it('it should return an error', function() {
      return geolocationFactory.getCurrentPosition().should.be.rejected;
    });

    afterEach(function(){
      $window.navigator.geolocation = backupGeo;
    });
  });

});
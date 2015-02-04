describe('School Finder: geolocationFactory', function () {

  var geolocationFactory,
    $rootScope,
    $window,
    $q,
    backupGeo,
    options;

  beforeEach(function(){
      module('sfApp');
      inject(function(_geolocationFactory_, _$rootScope_, _$window_, _$q_) {
        geolocationFactory = _geolocationFactory_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        $q = _$q_;
      });
      options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
    }
  );

  describe('Call to getCurrentPosition()', function () {
    it('should return a fulfilled promise', function() {
      return geolocationFactory.getCurrentPosition().should.be.fulfilled;
    });
    it('should eventually resolve to a position object with coords property', function() {
      return expect(geolocationFactory.getCurrentPosition()).to.eventually.have.property("coords")
    });
  });

  describe('Call to getCurrentPosition(options)', function () {
    it('should return a fulfilled promise', function() {
      return geolocationFactory.getCurrentPosition(options).should.be.fulfilled;
    });
    it('should eventually resolve to a position object with coords property', function() {
      return expect(geolocationFactory.getCurrentPosition(options)).to.eventually.have.property("coords")
    });
  });

  describe('If the Geolocation API is not available on said browser', function () {
    beforeEach(function(){
      backupGeo = $window.navigator.geolocation;
      delete $window.navigator.geolocation;
    });
    afterEach(function(){
      $window.navigator.geolocation = backupGeo;
    });
    it('it should return a rejected promise', function() {
      //var ret = geolocationFactory.getCurrentPosition();
      return geolocationFactory.getCurrentPosition().should.be.rejected;
    });
  });

  describe('If it takes too long for the Geolocation API to figure out the position', function () {
    beforeEach(function(){
      options.timeout = 5;
    });
    it('it should return a rejected promise', function() {
      return geolocationFactory.getCurrentPosition(options).should.be.rejected;
    });
  });

});
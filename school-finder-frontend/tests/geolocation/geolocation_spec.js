// mocha, chai, chai-as-promised, Angular mocks

// npm install
// cd to shool-finder-frontend
// npm test

// mocha timeout and slow variables are set fairly high in karma.conf.js... I have a slow ass Windows box :(
describe('School Finder: geolocationFactory', function () {

  var $rootScope,
    $window,
    geo,
    dosuccess = true,
    failRet = {code: 2, message: 'This web browser does not support HTML5 Geolocation'};

  // setup ngMock (provides support to inject and mock Angular services into unit tests)
  beforeEach(module("sfApp", function ($provide) {
    // mocking our own window object
    var mockedWindow = {
      navigator: {
        geolocation: {
          getCurrentPosition: function (success, fail) {
            // not mocking options since we're controlling the results
            if (dosuccess) {
              setTimeout(function () {
                success({position: {coords: {latitude: 35.478, longitude: -97.519}, timestamp: 819898200}});
              }, 0);
            } else {
              setTimeout(function () {
                fail(failRet);
              }, 0);
            }
          },
          schoolfindermock: true
        }
      }
    };
    $provide.value("$window", mockedWindow);
  }));

  // injecting the real geolocationFactory and the real rootScope... using our mocked
  // window object by utilizing $provide service in the previous beforeEach
  beforeEach(inject(function (geolocationFactory, _$rootScope_, _$window_) {
    geo = geolocationFactory;
    $window = _$window_;
    $rootScope = _$rootScope_;
  }));

  describe('Call to geolcoationFactory.getCurrentPosition()', function () {
    it('should resolve to a fullfilled promise that eventually resolves to a position object that has the coords property', function () {
      return expect(geo.getCurrentPosition()).to.eventually.have.property("position").that.has.property('coords');
    });
  });

  describe('If the Geolocation API is not available on said browser', function () {
    beforeEach(function () {
      delete $window.navigator.geolocation;
    });

    it('it should return a rejected promise that eventually returns error.code = 2 - POSITION_UNAVAILABLE (not available on the browser)', function () {
      // Manually forcing Angular to run a digest cycle because the factory returns a deferred.promise with a a rejected state when geolocation is not supported.
      // As opposed to the factory returns a deferred.promise with a a pending state when geolocation is supported.
      $rootScope.$apply(function () {
        return geo.getCurrentPosition().should.eventually.be.rejected
          .and.eventually.have.property("error")
          .that.has.property('code')
          .that.equals(2);
      });
    });
  });

  describe('If user denies permission for the Geolocation API to access location', function () {
    beforeEach(function () {
      dosuccess = false;
      failRet = {code: 1};
    });

    it('it should return a rejected promise that eventually returns error.code = 1 - PERMISSION_DENIED (user denied access)', function () {
      return geo.getCurrentPosition().should.eventually.be.rejected
        .and.eventually.have.property("error")
        .that.has.property('code')
        .that.equals(1);
    });
  });

  describe('If the Geolocation API is unable to acquire the position for some reason (other than PERMISSION_DENIED or TIMEOUT)', function () {
    beforeEach(function () {
      dosuccess = false;
      failRet = {code: 2};
    });

    it('it should return a rejected promise that eventually returns error.code = 2 - POSITION_UNAVAILABLE (user denied access)', function () {
      return geo.getCurrentPosition().should.eventually.be.rejected
        .and.eventually.have.property("error")
        .that.has.property('code')
        .that.equals(2);
    });
  });

  describe('If Geolocation API to access location', function () {
    beforeEach(function () {
      dosuccess = false;
      failRet = {code: 3};
    });

    it('it should return a rejected promise that eventually returns error.code = 3 - TIMEOUT (the option.timeout was set and eclipsed)', function () {
      return geo.getCurrentPosition().should.eventually.be.rejected
        .and.eventually.have.property("error")
        .that.has.property('code')
        .that.equals(3);
    });
  });

});
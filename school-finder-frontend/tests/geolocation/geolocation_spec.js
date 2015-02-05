// mocha, chai, chai-as-promised, Angular mocks
// launching browser so we have access to navigatior.geolocation
// Is it workth the trouble to mock ALL conditions so we could go headless for PhantomJS?

// npm install
// cd to shool-finder-frontend
// karma start

// mocha timeout and slow variables are set fairly high in karma.conf.js... I have a slow ass Windows box :(
describe('School Finder: geolocationFactory', function () {

  var geolocationFactory,
    $rootScope,
    $window,
    $q,
    backupGeo,
    options;

  // mock return errors for those instances where we need emulate certain conditions
  // ie: position unavailable, permission denited, position unavailable
  function getMocked(code, message) {
    backupGeo = window.navigator.geolocation;
    delete $window.navigator.geolocation;
    $window.navigator.geolocation = {
      getCurrentPosition: function (resolveCB, errorCB) {
        setTimeout(function () {
            errorCB({
              code: code,
              message: message
            })
          }, 300
        );
      }
    };
  }

  function unMock() {
    $window.navigator.geolocation = backupGeo;
  }

  // work with Angular mocks so we can unit test
  beforeEach(function () {
      module('sfApp');
      inject(function (_geolocationFactory_, _$rootScope_, _$window_, _$q_) {
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
    it('should return a fulfilled promise', function () {
      return geolocationFactory.getCurrentPosition().should.be.fulfilled;
    });
    it('should eventually resolve to a position object with coords property', function () {
      return expect(geolocationFactory.getCurrentPosition()).to.eventually.have.property("coords");
    });
  });

  describe('Call to getCurrentPosition(options)', function () {
    it('should return a fulfilled promise', function () {
      return geolocationFactory.getCurrentPosition(options).should.be.fulfilled;
    });
    it('should eventually resolve to a position object with coords property', function () {
      return expect(geolocationFactory.getCurrentPosition(options)).to.eventually.have.property("coords");
    });
  });

  describe('If the Geolocation API is not available on said browser', function () {
    beforeEach(function () {
      backupGeo = $window.navigator.geolocation;
      delete $window.navigator.geolocation;
    });
    afterEach(function () {
      $window.navigator.geolocation = backupGeo;
    });
    it('it should return a rejected promise that eventually returns error.code = 2 (POSITION_UNAVAILABLE)', function () {
      $rootScope.$apply(function () {
        return geolocationFactory.getCurrentPosition().should.eventually.be.rejected
          .and.eventually.have.property("error")
          .that.has.property('code')
          .that.equals(2);
      });
    });
  });

  describe('If it takes too long for the Geolocation API to figure out the position', function () {
    beforeEach(function () {
      options.timeout = 5;
    });
    it('it should return a rejected promise that eventually returns error.code = 3 (TIMEOUT)', function () {
      return geolocationFactory.getCurrentPosition(options).should.eventually.be.rejected
        .and.eventually.have.property("error")
        .that.has.property('code')
        .that.equals(3);
    });
  });

  describe('If the Geolocation API is unable to determine location', function () {
    beforeEach(function () {
      getMocked(2, 'Mocked: unable to determine location');
    });
    afterEach(function () {
      unMock();
    });
    it('it should return a rejected promise that eventually returns error.code = 2 (POSITION_UNAVAILABLE)', function () {
      return geolocationFactory.getCurrentPosition().should.eventually.be.rejected
        .and.eventually.have.property("error")
        .that.has.property('code')
        .that.equals(2);
    });
  });

  describe('If user denies permission for the Geolocation API to access location', function () {
    beforeEach(function () {
      getMocked(1, 'Mocked: permission denied');
    });
    afterEach(function () {
      unMock();
    });
    it('it should return a rejected promise that eventually returns error.code = 1 (PERMISSION_DENIED)', function () {
      return geolocationFactory.getCurrentPosition().should.eventually.be.rejected
        .and.eventually.have.property("error")
        .that.has.property('code')
        .that.equals(1);
    });
  });
});
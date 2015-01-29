var CLS = require('../../app/services/currentLocationService');

var mocha = require('mocha');
var expect = require('chai').expect;

describe("current location service", function(){
  describe("getCurrentLocation", function(){
    it("should return error if no geolocation available", function(done){
      new CLS.CurrentLocationService().getCurrentLocation(undefined, {}, function(err){
        expect(err).to.exist;
        done();
      });
    });
  });
});

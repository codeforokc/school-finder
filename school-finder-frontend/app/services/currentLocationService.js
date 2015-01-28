(function(exports){

  /*
   * This is an angular service definition
   */
  function CLS() {/*noop*/}

  function onError(callback, err) {
    return callback(err);
  }

  function onSuccess(callback, position) {
    var coordinates = position.coords;
    return callback(null, coordinates);
  }

  /*
   * Get the current location from the user
   *
   * @param geolocation : navigator.geolocation
   * @param options : https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
   * @param callback(err, coordinates) : https://developer.mozilla.org/en-US/docs/Web/API/Coordinates
   *
   */
   CLS.prototype.getCurrentLocation = function(geolocation, options, callback) {
     if (!geolocation) {
       return callback(new Error("Geolocation not available"));
     }
     geolocation.getCurrentPosition(onSuccess.bind(null, callback),
                                   onError.bind(null, callback),
                                   options);
  }

  exports.CurrentLocationService = CLS;
}(typeof exports === 'undefined' ? this['SCHOOL_FINDER_CLS']={}: exports));

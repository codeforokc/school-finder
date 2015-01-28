(function(exports){

  /*
   * This is an angular service definition
   */
  function CLS() {/*noop*/}

  function onError(callback, err) {
    return setTimeout(callback.bind(null, err), 0);
  }

  function onSuccess(callback, position) {
    var coordinates = position.coords;
    return setTimeout(callback.bind(null, null, coordinates), 1000);
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
       return setTimeout(callback.bind(null, new Error("Geolocation not available")), 0);
     }
     geolocation.getCurrentPosition(onSuccess.bind(null, callback),
                                   onError.bind(null, callback),
                                   options);
  }

  exports.CurrentLocationService = CLS;
}(typeof exports === 'undefined' ? this['SCHOOL_FINDER_CLS']={}: exports));

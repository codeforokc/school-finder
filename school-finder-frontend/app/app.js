var SCHOOL_FINDER = (function(){

  function init() {
    console.debug("Started initting app");

    // create module
    var sfApp = angular.module('sfApp', []);

    // register services
    sfApp.service("currentLocationService", SCHOOL_FINDER_CLS);


    console.debug("Finished initting app");
  }

  return {
    init: init
  };
}());

SCHOOL_FINDER.init();

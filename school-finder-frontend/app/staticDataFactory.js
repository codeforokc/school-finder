/**
* © 2015 CodeForOKC. All rights reserved.
* Author: Karl Kirch <karlkrch@gmail.com>
*
* Static data used across the app for various uses
*/

(function () {
  var sfApp = angular.module('sfApp');

  var staticDataFactory = function () {

    var dataTypeList = [
      {
        display: "Schools",
        id: "schools"
      },
      {
        display: "School Districts",
        id: "schoolDistricts"
      },
      {
        display: "Police Stations",
        id: "police"
      },
      {
        display: "Fire Stations",
        id: "fire"
      }
    ];

    return {
      dataTypeList: dataTypeList
    };
  };

  staticDataFactory.$inject = [];
  sfApp.factory('staticDataFactory', staticDataFactory);

}());

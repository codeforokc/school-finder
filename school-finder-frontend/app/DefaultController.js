/**
* © 2015 CodeForOKC. All rights reserved.
* Author: Karl Kirch <karlkrch@gmail.com>
* Author: Mike Loffland <mloffland@outlook.com>
*
* Default page controller
*/

(function () {
  var sfApp = angular.module('sfApp');

  var DefaultCtrl = function ($scope, $http, staticDataFactory, geolocationFactory) {

    $scope.dataTypeList = staticDataFactory.dataTypeList;
    $scope.defaultDataType = 'schools';
    $scope.selectedDataTypes = [];
    $scope.selectedDataTypes.push($scope.defaultDataType);
    $scope.dataType = $scope.dataTypeList[0];
    $scope.addressSelection = [];
    $scope.results = [];
    $scope.userCoordinates = {};
    $scope.usingCurrentPosition = false;

    // settings
    angular.extend($scope, {
      // enable auto suggest
      autoSuggest: true,
      // min length error text
      minLengthErrorText: 'Search text must be at least %N% character(s).',
      // specify their own placeholder text
      placeHolderText: 'Search Address, City or Zip',
      // allow directive user to determine what property they want to be used in the auto suggest results
      displayProperty: 'place_name',
      // exclude results where place_name is empty or absent in the mapbox results
      excludeEntriesWithNoPlaceName: true,
      // minimum length before suggestive search kicks in
      minLength: 3,
      // attempt to limit the Mapbox query results based on a keyword
      includeThisKeyword: 'oklahoma',
      // string to use if displayProperty is empty
      emptyPropertyText: '(empty property)',
      // apitoken
      apiToken: 'pk.eyJ1IjoibWxvZmZsYW5kIiwiYSI6Ik5leC11NlUifQ.h2UgWXhT5l7zjts894SySw'
  });

    $scope.minLengthErrorText = $scope.minLengthErrorText.replace('%N%',$scope.minLength);

    // watch the addressSelection model
    $scope.$watchCollection('addressSelection',function(){
      // just spit it out to the console for now
      if($scope.addressSelection.hasOwnProperty('id')){
        console.log('Selected address/city/zip info');
        console.log($scope.addressSelection);
      }
    });

    // watch the results model
    $scope.$watchCollection('results',function(){
      // just spit it out to the console for now
      if($scope.results.length > 0){
        console.log('Submitted query results');
        console.log($scope.results);
      }
    });

    $scope.onDataSelect = function(dataID){
      var iLoc = $scope.selectedDataTypes.indexOf(dataID);
      iLoc < 0 ?
        $scope.selectedDataTypes.push(dataID) :
        $scope.selectedDataTypes.splice(iLoc,1);

      // make sure there is always at least one data type selected
      if($scope.selectedDataTypes.length == 0){
        $scope.selectedDataTypes.push($scope.defaultDataType);
      }
      console.log('Selected DataTypes');
      console.log($scope.selectedDataTypes);
    };
    $scope.isSelected = function(id) {
      if($scope.selectedDataTypes.indexOf(id) > -1) {
        return true;
      }
      return false;
    };

    $scope.useCurrentPosition = function (event) {
      if($scope.userCoordinates.hasOwnProperty("latitude")){ // reset userCoordinates
        resetUserCoordinates();
        setUsingPos(false);
        setSelectedLoc($scope.placeHolderText);
      }else{ // try to get user's position
        setFinding("Finding position");
        event.preventDefault();
        var options = { timeout: 8000 };

        geolocationFactory.getCurrentPosition(options)
          .then(function (position) {
            // success
            setFinding(undefined);
            $scope.userCoordinates = {latitude: position.coords.latitude, longitude: position.coords.longitude};
            setSelectedLoc('<Using user location>');
            setUsingPos(true);
            console.log('Use my current location info');
            console.log($scope.userCoordinates);
          },
          function (data) {
            $scope.error = "Error: " + data.error.message;
          });
      }
    };

    $scope.search = function (src) {
      var myurl;

      if (angular.isUndefined($scope.searchText) || $scope.searchText.length < $scope.minLength) {
        setMinFlag(true);
        resetSuggestions();
        return;
      }

      myurl = setUrl($scope.searchText);

      $http.get(myurl)
        .success(function (data) {
          resetUserCoordinates();
          $scope.suggestions = data.features.map(function (val) {
            if ($scope.excludeEntriesWithNoPlaceName) {
              if (val.place_name) {
                return val;
              }
            } else {
              return val;
            }
          });
          if(src != undefined){
            $scope.results = $scope.suggestions.slice(0);
            setUsingPos(false);
            setSelectedLoc($scope.searchText);
            setMinFlag(false);
            resetSearchText();
            resetSuggestions();
          }

        })
        .error(function (data, status) {
          var errorObj = {}, msg;
          // empty the suggestion array
          while ($scope.suggestions.length > 0) {
            $scope.suggestions.pop();
          }
          msg = "Error getting Mapbox data:  [" + status + " | api token used: " + $scope.apiToken + "]";
          errorObj[$scope.displayProperty] = msg;
          $scope.suggestions.push(errorObj);
          console.log(msg);
        });
    };

    $scope.useSelectedLocation = function  (index) {
      $scope.addressSelection = $scope.suggestions[index];
      resetUserCoordinates();
      setSelectedLoc($scope.addressSelection.place_name);
      setMinFlag(false);
      setUsingPos(false);
      resetSearchText();
      resetSuggestions();
    };

    function setUrl(searchText){
      var localSearchText;
      localSearchText = encodeURI(searchText);
      // attempting to increase the relevance of Mapbox query results based on a keyword
      // - i.e: includeThisKeyword = 'texas'
      //    > should produce results more specific to Texas
      if ($scope.includeThisKeyword) {
        if (localSearchText.toLowerCase().indexOf($scope.includeThisKeyword.toLowerCase()) < 0) {
          localSearchText += '%20' + $scope.includeThisKeyword;
        }
      }
      return 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + localSearchText + '.json?access_token=' + $scope.apiToken;
    }

    function setSelectedLoc(text){
      $scope.selectedLoc = text;
    }

    function setMinFlag(flag){
      $scope.flagminerror = flag;
    }

    function setUsingPos(flag){
      $scope.usingCurrentPosition = flag;
    }

    function resetSuggestions(){
      $scope.suggestions = []
    }
    function setFinding(val){
      $scope.finding = val;
    }

    function resetSearchText(){
      $scope.searchText = '';
    }

    function resetUserCoordinates(){
      $scope.userCoordinates = {};
    }
  };

  DefaultCtrl.$inject = ['$scope', '$http', 'staticDataFactory', 'geolocationFactory'];
  sfApp.controller('DefaultController', DefaultCtrl);

}());

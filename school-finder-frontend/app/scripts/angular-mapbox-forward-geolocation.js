/**
 * Mapbox forward geocoding autocomplete directive
 * https://github.com/Mike-Loffland/angular-mapbox-forward-geolocation-directive
 */

(function () {
  'use strict';

  angular.module('mapbox-forward-geo', []).directive('mapboxForwardGeocoding', function ($http) {
    return {
      restrict: 'AE',
      scope: {
        selectedLocation: '=',
        queryResults: '=',
        options: '=',
        apiToken: '='
      },
      template: [
        '<form class="mapbbox-fgd" name="mapboxFGD"><input class="form-control" name="searchText" type="text" ng-focus="flagminerror=false" placeholder="{{selectedLoc || placeHolderText}}" id="mbac-searchInput" ng-minlength="minLength" ng-model="searchText" ng-keyup="!autoSuggest || search()"/>',
        '<input class="btn btn-default" type="button" value="search" id="mbfgd-searchbtn" ng-click="search(\'button\')" >',
        '<ul id="mbfgd-suggestions">',
        '<li ng-repeat="suggestion in suggestions" ng-if="autoSuggest" ng-click="!selectedLocationAvailable || useSelectedLocation($index)">{{suggestion[displayProperty] ? suggestion[displayProperty] : emptyPropertyText}}</li>',
        '</ul><div ng-show="mapboxFGD.searchText.$error.minlength || flagminerror">{{minLengthErrorText}}</div></form>'
      ].join(''),
      link: function (scope,element,attrs) {

        scope.suggestions = [];
        scope.flagminerror = false;
        scope.searchText = '';
        scope.selectedLocationAvailable = angular.isDefined(attrs.selectedLocation);
        scope.wantResults = angular.isDefined(attrs.queryResults);
        // set defaults
        scope.apiToken = scope.apiToken ? scope.apiToken : 'YOU NEED TO SET YOUR API TOKEN';

        angular.extend(scope, {
          // allow directive user to specify their own placeholder text
          placeHolderText: 'Search for an address',
          // allow directive user to specify their own placeholder text
          minLengthErrorText: 'Search text must be at least %N% character(s).',
          // allow directive user to determine what property they want to be used in the auto suggest results
          displayProperty: 'place_name',
          // allow directive user to exclude results where place_name is empty or absent in the mapbox results
          excludeEntriesWithNoPlaceName: false,
          // allow directive user to enable auto suggest
          autoSuggest: true,
          // allow directive user to specify their own string to use if displayProperty is empty
          emptyPropertyText: '(empty property)',
          // allow directive user to specify their own min length for determining when a search string is long enough to execute a query
          minLength: 4,
          // attempt to limit the Mapbox query results based on a keyword
          includeThisKeyword: undefined
        });

        // use custom directive options if present
        if (!angular.isUndefined(scope.options)) {
          angular.extend(scope, scope.options);

        }

        scope.minLengthErrorText = scope.minLengthErrorText.replace('%N%',scope.minLength);

        scope.search = function (src) {

          if( angular.isUndefined(scope.searchText) || (src == 'button' && !scope.wantResults)){
            // scope.searchText will continue to be undefined until the ng-minlength requirements are met
            // ||
            // this is a button click... but, the directive user did not provide a scope variable for queryResults
            return;
          }
          var localSearchText,
            myurl;


          if (scope.searchText.length < scope.minLength) {
            scope.flagminerror = true;
            scope.suggestions = [];
            return;
          }

          localSearchText = encodeURI(scope.searchText);

          // attempting to increase the relevance of Mapbox query results based on a keyword
          // - i.e: includeThisKeyword = 'texas'
          //    > should produce results more specific to Texas
          if (scope.includeThisKeyword) {
            if (localSearchText.toLowerCase().indexOf(scope.includeThisKeyword.toLowerCase()) < 0) {
              localSearchText += '+' + scope.includeThisKeyword;
            }
          }

          myurl = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + localSearchText + '.json?access_token=' + scope.apiToken;

          $http.get(myurl)
            .success(function (data) {
              scope.suggestions = data.features.map(function (val) {
                // if the directive user wants to exclude results where place_name is empty or absent
                if (scope.excludeEntriesWithNoPlaceName) {
                  if (val.place_name) {
                    return val;
                  }
                } else {
                  return val;
                }
              });
              // if the directive user wants the results returned to their own scope array
              if((src == 'button' && scope.wantResults)){
                scope.queryResults = scope.suggestions.slice(0);
                scope.selectedLoc = scope.searchText;
                scope.searchText = '';
                scope.suggestions = [];
              }

            })
            .error(function (data, status) {
              var errorObj = {}, msg;
              // empty the suggestion array
              while (scope.suggestions.length > 0) {
                scope.suggestions.pop();
              }
              msg = "Error getting Mapbox data:  [" + status + " | api token used: " + scope.apiToken + "]";
              errorObj[scope.displayProperty] = msg;
              scope.suggestions.push(errorObj);
              console.log(msg);
            });
        };

        scope.useSelectedLocation = function (index) {
          scope.selectedLocation = scope.suggestions[index];
          scope.selectedLoc = scope.selectedLocation.place_name;
          scope.searchText = '';
          scope.suggestions = [];
        };
      }
    }
  });

}());


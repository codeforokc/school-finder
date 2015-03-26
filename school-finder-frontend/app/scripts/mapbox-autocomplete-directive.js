/**
 * © 2015 CodeForOKC. All rights reserved.
 * Author: Mike Loffland <mloffland@outlook.com>
 *
 * Mapbox forward geocoding autocomplete directive
 * https://www.mapbox.com/developers/api/geocoding/#forward
 */

(function () {
  "use strict"
  angular.module("mapbox-autosuggest-directive", []).directive('mapboxAutoSuggest', function ($http) {
    return {
      restrict: 'AE',
      scope: {
        selectedLocation: '=model',
        options: '=options'
      },
      // TODO(Mike): clean this template up
      template: '<div class="mapbbox-ac"><input type="text" class="form-control" placeholder="{{selectedLoc || defaultPlaceHolderText}}" id="mbac-searchInput" ng-model="searchText" ng-change="search()"/>'
      + '<ul id="mbac-suggestions">'
      + '<li ng-repeat="suggestion in suggestions" ng-click="useSelectedLocation($index)">{{suggestion[displayProperty] ? suggestion[displayProperty] : defaultEmptyPropertyText}}</li>'
      + '</ul></div>',
      link: function (scope) {
        scope.suggestions = [];

        // set defaults
        angular.extend(scope, {
          // allow directive user to specify their own placeholder text
          defaultPlaceHolderText: 'Search for an address',
          // allow directive user to determine what property they want to be used in the auto suggest results
          displayProperty: 'place_name',
          // allow directive user to exclude results where place_name is empty or absent in the mapbox results
          excludeEntriesWithNoPlaceName: false,
          // allow directive user to specify their own string to use if displayProperty is empty
          defaultEmptyPropertyText: '(empty property)',
          // allow directive user to specify their own threshold for determining when a search string is long enough to execute a query
          characterThreshold: 4
          // attempt to limit the Mapbox query results based on a keyword
          //includeThisKeyword: (no default needed)
        });

        // use custom directive options if present
        if(!angular.isUndefined(scope.options)){
          angular.extend(scope,scope.options);
         }

        scope.search = function () {
          var searchText,
            myurl;
          // TODO(Mike): validation for character threshold if this search was actually submitted via the press of a button .. return error message
          if (scope.searchText.length < scope.characterThreshold) {
            scope.suggestions = [];
            return;
          }

          searchText = encodeURI(scope.searchText);

          // attempting to increase the relevance of Mapbox query results based on a keyword
          // - i.e: includeThisKeyword = 'oklahoma'
          //    > should produce more relevant results when the user is typing: Norman or Edmond (as opposed to the keyword being absent)
          if (scope.includeThisKeyword) {
            if (searchText.toLowerCase().indexOf(scope.includeThisKeyword.toLowerCase()) < 0) {
              searchText += '+' + scope.includeThisKeyword;
            }
          }

          myurl = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + searchText + '.json?access_token=' + scope.apitoken;

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
            })
            .error(function (data, status) {
              // TODO(Mike): Handle this more eloquently?
              var errorObj = {};
              // empty the suggestion array
              while (scope.suggestions.length > 0) {
                scope.suggestions.pop();
              }
              errorObj[scope.displayProperty] = "Error getting Mapbox data:  [" + status + "]";
              scope.suggestions.push(errorObj);
              console.log("Error getting Mapbox data:  [" + status + "]");
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


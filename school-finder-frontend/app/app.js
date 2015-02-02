(function () {
  var sfApp = angular.module('sfApp', ['leaflet-directive', 'ui.router']);

  sfApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('root', {
        url: '/',
        views: {
          'nav': {
            templateUrl: 'nav.html'
          },
          'content': {
            templateUrl: 'default.html'
          },
          'footer': {
            templateUrl: 'footer.html'
          }
        }
      })

      .state('root.map', {
        url: 'map',
        views: {
          'content@': {
            templateUrl: 'map/map.html',
            controller: 'MapController'
          }
        }
      })

      .state('root.terms', {
        url: 'terms',
        views: {
          'content@': {
            templateUrl: 'terms/terms.html',
            controller: 'TermsController'
          }
        }
      })

      .state('root.about', {
        url: 'about',
        views: {
          'content@': {
            templateUrl: 'about/about.html',
            controller: 'AboutController'
          }
        }
      })

  });

}());

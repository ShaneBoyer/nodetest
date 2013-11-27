'use strict';

// Declare app level module which depends on filters, and services
angular.module('ekey', ['ngRoute', 'ekey.filters', 'ekey.services', 'ekey.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/app', {
        templateUrl: 'partials/index',
        controller: HomeCtrl
      }).
      when('/app/users', {
        templateUrl: 'partials/users',
        controller: UsersCtrl
      }).
      when('/app/addUser', {
        templateUrl: 'partials/addUser',
        controller: AddUserCtrl
      }).
      when('/app/editUser/:id', {
        templateUrl: 'partials/editUser',
        controller: EditUserCtrl
      }).
      when('/app/deleteUser/:id', {
        templateUrl: 'partials/deleteUser',
        controller: DeleteUserCtrl
      }).
      otherwise({
        redirectTo: '/app'
      });
    $locationProvider.html5Mode(true);
  }]);
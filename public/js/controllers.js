'use strict';

function HomeCtrl($scope, $http) {
}

function UsersCtrl($scope, $http) {
  $http.get('/api/v1/users').
    success(function(data, status, headers, config) {
      $scope.users = data;
    });
}

function AddUserCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitUser = function () {
    $http.post('/api/v1/users', $scope.form).
      success(function(data) {
        $location.path('/app/users');
      });
  };
}

function EditUserCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/v1/users/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editUser = function () {
    $http.put('/api/v1/users/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/app/users/' + $routeParams.id);
      });
  };
}

function DeleteUserCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/v1/users/' + $routeParams.id).
    success(function(data) {
      $scope.user = data;
    });

  $scope.deleteUser = function () {
    $http.delete('/api/v1/users/' + $routeParams.id).
      success(function(data) {
        $location.url('/app/users');
      });
  };

  $scope.home = function () {
    $location.url('/app');
  };
}
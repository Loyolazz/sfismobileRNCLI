var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    $scope.empresa = {};

    $scope.empresa = angular.fromJson(sessionStorage.getItem("arEmpresa"));


})




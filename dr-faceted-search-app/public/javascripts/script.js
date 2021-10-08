var kwgApp = angular.module('kwgApp', ['ngRoute']);
// configure the routes
kwgApp.config(function($routeProvider){
    $routeProvider
    .when('/', {
        // templateUrl: 'pages/full_record.html',
        templateUrl: 'pages/full_record_place.html',
        controller: 'mainController'
    });
});

kwgApp.controller('mainController', function($scope){
    $scope.message = "Here is the full page";
});

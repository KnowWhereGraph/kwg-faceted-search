var kwgApp = angular.module('kwgApp', ['ngRoute']);
// configure the routes
kwgApp.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: '/pages/full_record.html',
        controller: 'mainController'
    }).when('/full_record_place', {
        templateUrl: '/pages/full_record_place.html',
        controller: 'mainController'
    }).
    when('/results_filters', {
        templateUrl: '/pages/results_filters.html',
        controller: 'mainController'
    }).when('/explore', {
        templateUrl: '/pages/explore.html',
        controller: 'mainController'
    });
});

kwgApp.controller('mainController', function($scope){
    $scope.message = "Here is the full page";
});

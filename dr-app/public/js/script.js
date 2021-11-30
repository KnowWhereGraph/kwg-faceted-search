// var kwgApp = angular.module('kwgApp', ['ngSanitize', 'ngRoute']);
// configure the routes
// kwgApp.config(function($routeProvider) {
//     $routeProvider
//         .when('/', {
//             templateUrl: '../pages/explore.html',
//             controller: 'mainController'
//         }).when('/full_record', {
//             templateUrl: '../pages/full_record.html',
//             controller: 'mainController'
//         }).when('/full_record_place', {
//             templateUrl: '../pages/full_record_place.html',
//             controller: 'mainController'
//         }).when('/spatial_search', {
//             templateUrl: '../pages/spatial_search.html',
//             controller: 'mainController'
//         });
// });
var kwgApp = angular.module('kwgApp', ['ui.router', 'ncy-angular-breadcrumb', 'ngRoute']);

kwgApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$breadcrumbProvider',
    function($stateProvider, $urlRouterProvider, $breadcrumbProvider) {
        $stateProvider.state('home', {
            url: '/',
            templateUrl: '../pages/explore.html',
            ncyBreadcrumb: {
                label: 'Explore'
            }
        }).state('spatial search', {
            url: '/spatial_search',
            templateUrl: "../pages/spatial_search.html",
            ncyBreadcrumb: {
                label: 'Topic Group'
            }

        }).state('explore', {
            url: '/explore',
            templateUrl: "../pages/explore.html",
            ncyBreadcrumb: {
                label: 'Explore'
            }

        });

        $urlRouterProvider.otherwise("/");
        $breadcrumbProvider.setOptions({
            prefixStateName: 'home',
            template: "bootstrap3"
        })
    }
])


// mainController

kwgApp.controller("mainController", function($scope) {

});
kwgApp.controller("spatialSearchController", function($scope, $timeout) {
    $scope.message = "This is message";
    $scope.fullTextSearchRlts = null;
    var data = null;
    $scope.$on("clickedSearch", function(event, data) {
        console.log("spatialSearchController received data:", data);
        $scope.fullTextSearchRlts = data;
        // $scope.fullTextSearchRlts = getFullTextSearchResult(data.keyword, data.expertiseSubtopics, data.subplaces, data.hazards, data.startYear, data.endYear);
    });


    // $scope.$broadcast("fullTextSearchRlts", data);
    // console.log("main Controller data: ", data);

});
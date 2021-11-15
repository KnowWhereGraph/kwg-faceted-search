var kwgApp = angular.module('kwgApp', ['ngSanitize', 'ngRoute']);
// configure the routes
kwgApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/pages/full_record.html',
            controller: 'mainController'
        }).when('/results_filters', {
			templateUrl: '/pages/spatial_search.html',
            controller: 'mainController'
		}).when('/full_record_place', {
            templateUrl: '/pages/full_record_place.html',
            controller: 'mainController'
        }).when('/explore', {
            templateUrl: '/pages/explore.html',
            controller: 'mainController'
        });
});

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
kwgApp.controller("randomCardController", function($scope) {
    getRandomPlace().then(function(data) {
        angular.element("#random-place-instance").html(Object.keys(data['randomPlace'])[0]);
        angular.element("#random-place-card").attr('href',Object.values(data['randomPlace'])[0]);
    });
    getRandomHazard().then(function(data) {
        angular.element("#random-hazard-instance").html(Object.keys(data['randomHazard'])[0]);
        angular.element("#random-hazard-card").attr('href',Object.values(data['randomHazard'])[0]);
    });
    getRandomExpert().then(function(data) {
        angular.element("#random-expert-instance").html(Object.keys(data['randomExpert'])[0]);
        angular.element("#random-expert-card").attr('href',Object.values(data['randomExpert'])[0]);
    });
    getRandomWildfire().then(function(data) {
        angular.element("#random-wildfire-instance").html(Object.keys(data['randomWildfire'])[0]);
        angular.element("#random-wildfire-card").attr('href',Object.values(data['randomWildfire'])[0]);
    });
    getRandomEarthquake().then(function(data) {
        angular.element("#random-earthquake-instance").html(Object.keys(data['randomEarthquake'])[0]);
        angular.element("#random-earthquake-card").attr('href',Object.values(data['randomEarthquake'])[0]);
    });
    getRandomExpertInjuryStorm().then(function(data) {
        angular.element("#random-expert-injury-storm-instance").html(Object.keys(data['randomExpert'])[0]);
        angular.element("#random-expert-injury-card").attr('href',Object.values(data['randomExpert'])[0]);
    });
});

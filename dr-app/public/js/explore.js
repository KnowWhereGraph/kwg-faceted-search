kwgApp.controller("randomCardController", function($scope) {
    var maxLength_label = 30;
    getRandomPlace().then(function(data) {
        angular.element("#random-place-instance").html(fixLabelLength(Object.keys(data['randomPlace'])[0]));
        angular.element("#random-place-card").attr('href',Object.values(data['randomPlace'])[0]);
    });
    getRandomHazard().then(function(data) {
        angular.element("#random-hazard-instance").html(fixLabelLength(Object.keys(data['randomHazard'])[0]));
        angular.element("#random-hazard-card").attr('href',Object.values(data['randomHazard'])[0]);
    });
    getRandomExpert().then(function(data) {
        angular.element("#random-expert-instance").html(fixLabelLength(Object.keys(data['randomExpert'])[0]));
        angular.element("#random-expert-card").attr('href',Object.values(data['randomExpert'])[0]);
    });
    getRandomWildfire().then(function(data) {
        angular.element("#random-wildfire-instance").html(fixLabelLength(Object.keys(data['randomWildfire'])[0].replace('Wildfire Occurred in ','')));
        angular.element("#random-wildfire-card").attr('href',Object.values(data['randomWildfire'])[0]);
    });
    getRandomEarthquake().then(function(data) {
        angular.element("#random-earthquake-instance").html(fixLabelLength(Object.keys(data['randomEarthquake'])[0].replace('Earthquake with ID ','')));
        angular.element("#random-earthquake-card").attr('href',Object.values(data['randomEarthquake'])[0]);
    });
    getRandomExpertInjuryStorm().then(function(data) {
        angular.element("#random-expert-injury-storm-instance").html(fixLabelLength(Object.keys(data['randomExpert'])[0]));
        angular.element("#random-expert-injury-card").attr('href',Object.values(data['randomExpert'])[0]);
    });
});

var fixLabelLength = function(label, maxLength_label = 20) {
    let adjustedLabel = "";
    if (label.length < maxLength_label)
    {
        adjustedLabel = label.padEnd(maxLength_label-1,' ');
    }
    else
    {
        adjustedLabel = label.slice(0,maxLength_label-5);
        adjustedLabel += " ";
        adjustedLabel = adjustedLabel.padEnd(maxLength_label-1,'.');
    }
    adjustedLabel += "\n";
    return adjustedLabel;
}


var parameters = {};

var expertTitles = ["Name", "Affiliation", "Expertise", "Place"];
var placeTitles = ["Name", "Type"];
var hazardTitles = ["Name", "Type", "Place", "Start Date","End Date"];

var activeTabName = "";
var loadedTabs = {};

var place_markers = new L.MarkerClusterGroup();
var markers = [];

var resultsSearchMap = null;

//For URL variable tracking
var urlVariables;

kwgApp.controller("spatialSearchController", function($scope, $timeout, $location) {
    //prep for URL variable tracking
    urlVariables = $location.search();
    $scope.updateURLParameters = function(param, value, arr = false) {
            if (arr && urlVariables[param] != null && urlVariables[param] != '') {
                paramVals = urlVariables[param].split(',');
                if (!paramVals.includes(value))
                    paramVals.push(value);
                urlVariables[param] = paramVals.join(',');
            } else
                urlVariables[param] = value;

            $timeout(function() {
                $location.search(urlVariables);
                displayBreadCrumbs();
            }.bind(this));
        }
        //remove url parameter
    $scope.removeValue = function(param) {
            var newUrlVariables = {};
            for (var index in urlVariables) {
                if (index != param)
                    newUrlVariables[index] = urlVariables[index];
            }
            urlVariables = newUrlVariables;

            $timeout(function() {
                $location.search(urlVariables);
                displayBreadCrumbs();
            }.bind(this));
        }
        //remove single value from a url parameter
    $scope.removeSingleValue = function(param, value) {
        var newValue = [];
        if (urlVariables[param] != null && urlVariables[param] != '') {
            oldValues = urlVariables[param].split(',');
            for (var i = 0; i < oldValues.length; i++) {
                if (oldValues[i] != value)
                    newValue.push(oldValues[i]);
            }
        }

        if (newValue.length) {
            urlVariables[param] = newValue.join(',');

            $timeout(function() {
                $location.search(urlVariables);
                displayBreadCrumbs();
            }.bind(this));
        } else
            $scope.removeValue(param);
    }

    // Show expertise, place, and hazard menu in the initial status
    $scope.showPlaceList = true;
    $scope.showHazardList = false;
    $scope.showExpertiseList = false;

    // show expertise, place, and hazard tab
    $scope.showPeopleTab = true;
    $scope.showPlaceTab = true;
    $scope.showHazardTab = true;

    //Set the keyword value
    $scope.inputQuery = (urlVariables['keyword']!=null && urlVariables['keyword']!='') ? urlVariables['keyword'] : '';

    //Set place facet values
    $scope.placeFacetsRegion = (urlVariables['region']!=null && urlVariables['region']!='') ? urlVariables['region'] : '';
    $scope.placeFacetsZip = (urlVariables['zip']!=null && urlVariables['zip']!='') ? urlVariables['zip'] : '';
    $scope.placeFacetsUSCD = (urlVariables['uscd']!=null && urlVariables['uscd']!='') ? urlVariables['uscd'] : '';
    $scope.placeFacetsNWZ = (urlVariables['nwz']!=null && urlVariables['nwz']!='') ? urlVariables['nwz'] : '';

    //Populate hazard class types and set values
    $scope.hazardFacetPlace = (urlVariables['place']!=null && urlVariables['place']!='') ? urlVariables['place'] : '';
    if(urlVariables['date-start']!=null && urlVariables['date-start']!='')
        $scope.hazardFacetDateStart = new Date(urlVariables['date-start']);
    if(urlVariables['date-end']!=null && urlVariables['date-end']!='')
        $scope.hazardFacetDateEnd = new Date(urlVariables['date-end']);
    getHazardClasses().then(function(data) {
        $scope.hazardUrls = data;
        $scope.$apply();
    }).then(function() {
        if((urlVariables['hazard']!=null && urlVariables['hazard']!='')) {
            $timeout(function() {
                let hazArr = urlVariables['hazard'].split(',');
                for(let i=0; i<hazArr.length; i++) {
                    angular.element("#"+hazArr[i]).click();
                }
            });
        }
    });
    $scope.hazardFacetMagnitudeMin = (urlVariables['mag-min']!=null && !isNaN(urlVariables['mag-min'])) ? Number.parseInt(urlVariables['mag-min']) : '';
    $scope.hazardFacetMagnitudeMax = (urlVariables['mag-max']!=null && !isNaN(urlVariables['mag-max'])) ? Number.parseInt(urlVariables['mag-max']) : '';
    $scope.hazardQuakeDepthMin = (urlVariables['depth-min']!=null && !isNaN(urlVariables['depth-min'])) ? Number.parseInt(urlVariables['depth-min']) : '';
    $scope.hazardQuakeDepthMax = (urlVariables['depth-max']!=null && !isNaN(urlVariables['depth-max'])) ? Number.parseInt(urlVariables['depth-max']) : '';
    $scope.hazardFacetAcresBurnedMin = (urlVariables['acres-min']!=null && !isNaN(urlVariables['acres-min'])) ? Number.parseInt(urlVariables['acres-min']) : '';
    $scope.hazardFacetAcresBurnedMax = (urlVariables['acres-max']!=null && !isNaN(urlVariables['acres-max'])) ? Number.parseInt(urlVariables['acres-max']) : '';
    $scope.hazardFacetMeanDnbrMin = (urlVariables['dnbr-min']!=null && !isNaN(urlVariables['dnbr-min'])) ? Number.parseInt(urlVariables['dnbr-min']) : '';
    $scope.hazardFacetMeanDnbrMax = (urlVariables['dnbr-max']!=null && !isNaN(urlVariables['dnbr-max'])) ? Number.parseInt(urlVariables['dnbr-max']) : '';
    $scope.hazardFacetSDMeanDnbrMin = (urlVariables['stddev-dnbr-min']!=null && !isNaN(urlVariables['stddev-dnbr-min'])) ? Number.parseInt(urlVariables['stddev-dnbr-min']) : '';
    $scope.hazardFacetSDMeanDnbrMax = (urlVariables['stddev-dnbr-max']!=null && !isNaN(urlVariables['stddev-dnbr-max'])) ? Number.parseInt(urlVariables['stddev-dnbr-max']) : '';
    $scope.hazardFacetsZip = (urlVariables['hazard-zip']!=null && urlVariables['hazard-zip']!='') ? urlVariables['hazard-zip'] : '';
    $scope.hazardFacetsUSCD = (urlVariables['hazard-uscd']!=null && urlVariables['hazard-uscd']!='') ? urlVariables['hazard-uscd'] : '';
    $scope.hazardFacetsNWZ = (urlVariables['hazard-nwz']!=null && urlVariables['hazard-nwz']!='') ? urlVariables['hazard-nwz'] : '';

    //Populate expert topics and set values
    getExpertTopics().then(function(data) {
        $scope.expertTopics = data;
        $scope.$apply();
    }).then(function() {
        if((urlVariables['expert']!=null && urlVariables['expert']!='')) {
            $timeout(function() {
                let expertArr = urlVariables['expert'].split(',');
                for(let i=0; i<expertArr.length; i++) {
                    angular.element("#"+expertArr[i]).click();
                }
            });
        }
    });
    $scope.expertFacetsZip = (urlVariables['expert-zip']!=null && urlVariables['expert-zip']!='') ? urlVariables['expert-zip'] : '';
    $scope.expertFacetsUSCD = (urlVariables['expert-uscd']!=null && urlVariables['expert-uscd']!='') ? urlVariables['expert-uscd'] : '';
    $scope.expertFacetsNWZ = (urlVariables['expert-nwz']!=null && urlVariables['expert-nwz']!='') ? urlVariables['expert-nwz'] : '';

    getAdministrativeRegion().then(function(data) {
        $scope.administrativeRegions = data;
        $scope.$apply();
    }).then(function() {
        // if((urlVariables['expert']!=null && urlVariables['expert']!='')) {
        //     $timeout(function() {
        //         let expertArr = urlVariables['expert'].split(',');
        //         for(let i=0; i<expertArr.length; i++) {
        //             angular.element("#"+expertArr[i]).click();
        //         }
        //     });
        // }
    });

    // entire graph initialization
    init();

    $scope.onKeywordChange = function() {
        $scope.inputQuery = this.inputQuery;
    }

    $scope.keywordSubmit = function($event) {
        var keyword = $scope.inputQuery;
        if(keyword != '')
            $scope.updateURLParameters('keyword', keyword);
        else
            $scope.removeValue('keyword');

        var parameters = getParameters();
        var tabName = (urlVariables['tab']!=null && urlVariables['tab']!='') ? urlVariables['tab'] : 'place';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp']!=null && urlVariables['pp']!='') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page']!=null && urlVariables['page']!='') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    }

    // 4. click on tab
    $scope.clickTab = function($event) {
        var newActiveTabName = "";
        var urlUpdateTab = "";
        $scope.showPlaceList = false;
        $scope.showHazardList = false;
        $scope.showExpertiseList = false;

        //We have to look in two places cause the ng-click function may set the target to a child node rather than the
        //node it actually belongs to. Why? Who the heck knows.
        var innerHTML = $event.target.innerHTML;
        var currentHTML = $event.currentTarget.innerHTML;
        if (innerHTML.indexOf("People") != -1 || currentHTML.indexOf("People") != -1) {
            $scope.showExpertiseList = true;
            urlUpdateTab = "people";
            newActiveTabName = "People";
        } else if (innerHTML.indexOf("Place") != -1 || currentHTML.indexOf("Place") != -1) {
            $scope.showPlaceList = true;
            urlUpdateTab = "place";
            newActiveTabName = "Place";
        } else if (innerHTML.indexOf("Hazard") != -1 || currentHTML.indexOf("Hazard") != -1) {
            $scope.showHazardList = true;
            urlUpdateTab = "hazard";
            newActiveTabName = "Hazard";
        }
        $scope.updateURLParameters("tab", urlUpdateTab);

        var parameters = getParameters();
        var pp = (urlVariables['pp']!=null && urlVariables['pp']!='') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page']!=null && urlVariables['page']!='') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(newActiveTabName, page, pp, parameters);
        var selectors = displayTableByTabName(newActiveTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(newActiveTabName, selectors, countResults, parameters);
        });
    };

    $scope.selectSubList = function($event, functionName) {
        let dropdownImg = $event.target.nextElementSibling;
        let subListDiv = $event.target.parentNode.nextElementSibling;
        let childListItems = subListDiv.children;

        if($event.target.checked) {
            for(let i=0; i< childListItems.length; i++) {
                childListItems[i].children[0].checked = true;
            }
            dropdownImg.style["transform"] = "scaleY(-1)";
            subListDiv.style["display"] = "";
        } else  {
            for(let i=0; i< childListItems.length; i++) {
                childListItems[i].children[0].checked = false;
            }
            dropdownImg.style["transform"] = "";
            subListDiv.style["display"] = "none";
        }

        $scope[functionName]();
    };

    $scope.showSubList = function($event) {
        let dropdownImg = $event.target;
        let subListDiv = $event.target.parentNode.nextElementSibling;

        if(subListDiv.style["display"] == "") {
            dropdownImg.style["transform"] = "";
            subListDiv.style["display"] = "none";
        } else {
            dropdownImg.style["transform"] = "scaleY(-1)";
            subListDiv.style["display"] = "";
        }
    };

    //Select tab based on url value
    var activeTab = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'place';
    $timeout(function() {
        angular.element("#pills-" + activeTab + "-tab").click();
    });

    $scope.spatialSearchDraw = function() {
        if (resultsSearchMap) {
            resultsSearchMap.pm.addControls({
                position: "topleft",
                positions: {
                    draw: "topleft",
                    edit: "topright"
                },
                drawMarker: false,
                drawCircleMarker: false,
                drawPolyline: false,
                drawRectangle: true,
                drawPolygon: true,
                drawCircle: true,

                drawControls: true,
                editControls: false,
                optionsControls: true,
                customControls: true
            });

            resultsSearchMap.on("pm:create", (e) => {
                console.log("the shape is drawn/finished");
                console.log(e.shape);
                var coordinates;
                var radius;

                if (e.shape == "Polygon" || e.shape == "Rectangle") {
                    coordinates = resultsSearchMap.pm.getGeomanDrawLayers()[0].getLatLngs()[0];
                } else if (e.shape == "Circle") {
                    coordinates = resultsSearchMap.pm.getGeomanDrawLayers()[0].getLatLng();
                    radius = resultsSearchMap.pm.getGeomanDrawLayers()[0].getRadius();
                }

                console.log("coordinates: ", coordinates);
                console.log("radius: ", radius);

            });
        }
    };

    //These functions handle changing of facet values. They are added to the url, and then tables are regenerated
    $scope.placeFacetChanged = function() {
        var parameters = getParameters();

        if(parameters['placeFacetsRegion']!='')
            $scope.updateURLParameters('region', parameters['placeFacetsRegion']);
        else
            $scope.removeValue('region');
        if(parameters['placeFacetsZip']!='')
            $scope.updateURLParameters('zip', parameters['placeFacetsZip']);
        else
            $scope.removeValue('zip');
        if(parameters['placeFacetsUSCD']!='')
            $scope.updateURLParameters('uscd', parameters['placeFacetsUSCD']);
        else
            $scope.removeValue('uscd');
        if(parameters['placeFacetsNWZ']!='')
            $scope.updateURLParameters('nwz', parameters['placeFacetsNWZ']);
        else
            $scope.removeValue('nwz');

        var tabName = (urlVariables['tab']!=null && urlVariables['tab']!='') ? urlVariables['tab'] : 'place';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp']!=null && urlVariables['pp']!='') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page']!=null && urlVariables['page']!='') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    };

    $scope.hazardFacetChanged = function() {
        var parameters = getParameters();

        if(parameters['hazardFacetPlace']!='')
            $scope.updateURLParameters('place', parameters['hazardFacetPlace']);
        else
            $scope.removeValue('place');
        if(parameters['hazardFacetDateStart']!='')
            $scope.updateURLParameters('date-start', parameters['hazardFacetDateStart']);
        else
            $scope.removeValue('date-start');
        if(parameters['hazardFacetDateEnd']!='')
            $scope.updateURLParameters('date-end', parameters['hazardFacetDateEnd']);
        else
            $scope.removeValue('date-end');
        if(parameters['hazardFacetMagnitudeMin']!='')
            $scope.updateURLParameters('mag-min', parameters['hazardFacetMagnitudeMin']);
        else
            $scope.removeValue('mag-min');
        if(parameters['hazardFacetMagnitudeMax']!='')
            $scope.updateURLParameters('mag-max', parameters['hazardFacetMagnitudeMax']);
        else
            $scope.removeValue('mag-max');
        if(parameters['hazardQuakeDepthMin']!='')
            $scope.updateURLParameters('depth-min', parameters['hazardQuakeDepthMin']);
        else
            $scope.removeValue('depth-min');
        if(parameters['hazardQuakeDepthMax']!='')
            $scope.updateURLParameters('depth-max', parameters['hazardQuakeDepthMax']);
        else
            $scope.removeValue('depth-max');
        if(parameters['hazardFacetAcresBurnedMin']!='')
            $scope.updateURLParameters('acres-min', parameters['hazardFacetAcresBurnedMin']);
        else
            $scope.removeValue('acres-min');
        if(parameters['hazardFacetAcresBurnedMax']!='')
            $scope.updateURLParameters('acres-max', parameters['hazardFacetAcresBurnedMax']);
        else
            $scope.removeValue('acres-max');
        if(parameters['hazardFacetMeanDnbrMin']!='')
            $scope.updateURLParameters('dnbr-min', parameters['hazardFacetMeanDnbrMin']);
        else
            $scope.removeValue('dnbr-min');
        if(parameters['hazardFacetMeanDnbrMax']!='')
            $scope.updateURLParameters('dnbr-max', parameters['hazardFacetMeanDnbrMax']);
        else
            $scope.removeValue('dnbr-max');
        if(parameters['hazardFacetSDMeanDnbrMin']!='')
            $scope.updateURLParameters('stddev-dnbr-min', parameters['hazardFacetSDMeanDnbrMin']);
        else
            $scope.removeValue('stddev-dnbr-min');
        if(parameters['hazardFacetSDMeanDnbrMax']!='')
            $scope.updateURLParameters('stddev-dnbr-max', parameters['hazardFacetSDMeanDnbrMax']);
        else
            $scope.removeValue('stddev-dnbr-max');
        if(parameters['hazardFacetsZip']!='')
            $scope.updateURLParameters('hazard-zip', parameters['hazardFacetsZip']);
        else
            $scope.removeValue('hazard-zip');
        if(parameters['hazardFacetsUSCD']!='')
            $scope.updateURLParameters('hazard-uscd', parameters['hazardFacetsUSCD']);
        else
            $scope.removeValue('hazard-uscd');
        if(parameters['hazardFacetsNWZ']!='')
            $scope.updateURLParameters('hazard-nwz', parameters['hazardFacetsNWZ']);
        else
            $scope.removeValue('hazard-nwz');

        var tabName = (urlVariables['tab']!=null && urlVariables['tab']!='') ? urlVariables['tab'] : 'hazard';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp']!=null && urlVariables['pp']!='') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page']!=null && urlVariables['page']!='') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    };

    $scope.selectHazard = function() {
        var parameters = getParameters();

        if(parameters['hazardTypes'].length > 0)
            $scope.updateURLParameters('hazard', parameters['hazardTypes'].join(','));
        else
            $scope.removeValue('hazard');

        var tabName = (urlVariables['tab']!=null && urlVariables['tab']!='') ? urlVariables['tab'] : 'hazard';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp']!=null && urlVariables['pp']!='') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page']!=null && urlVariables['page']!='') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    };

    $scope.selectHazardRegion = function() {
        // var parameters = getParameters();
        //
        // if(parameters['hazardTypes'].length > 0)
        //     $scope.updateURLParameters('hazard', parameters['hazardTypes'].join(','));
        // else
        //     $scope.removeValue('hazard');
        //
        // var tabName = (urlVariables['tab']!=null && urlVariables['tab']!='') ? urlVariables['tab'] : 'hazard';
        // var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        // var pp = (urlVariables['pp']!=null && urlVariables['pp']!='') ? parseInt(urlVariables['pp']) : 20;
        // var page = (urlVariables['page']!=null && urlVariables['page']!='') ? parseInt(urlVariables['page']) : 1;
        // var response = sendQueries(activeTabName, page, pp, parameters);
        // var selectors = displayTableByTabName(activeTabName, response);
        //
        // response.then(function(result) {
        //     var countResults = result["count"];
        //     displayPagination(activeTabName, selectors, countResults, parameters);
        // });
    };

    $scope.expertFacetChanged = function() {
        var parameters = getParameters();

        if(parameters['expertFacetsZip']!='')
            $scope.updateURLParameters('expert-zip', parameters['expertFacetsZip']);
        else
            $scope.removeValue('expert-zip');
        if(parameters['expertFacetsUSCD']!='')
            $scope.updateURLParameters('expert-uscd', parameters['expertFacetsUSCD']);
        else
            $scope.removeValue('expert-uscd');
        if(parameters['expertFacetsNWZ']!='')
            $scope.updateURLParameters('expert-nwz', parameters['expertFacetsNWZ']);
        else
            $scope.removeValue('expert-nwz');

        var tabName = (urlVariables['tab']!=null && urlVariables['tab']!='') ? urlVariables['tab'] : 'people';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp']!=null && urlVariables['pp']!='') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page']!=null && urlVariables['page']!='') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    };

    $scope.selectTopic = function() {
        var parameters = getParameters();

        if(parameters['expertTopics'].length > 0)
            $scope.updateURLParameters('expert', parameters['expertTopics'].join(','));
        else
            $scope.removeValue('expert');

        var tabName = (urlVariables['tab']!=null && urlVariables['tab']!='') ? urlVariables['tab'] : 'people';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp']!=null && urlVariables['pp']!='') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page']!=null && urlVariables['page']!='') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    };

    $scope.selectExpertRegion = function() {
        // var parameters = getParameters();
        //
        // if(parameters['hazardTypes'].length > 0)
        //     $scope.updateURLParameters('hazard', parameters['hazardTypes'].join(','));
        // else
        //     $scope.removeValue('hazard');
        //
        // var tabName = (urlVariables['tab']!=null && urlVariables['tab']!='') ? urlVariables['tab'] : 'hazard';
        // var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        // var pp = (urlVariables['pp']!=null && urlVariables['pp']!='') ? parseInt(urlVariables['pp']) : 20;
        // var page = (urlVariables['page']!=null && urlVariables['page']!='') ? parseInt(urlVariables['page']) : 1;
        // var response = sendQueries(activeTabName, page, pp, parameters);
        // var selectors = displayTableByTabName(activeTabName, response);
        //
        // response.then(function(result) {
        //     var countResults = result["count"];
        //     displayPagination(activeTabName, selectors, countResults, parameters);
        // });
    };
});

kwgApp.controller("filters-controller", function($scope) {});

kwgApp.controller("results-controller", function($scope) {});

kwgApp.controller("spatialmap-controller", function($scope) {});

var init = function() {
    setTimeout(() => {
        // -77.036667, lng: 38.895
        // [40, -109.03]
        resultsSearchMap = L.map('results-search-map').setView([40.895, -100.036667], 5);
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zS24k9i8nVWbUmI9ngCZ', {
            tileSize: 512,
            zoomOffset: -1,
            minZoom: 1,
            attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
            crossOrigin: true
        }).addTo(resultsSearchMap);
    }, 200);
}

//We need this to call the url rewrite
var getScope = function() {
    return angular.element(document.querySelector('[ng-controller=spatialSearchController]')).scope();
}

// prepare the parameters
var getParameters = function() {
    var parameters = {"keyword": getScope().inputQuery};

    //Place facets
    angular.element("#placeFacetsRegion").each((index, div) => {
        parameters["placeFacetsRegion"] = div.value;
    });
    angular.element("#placeFacetsZip").each((index, div) => {
        parameters["placeFacetsZip"] = div.value;
    });
    angular.element("#placeFacetsUSCD").each((index, div) => {
        parameters["placeFacetsUSCD"] = div.value;
    });
    angular.element("#placeFacetsNWZ").each((index, div) => {
        parameters["placeFacetsNWZ"] = div.value;
    });

    //Hazard facets
    angular.element("#hazardFacetPlace").each((index, div) => {
        parameters["hazardFacetPlace"] = div.value;
    });
    angular.element("#hazardFacetDateStart").each((index, div) => {
        parameters["hazardFacetDateStart"] = div.value;
    });
    angular.element("#hazardFacetDateEnd").each((index, div) => {
        parameters["hazardFacetDateEnd"] = div.value;
    });
    let hazardTypes = [];
    angular.element("input:checkbox[name='hazard']:checked").each((index, hazard) => {
        hazardTypes.push(hazard.value);
    });
    parameters["hazardTypes"] = hazardTypes;
    angular.element("#hazardFacetMagnitudeMin").each((index, div) => {
        parameters["hazardFacetMagnitudeMin"] = div.value;
    });
    angular.element("#hazardFacetMagnitudeMax").each((index, div) => {
        parameters["hazardFacetMagnitudeMax"] = div.value;
    });
    angular.element("#hazardQuakeDepthMin").each((index, div) => {
        parameters["hazardQuakeDepthMin"] = div.value;
    });
    angular.element("#hazardQuakeDepthMax").each((index, div) => {
        parameters["hazardQuakeDepthMax"] = div.value;
    });
    angular.element("#hazardFacetAcresBurnedMin").each((index, div) => {
        parameters["hazardFacetAcresBurnedMin"] = div.value;
    });
    angular.element("#hazardFacetAcresBurnedMax").each((index, div) => {
        parameters["hazardFacetAcresBurnedMax"] = div.value;
    });
    angular.element("#hazardFacetMeanDnbrMin").each((index, div) => {
        parameters["hazardFacetMeanDnbrMin"] = div.value;
    });
    angular.element("#hazardFacetMeanDnbrMax").each((index, div) => {
        parameters["hazardFacetMeanDnbrMax"] = div.value;
    });
    angular.element("#hazardFacetSDMeanDnbrMin").each((index, div) => {
        parameters["hazardFacetSDMeanDnbrMin"] = div.value;
    });
    angular.element("#hazardFacetSDMeanDnbrMax").each((index, div) => {
        parameters["hazardFacetSDMeanDnbrMax"] = div.value;
    });
    let hazardRegions = [];
    angular.element("input:checkbox[name='hazard-region']:checked").each((index, hazardRegion) => {
        hazardRegions.push(hazardRegion.value);
    });
    parameters["hazardRegions"] = hazardRegions;
    angular.element("#hazardFacetsZip").each((index, div) => {
        parameters["hazardFacetsZip"] = div.value;
    });
    angular.element("#hazardFacetsUSCD").each((index, div) => {
        parameters["hazardFacetsUSCD"] = div.value;
    });
    angular.element("#hazardFacetsNWZ").each((index, div) => {
        parameters["hazardFacetsNWZ"] = div.value;
    });

    //People facets
    let expertTopics = [];
    angular.element("input:checkbox[name='expert']:checked").each((index, expert) => {
        expertTopics.push(expert.value);
    });
    parameters["expertTopics"] = expertTopics;
    let expertRegions = [];
    angular.element("input:checkbox[name='expert-region']:checked").each((index, expertRegion) => {
        expertRegions.push(expertRegion.value);
    });
    parameters["expertRegions"] = expertRegions;
    angular.element("#expertFacetsZip").each((index, div) => {
        parameters["expertFacetsZip"] = div.value;
    });
    angular.element("#expertFacetsUSCD").each((index, div) => {
        parameters["expertFacetsUSCD"] = div.value;
    });
    angular.element("#expertFacetsNWZ").each((index, div) => {
        parameters["expertFacetsNWZ"] = div.value;
    });

    return parameters;
};

var sendQueries = function(tabName, pageNum, recordNum, parameters) {
    angular.element("#ttl-results").html('Loading query...');
    switch(tabName) {
        case "Place":
            angular.element("#placeTable-body").append("<div id='loading' style='text-align:center;'><img src='/images/loading.svg'/></div>");
            return getPlaceSearchResults(pageNum, recordNum, parameters);
        case "Hazard":
            angular.element("#hazardTable-body").append("<div id='loading' style='text-align:center;'><img src='/images/loading.svg'/></div>");
            return getHazardSearchResults(pageNum, recordNum, parameters);
        case "People":
            angular.element("#expertTable-body").append("<div id='loading' style='text-align:center;'><img src='/images/loading.svg'/></div>");
            return getExpertSearchResults(pageNum, recordNum, parameters);
        default:
            return {};
    }
}

var displayBreadCrumbs = function() {
    bcURL = '#/result_search?';
    bcHTML = '<li><a href="' + bcURL + '">Explore</a></li>';

    tab = urlVariables['tab'];
    tabCap = tab.charAt(0).toUpperCase() + tab.slice(1);
    bcURL += 'tab=' + tab;
    bcHTML += '<li><a href="' + bcURL + '">' + tabCap + '</a></li>';

    if(urlVariables['keyword'] != null && urlVariables['keyword'] != '') {
        mainUrl = bcURL + '&keyword=' + urlVariables['keyword'];
        bcHTML += '<li><a href="' + mainUrl + '">Keyword: ' + urlVariables['keyword'] + '</a></li>';
    }

    switch (tab) {
        case "place":
            if(urlVariables['region'] != null && urlVariables['region'] != '') {
                placeUrl = bcURL + '&region=' + urlVariables['region'];
                bcHTML += '<li><a href="' + placeUrl + '">Administrative Region: ' + urlVariables['region'] + '</a></li>';
            }
            if(urlVariables['zip'] != null && urlVariables['zip'] != '') {
                placeUrl = bcURL + '&zip=' + urlVariables['zip'];
                bcHTML += '<li><a href="' + placeUrl + '">Zip Code: ' + urlVariables['zip'] + '</a></li>';
            }
            if(urlVariables['uscd'] != null && urlVariables['uscd'] != '') {
                placeUrl = bcURL + '&uscd=' + urlVariables['uscd'];
                bcHTML += '<li><a href="' + placeUrl + '">US Climate Division: ' + urlVariables['uscd'] + '</a></li>';
            }
            if(urlVariables['nwz'] != null && urlVariables['nwz'] != '') {
                placeUrl = bcURL + '&nwz=' + urlVariables['nwz'];
                bcHTML += '<li><a href="' + placeUrl + '">National Weather Zone: ' + urlVariables['nwz'] + '</a></li>';
            }
            break;
        case "hazard":
            if(urlVariables['place'] != null && urlVariables['place'] != '') {
                placeUrl = bcURL + '&place=' + urlVariables['place'];
                bcHTML += '<li><a href="' + placeUrl + '">Place: ' + urlVariables['place'] + '</a></li>';
            }
            if(urlVariables['date-start'] != null && urlVariables['date-start'] != '') {
                placeUrl = bcURL + '&date-start=' + urlVariables['date-start'];
                bcHTML += '<li><a href="' + placeUrl + '">Date Start: ' + urlVariables['date-start'] + '</a></li>';
            }
            if(urlVariables['date-end'] != null && urlVariables['date-end'] != '') {
                placeUrl = bcURL + '&date-end=' + urlVariables['date-end'];
                bcHTML += '<li><a href="' + placeUrl + '">Date End: ' + urlVariables['date-end'] + '</a></li>';
            }
            if (urlVariables['hazard'] != null && urlVariables['hazard'] != '') {
                var hazards = urlVariables['hazard'].split(',');
                for (var j = 0; j < hazards.length; j++) {
                    hazardUrl = bcURL + '&hazard=' + hazards[j];
                    bcHTML += '<li><a href="' + hazardUrl + '">' + hazards[j] + '</a></li>';
                }
            }
            if(urlVariables['mag-min'] != null && urlVariables['mag-min'] != '') {
                placeUrl = bcURL + '&mag-min=' + urlVariables['mag-min'];
                bcHTML += '<li><a href="' + placeUrl + '">Magnitude (min): ' + urlVariables['mag-min'] + '</a></li>';
            }
            if(urlVariables['mag-max'] != null && urlVariables['mag-max'] != '') {
                placeUrl = bcURL + '&mag-max=' + urlVariables['mag-max'];
                bcHTML += '<li><a href="' + placeUrl + '">Magnitude (max): ' + urlVariables['mag-max'] + '</a></li>';
            }
            if(urlVariables['depth-min'] != null && urlVariables['depth-min'] != '') {
                placeUrl = bcURL + '&depth-min=' + urlVariables['depth-min'];
                bcHTML += '<li><a href="' + placeUrl + '">Earthquake depth (min): ' + urlVariables['depth-min'] + '</a></li>';
            }
            if(urlVariables['depth-max'] != null && urlVariables['depth-max'] != '') {
                placeUrl = bcURL + '&depth-max=' + urlVariables['depth-max'];
                bcHTML += '<li><a href="' + placeUrl + '">Earthquake depth (max): ' + urlVariables['depth-max'] + '</a></li>';
            }
            if(urlVariables['acres-min'] != null && urlVariables['acres-min'] != '') {
                placeUrl = bcURL + '&acres-min=' + urlVariables['acres-min'];
                bcHTML += '<li><a href="' + placeUrl + '">Acres Burned (min): ' + urlVariables['acres-min'] + '</a></li>';
            }
            if(urlVariables['acres-max'] != null && urlVariables['acres-max'] != '') {
                placeUrl = bcURL + '&acres-max=' + urlVariables['acres-max'];
                bcHTML += '<li><a href="' + placeUrl + '">Acres Burned (max): ' + urlVariables['acres-max'] + '</a></li>';
            }
            if(urlVariables['dnbr-min'] != null && urlVariables['dnbr-min'] != '') {
                placeUrl = bcURL + '&dnbr-min=' + urlVariables['dnbr-min'];
                bcHTML += '<li><a href="' + placeUrl + '">Mean dNBR (min): ' + urlVariables['dnbr-min'] + '</a></li>';
            }
            if(urlVariables['dnbr-max'] != null && urlVariables['dnbr-max'] != '') {
                placeUrl = bcURL + '&dnbr-max=' + urlVariables['dnbr-max'];
                bcHTML += '<li><a href="' + placeUrl + '">Mean dNBR (max): ' + urlVariables['dnbr-max'] + '</a></li>';
            }
            if(urlVariables['stddev-dnbr-min'] != null && urlVariables['stddev-dnbr-min'] != '') {
                placeUrl = bcURL + '&stddev-dnbr-min=' + urlVariables['stddev-dnbr-min'];
                bcHTML += '<li><a href="' + placeUrl + '">SD of Mean dNBR (min): ' + urlVariables['stddev-dnbr-min'] + '</a></li>';
            }
            if(urlVariables['stddev-dnbr-max'] != null && urlVariables['stddev-dnbr-max'] != '') {
                placeUrl = bcURL + '&stddev-dnbr-max=' + urlVariables['stddev-dnbr-max'];
                bcHTML += '<li><a href="' + placeUrl + '">SD of Mean dNBR (max): ' + urlVariables['stddev-dnbr-max'] + '</a></li>';
            }
            if (urlVariables['hazard-region'] != null && urlVariables['hazard-region'] != '') {
                var hazardRegions = urlVariables['hazard-region'].split(',');
                for (var j = 0; j < hazardRegions.length; j++) {
                    expertUrl = bcURL + '&hazard-region=' + hazardRegions[j];
                    bcHTML += '<li><a href="' + expertUrl + '">' + hazardRegions[j] + '</a></li>';
                }
            }
            if(urlVariables['hazard-zip'] != null && urlVariables['hazard-zip'] != '') {
                placeUrl = bcURL + '&hazard-zip=' + urlVariables['hazard-zip'];
                bcHTML += '<li><a href="' + placeUrl + '">Hazard Zip Code: ' + urlVariables['hazard-zip'] + '</a></li>';
            }
            if(urlVariables['hazard-uscd'] != null && urlVariables['hazard-uscd'] != '') {
                placeUrl = bcURL + '&hazard-uscd=' + urlVariables['hazard-uscd'];
                bcHTML += '<li><a href="' + placeUrl + '">Hazard US Climate Division: ' + urlVariables['hazard-uscd'] + '</a></li>';
            }
            if(urlVariables['hazard-nwz'] != null && urlVariables['hazard-nwz'] != '') {
                placeUrl = bcURL + '&hazard-nwz=' + urlVariables['hazard-nwz'];
                bcHTML += '<li><a href="' + placeUrl + '">Hazard National Weather Zone: ' + urlVariables['hazard-nwz'] + '</a></li>';
            }
            break;
        case "people":
            if (urlVariables['expert'] != null && urlVariables['expert'] != '') {
                var experts = urlVariables['expert'].split(',');
                for (var j = 0; j < experts.length; j++) {
                    expertUrl = bcURL + '&expert=' + experts[j];
                    bcHTML += '<li><a href="' + expertUrl + '">' + experts[j] + '</a></li>';
                }
            }
            if (urlVariables['expert-region'] != null && urlVariables['expert-region'] != '') {
                var expertRegions = urlVariables['expert-region'].split(',');
                for (var j = 0; j < expertRegions.length; j++) {
                    expertUrl = bcURL + '&expert-region=' + expertRegions[j];
                    bcHTML += '<li><a href="' + expertUrl + '">' + expertRegions[j] + '</a></li>';
                }
            }
            if(urlVariables['expert-zip'] != null && urlVariables['expert-zip'] != '') {
                placeUrl = bcURL + '&expert-zip=' + urlVariables['expert-zip'];
                bcHTML += '<li><a href="' + placeUrl + '">expert Zip Code: ' + urlVariables['expert-zip'] + '</a></li>';
            }
            if(urlVariables['expert-uscd'] != null && urlVariables['expert-uscd'] != '') {
                placeUrl = bcURL + '&expert-uscd=' + urlVariables['expert-uscd'];
                bcHTML += '<li><a href="' + placeUrl + '">expert US Climate Division: ' + urlVariables['expert-uscd'] + '</a></li>';
            }
            if(urlVariables['expert-nwz'] != null && urlVariables['expert-nwz'] != '') {
                placeUrl = bcURL + '&expert-nwz=' + urlVariables['expert-nwz'];
                bcHTML += '<li><a href="' + placeUrl + '">expert National Weather Zone: ' + urlVariables['expert-nwz'] + '</a></li>';
            }
            break;
    }

    angular.element("#breadcrumb-list").html(bcHTML);
    angular.element("#breadcrumb-header").html(tabCap);
}

// for initial status, click facets
var displayActiveTab = function() {
    // find the active tab
    // var activeTabName = "";
    var activeElement = angular.element(".results-table #pills-tabContent div.active");
    var activeElementID = activeElement[0].id;
    if (activeElementID.endsWith("people")) {
        activeTabName = "People";
    } else if (activeElementID.endsWith("place")) {
        activeTabName = "Place";
    } else if (activeElementID.endsWith("hazard")) {
        activeTabName = "Hazard";
    }

    // get all the parameters
    var newParameters = getParameters();
    var response;
    if (JSON.stringify(parameters) != JSON.stringify(newParameters)) {
        loadedTabs = {};
        parameters = newParameters;

        // send queries to the current active tab
        var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        response = sendQueries(activeTabName, page, pp, parameters);

        // get the count of records and display them in the table
        var selectors = displayTableByTabName(activeTabName, response);
        response.then(function(e) {
            var key = Object.keys(e)[0];
            var val = e[key];
            val.then(function(result) {
                var countResults = result["count"];
                displayPagination(activeTabName, selectors, countResults, parameters);
            });

        });
        loadedTabs[activeTabName] = true;
    }

}

var displayTableByTabName = function(activeTabName, response) {
    var selectors = null;
    var countResults = null;
    var recordResults = null;
    var titlesDisplayed = [];

    if (activeTabName == "People") {
        selectors = {
            "thead": "#expertTableTitle",
            "tbody": "#expertTableBody",
            "pagination": "#expertPagination"
        };
    } else if (activeTabName == "Place") {
        selectors = {
            "thead": "#placeTableTitle",
            "tbody": "#placeTableBody",
            "pagination": "#placePagination"
        };
    } else if (activeTabName == "Hazard") {
        selectors = {
            "thead": "#hazardTableTitle",
            "tbody": "#hazardTableBody",
            "pagination": "#hazardPagination"
        };
    };

    if (selectors) {
        // Table title
        if (selectors["thead"] == "#expertTableTitle") {
            titlesDisplayed = expertTitles;
        } else if (selectors["thead"] == "#placeTableTitle") {
            titlesDisplayed = placeTitles;
        } else if (selectors["thead"] == "#hazardTableTitle") {
            titlesDisplayed = hazardTitles;
        }

        angular.element(selectors["thead"] + " thead tr").empty();
        titlesDisplayed.map(e => { return "<th>" + e + "</th>" }).
        forEach(tableTitleHtml => {
            angular.element(selectors["thead"] + " thead tr").append(tableTitleHtml);
        });

        // Table body
        var tableBody = angular.element(selectors["tbody"] + " tbody");
        tableBody.empty();

        response.then(function(result) {
            angular.element('#loading').remove();
            countResults = result["count"];
            recordResults = result["record"];

            var attributeLinks = [];
            var tableBodyAttributes = [];

            console.log(recordResults);
            recordResults.forEach(e => {
                var rowBodyHtml = "";
                if (selectors["thead"] == "#expertTableTitle") {
                    attributeLinks = [e["expert"], e["affiliation"], e["expertise"], e["place"]];
                    tableBodyAttributes = [e["expert_name"], e["affiliation_name"], e["expertise_name"], e["place_name"]];
                } else if (selectors["thead"] == "#placeTableTitle") {
                    attributeLinks = [e["place"], e["place_type"]];
                    tableBodyAttributes = [e["place_name"], e["place_type_name"]];
                } else if (selectors["thead"] == "#hazardTableTitle") {
                    attributeLinks = [e["hazard"], e["hazard_type"], e["place"], e["start_date"], e["end_date"]];
                    tableBodyAttributes = [e["hazard_name"], e["hazard_type_name"], e["place_name"], e["start_date_name"], e["end_date_name"]];
                };

                var numAttributes = attributeLinks.length;
                for (var index = 0; index < numAttributes; index++) {
                    var link = attributeLinks[index];
                    var attr = tableBodyAttributes[index];
                    var cellHtml = '';

                    if(Array.isArray(attr)) {
                        let linkArray = [];

                        for(let i=0; i<attr.length; i++) {
                            linkArray.push('<a target="_blank" href="' + link[i] + '">' + attr[i] + "</a>")
                        }

                        cellHtml = linkArray.join(', ');
                    }else {
                        cellHtml = '<a target="_blank" href="' + link + '">' + attr + "</a>";
                    }

                    rowBodyHtml += "<td>" + cellHtml + "</td>";
                }

                var rowHtml = "<tr>" + rowBodyHtml + "</tr>";
                tableBody.append(rowHtml);
            })

        }).then(function() {

            // angular.element(selectors["pagination"]).empty();
            // var perPage = angular.element('<div class="dropdown per-page">\
            //     <select class="dropdown-menu" aria-labelledby="dropdownMenuButton">\
            //         <option value="50" selected="selected">50 Per Page</option>\
            //         <option value="100">100 Per Page</option>\
            //         <option value="200">200 Per Page</option>\
            //     </select>\
            // </div>');

            // perPage.appendTo(selectors["pagination"]);
            // tablePagination(selectors["tbody"], selectors["pagination"], countResults, 50);
            // angular.element(selectors["pagination"] + " .per-page select").on("change", function() {
            //     var recordsPerpage = angular.element(this).val();

            //     tablePagination(selectors["tbody"], selectors["pagination"], countResults, recordsPerpage);
            // })
        });

        //displayMap(response, activeTabName);
    }
    return selectors;
};

var displayPagination = function(activeTabName, selectors, countResults, parameters) {
    angular.element("#ttl-results").html(countResults + ' Records');

    angular.element(selectors["pagination"]).empty();
    var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
    perPageHTML = '<div class="dropdown per-page"><select class="dropdown-menu" [ng-model]="perpage" (ngModelChange)="onChange($event)">';
    perPageHTML += (pp == 20) ? '<option value="20" selected="selected">20 Per Page</option>' : '<option value="20">20 Per Page</option>';
    perPageHTML += (pp == 50) ? '<option value="50" selected="selected">50 Per Page</option>' : '<option value="50">50 Per Page</option>';
    perPageHTML += (pp == 100) ? '<option value="100" selected="selected">100 Per Page</option>' : '<option value="100">100 Per Page</option>';
    perPageHTML += '</select></div>';
    var perPage = angular.element(perPageHTML);

    perPage.appendTo(selectors["pagination"]);
    getScope().updateURLParameters("pp", pp.toString());
    tablePagination(activeTabName, selectors["tbody"], selectors["pagination"], countResults, pp, parameters);
    angular.element(selectors["pagination"] + " .per-page select").on("change", function() {
        var recordsPerpage = angular.element(this).val();
        getScope().updateURLParameters("pp", recordsPerpage);

        // recalculate the pages
        tablePagination(activeTabName, selectors["tbody"], selectors["pagination"], countResults, recordsPerpage, parameters);
        var response = sendQueries(activeTabName, 1, recordsPerpage, parameters);
        displayTableByTabName(activeTabName, response)
    });
}


var tablePagination = function(activeTabName, selector, paginationSelector, totalRecords, numPerPage, parameters) {
    angular.element(selector).each(function() {
        var currentPage = 0;
        var $table = angular.element(this);
        $table.on('repaginate', function() {});

        var numPages = Math.ceil(totalRecords / numPerPage);

        if (angular.element(paginationSelector + 　" div.pager")) {
            angular.element(paginationSelector + " div.pager").remove();
        }

        var $pager = angular.element('<div class="pager"></div>');
        var selectedPage = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        if (numPages <= 10) {

            for (var page = 0; page < numPages; page++) {
                let pageHtml = (page + 1 == selectedPage) ? '<span class="page-item active"></span>' : '<span class="page-item"></span>';

                angular.element(pageHtml).text(page + 1).on('click', {
                    newPage: page
                }, function(event) {
                    currentPage = event.data['newPage'];
                    getScope().updateURLParameters('page', currentPage + 1);

                    angular.element(this).addClass("active").siblings().removeClass("active");

                    // click event
                    var response = sendQueries(activeTabName, currentPage + 1, numPerPage, parameters);
                    var selectors = displayTableByTabName(activeTabName, response);
                    displayPagination(activeTabName, selectors, totalRecords, parameters);

                }).appendTo($pager).addClass("clickable");
            }
        } else {
            //Add the first page, last page, current page, and the closet page numbers to the current page
            var pagesToSelect = [1, selectedPage - 1, selectedPage, selectedPage + 1, numPages];

            for (page = 0; page < numPages; page++) {
                if (!pagesToSelect.includes(page + 1))
                    continue;

                if (page + 1 == selectedPage) {
                    angular.element('<label for="page-number">Page Number</label><input type="text" id="page-number" class="page-item page-typed" value="' + (page + 1) + '"/>').on('change', function(event) {
                        typedPage = $(event.target).val();
                        getScope().updateURLParameters('page', typedPage);

                        angular.element(paginationSelector + " div.pager button").val(typedPage);
                        angular.element(this).addClass("active").siblings().removeClass("active");

                        // click event
                        var response = sendQueries(activeTabName, typedPage, numPerPage, parameters);
                        var selectors = displayTableByTabName(activeTabName, response);
                        displayPagination(activeTabName, selectors, totalRecords, parameters);

                    }).appendTo($pager).addClass("clickable");
                } else {
                    angular.element('<span class="page-item"></span>').text(page + 1).on('click', {
                        newPage: page
                    }, function(event) {
                        currentPage = event.data['newPage'];
                        getScope().updateURLParameters('page', currentPage + 1);

                        angular.element(paginationSelector + " div.pager button").val(currentPage + 1);
                        angular.element(this).addClass("active").siblings().removeClass("active");

                        // click event
                        var response = sendQueries(activeTabName, currentPage + 1, numPerPage, parameters);
                        var selectors = displayTableByTabName(activeTabName, response);
                        displayPagination(activeTabName, selectors, totalRecords, parameters);

                    }).appendTo($pager).addClass("clickable");
                }
            }
        }
        //Next button
        if (selectedPage < numPages) {
            angular.element('<button></button>').val(selectedPage).text("Next").on('click', function(event) {
                var nextPage = parseInt(angular.element(this).val()) + 1;
                angular.element(this).val(nextPage);

                var pages = angular.element(paginationSelector + " div.pager span");
                pages.each(function(e) {
                    var innerHTML = this.innerHTML;
                    if (nextPage + "" == innerHTML) {
                        $(this).addClass("active").siblings().removeClass("active");
                    }
                });

                currentPage = nextPage;
                getScope().updateURLParameters('page', currentPage);
                //  click event
                var response = sendQueries(activeTabName, currentPage, numPerPage, parameters);
                var selectors = displayTableByTabName(activeTabName, response);
                displayPagination(activeTabName, selectors, totalRecords, parameters);
            }).appendTo(paginationSelector).addClass("clickable next");
        }

        //Add the page numbers to the html
        $pager.appendTo(paginationSelector);

        //Before moving on, make sure that the pagination value actually exists.
        //If it doesn't, then load the 1st page
        if(numPages < selectedPage) {
            angular.element(paginationSelector + ' .page-item').first().click();
        } else if (selectedPage > 1) { //Prev button
            angular.element('<button></button>').val(selectedPage).text("Prev").on('click', function(event) {
                var nextPage = parseInt(angular.element(this).val()) - 1;
                angular.element(this).val(nextPage);

                var pages = angular.element(paginationSelector + " div.pager span");
                pages.each(function(e) {
                    var innerHTML = this.innerHTML;
                    if (nextPage + "" == innerHTML) {
                        $(this).addClass("active").siblings().removeClass("active");
                    }
                });

                currentPage = nextPage;
                getScope().updateURLParameters('page', currentPage);
                //  click event
                var response = sendQueries(activeTabName, currentPage, numPerPage, parameters);
                var selectors = displayTableByTabName(activeTabName, response);
                displayPagination(activeTabName, selectors, totalRecords, parameters);
            }).appendTo(paginationSelector).addClass("clickable prev");
        }
    });
}

function displayMap(fullTextResults, tabName) {
    // $("#spatial-search .results-nav ul li button.active")

    fullTextResults.then(function(e) {
        if (place_markers) {
            place_markers.removeLayers(markers);
            markers = [];
        }
        // var place = null;
        // if (tabName == "Expert") {
        //     place = e.Expert;
        // } else if (tabName == "Place") {
        //     place = e.Place;
        // } else if (tabName == "Hazard") {
        //     place = e.Hazard;
        // }
        var place = e["record"];

        if (place) {
            // var polygon = L.polygon(latlngs).addTo(resultsSearchMap);
            var wicket = new Wkt.Wkt();
            var center_lat = 0;
            var center_lon = 0;
            var count = 0;
            place.forEach(e => {
                if (e["place_geometry_wkt"]) {
                    count += 1;
                    var coords = wicket.read(e["place_geometry_wkt"]).toJson().coordinates;
                    center_lat += coords[1];
                    center_lon += coords[0];
                    let place_marker = new L.marker([coords[1], coords[0]]).bindPopup(dd('.popup', [
                        dd('b:' + e["place_name"]),
                        dd('br'),
                        dd('span:' + e["place"])
                    ]));
                    markers.push(place_marker);
                    place_markers.addLayer(place_marker);
                }

            });
            if (count) {
                center_lat /= count;
                center_lon /= count;

                resultsSearchMap.panTo(new L.LatLng(center_lat, center_lon));
                place_markers.addTo(resultsSearchMap);
            } else {
                //there is no returned locations
            }
        }
    });


}

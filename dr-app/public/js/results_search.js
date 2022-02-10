var parameters = {};

var expertTitles = ["Name", "Affiliation", "Expertise", "Place"];
var placeTitles = ["Name", "Type", "Hazards"];
var hazardTitles = ["Name", "Type", "Place", "Start Date", "End Date"];

var activeTabName = "";
var loadedTabs = {};

var place_markers = new L.MarkerClusterGroup();
var markers = [];
var clickedMarker = {};

var resultsSearchMap = null;

// The number of ms that are slept before calling a debounced method
var debounceTimeout = 500;

//For URL variable tracking
var urlVariables;

kwgApp.controller("spatialSearchController", function($scope, $timeout, $location) {
    //prep for URL variable tracking
    urlVariables = $location.search();

    /*
      Returns a debounced function that is called after 'wait' ms.
      Adapted from https://davidwalsh.name/javascript-debounce-function
    */
    let debounce = function(func, wait = 1000, immediate = false) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

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

    //facet hazards
    $scope.earthquakeFacets = false;
    $scope.fireFacets = false;

    //Set the keyword value
    $scope.inputQuery = (urlVariables['keyword'] != null && urlVariables['keyword'] != '') ? urlVariables['keyword'] : '';

    //Set place facet values
    $scope.placeFacetsRegion = (urlVariables['region'] != null && urlVariables['region'] != '') ? urlVariables['region'] : '';
    $scope.placeFacetsZip = (urlVariables['zip'] != null && urlVariables['zip'] != '') ? urlVariables['zip'] : '';
    $scope.placeFacetsUSCD = (urlVariables['uscd'] != null && urlVariables['uscd'] != '') ? urlVariables['uscd'] : '';
    $scope.placeFacetsNWZ = (urlVariables['nwz'] != null && urlVariables['nwz'] != '') ? urlVariables['nwz'] : '';

    //Populate hazard class types and set values
    if (urlVariables['date-start'] != null && urlVariables['date-start'] != '')
        $scope.hazardFacetDateStart = new Date(urlVariables['date-start']);
    if (urlVariables['date-end'] != null && urlVariables['date-end'] != '')
        $scope.hazardFacetDateEnd = new Date(urlVariables['date-end']);
    getHazardClasses().then(function(data) {
        $scope.hazardUrls = data;
        $scope.$apply();
    }).then(function() {
        if ((urlVariables['hazard'] != null && urlVariables['hazard'] != '')) {
            $timeout(function() {
                let hazArr = urlVariables['hazard'].split(',');
                for (let i = 0; i < hazArr.length; i++) {
                    angular.element("#" + hazArr[i]).click();
                }
            });
        }
    });
    $scope.hazardFacetMagnitudeMin = (urlVariables['mag-min'] != null && !isNaN(urlVariables['mag-min'])) ? Number.parseInt(urlVariables['mag-min']) : '';
    $scope.hazardFacetMagnitudeMax = (urlVariables['mag-max'] != null && !isNaN(urlVariables['mag-max'])) ? Number.parseInt(urlVariables['mag-max']) : '';
    $scope.hazardQuakeDepthMin = (urlVariables['depth-min'] != null && !isNaN(urlVariables['depth-min'])) ? Number.parseInt(urlVariables['depth-min']) : '';
    $scope.hazardQuakeDepthMax = (urlVariables['depth-max'] != null && !isNaN(urlVariables['depth-max'])) ? Number.parseInt(urlVariables['depth-max']) : '';
    $scope.hazardFacetAcresBurnedMin = (urlVariables['acres-min'] != null && !isNaN(urlVariables['acres-min'])) ? Number.parseInt(urlVariables['acres-min']) : '';
    $scope.hazardFacetAcresBurnedMax = (urlVariables['acres-max'] != null && !isNaN(urlVariables['acres-max'])) ? Number.parseInt(urlVariables['acres-max']) : '';
    $scope.hazardFacetMeanDnbrMin = (urlVariables['dnbr-min'] != null && !isNaN(urlVariables['dnbr-min'])) ? Number.parseInt(urlVariables['dnbr-min']) : '';
    $scope.hazardFacetMeanDnbrMax = (urlVariables['dnbr-max'] != null && !isNaN(urlVariables['dnbr-max'])) ? Number.parseInt(urlVariables['dnbr-max']) : '';
    $scope.hazardFacetSDMeanDnbrMin = (urlVariables['stddev-dnbr-min'] != null && !isNaN(urlVariables['stddev-dnbr-min'])) ? Number.parseInt(urlVariables['stddev-dnbr-min']) : '';
    $scope.hazardFacetSDMeanDnbrMax = (urlVariables['stddev-dnbr-max'] != null && !isNaN(urlVariables['stddev-dnbr-max'])) ? Number.parseInt(urlVariables['stddev-dnbr-max']) : '';

    //Populate expert topics and set values
    getExpertTopics().then(function(data) {
        $scope.expertTopics = data;
        $scope.$apply();
    }).then(function() {
        if ((urlVariables['expert'] != null && urlVariables['expert'] != '')) {
            $timeout(function() {
                let expertArr = urlVariables['expert'].split(',');
                for (let i = 0; i < expertArr.length; i++) {
                    angular.element("#" + expertArr[i]).click();
                }
            });
        }
    });

    getAdministrativeRegion().then(function(data) {
        $scope.administrativeRegions = data;
        $scope.$apply();
    }).then(function() {
        if ((urlVariables['regions'] != null && urlVariables['regions'] != '')) {
            $timeout(function() {
                let expertArr = urlVariables['regions'].split(',');
                for (let i = 0; i < expertArr.length; i++) {
                    angular.element("#" + expertArr[i]).click();
                }
            });
        }
    });

    // entire graph initialization
    init();

    $scope.onKeywordChange = function() {
        $scope.inputQuery = this.inputQuery;
    }


    $scope.keywordSubmit = debounce(function($event) {
        var keyword = $scope.inputQuery;
        if (keyword != '')
            $scope.updateURLParameters('keyword', keyword);
        else
            $scope.removeValue('keyword');

        var parameters = getParameters();
        var tabName = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'place';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    }, debounceTimeout);

    // 4. click on tab
    // clickType is the tab type (eg 'hazard', 'place', 'people')
    $scope.clickTab = debounce(function($event, clickType) {
        var newActiveTabName = "";
        var urlUpdateTab = "";
        $scope.showPlaceList = false;
        $scope.showHazardList = false;
        $scope.showExpertiseList = false;

        if (clickType === "people") {
            $scope.showExpertiseList = true;
            urlUpdateTab = "people";
            newActiveTabName = "People";
        } else if (clickType === "place") {
            $scope.showPlaceList = true;
            urlUpdateTab = "place";
            newActiveTabName = "Place";
        } else if (clickType === "hazard") {
            $scope.showHazardList = true;
            urlUpdateTab = "hazard";
            newActiveTabName = "Hazard";
        }
        $scope.updateURLParameters("tab", urlUpdateTab);

        var parameters = getParameters();
        var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(newActiveTabName, page, pp, parameters);
        var selectors = displayTableByTabName(newActiveTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(newActiveTabName, selectors, countResults, parameters);
        });
    }, debounceTimeout);

    $scope.selectSubList = function($event, functionName) {
        let dropdownImg = $event.target.nextElementSibling;
        let subListDiv = $event.target.parentNode.nextElementSibling;
        let childListItems = subListDiv.children;

        if ($event.target.checked) {
            for (let i = 0; i < childListItems.length; i++) {
                childListItems[i].children[0].checked = true;
            }
            dropdownImg.style["transform"] = "scaleY(-1)";
            subListDiv.style["display"] = "";
        } else {
            for (let i = 0; i < childListItems.length; i++) {
                childListItems[i].children[0].checked = false;
            }
            dropdownImg.style["transform"] = "";
            subListDiv.style["display"] = "none";
        }

        $scope[functionName]($event);
    };

    $scope.showSubList = function($event) {
        let dropdownImg = $event.target;
        let subListDiv = $event.target.parentNode.nextElementSibling;

        if (subListDiv.style["display"] == "") {
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
                    edit: "topleft"
                },
                drawMarker: false,
                drawCircleMarker: false,
                drawPolyline: false,
                drawRectangle: false,
                drawPolygon: false,
                drawCircle: true,

                drawControls: true,
                editControls: true,
                optionsControls: true,
                customControls: true,
                cutPolygon: false,
                rotateMode: false

            });

            resultsSearchMap.on("pm:create", (e) => {
                var coordinates;
                var radius;

                if (e.shape == "Polygon" || e.shape == "Rectangle") {
                    coordinates = resultsSearchMap.pm.getGeomanDrawLayers()[0].getLatLngs()[0];
                } else if (e.shape == "Circle") {
                    // the default circle to do spatial search is set to be the one just drawn
                    var spatialDrawLength = resultsSearchMap.pm.getGeomanDrawLayers().length;
                    coordinates = resultsSearchMap.pm.getGeomanDrawLayers()[spatialDrawLength - 1].getLatLng();
                    radius = resultsSearchMap.pm.getGeomanDrawLayers()[spatialDrawLength - 1].getRadius();
                    radius = radius / 1000; // convert to radius in kilometers

                    // create the circle object and convert its geometry to the wkt format
                    var optionsCircle = { steps: 10, units: 'kilometers', properties: { foo: 'bar' } };
                    var circle = turf.circle([coordinates.lng, coordinates.lat], radius, optionsCircle);
                    var circleWkt = '<http://www.opengis.net/def/crs/OGC/1.3/CRS84>POLYGON((';
                    var circleCoordinates = circle.geometry.coordinates[0];
                    for (i = 0; i < circleCoordinates.length; i++) {
                        circleWkt += circleCoordinates[i][0].toString() + ' ' + circleCoordinates[i][1].toString();
                        if (i == circleCoordinates.length - 1) {
                            circleWkt += '))';
                        } else {
                            circleWkt += ',';
                        }
                    }

                    // return the parameters for spatial search
                    var parameters = getParameters();
                    parameters["spatialSearchWkt"] = circleWkt;

                    var tabName = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'place';
                    var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
                    var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
                    var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
                    var response = sendQueries(activeTabName, page, pp, parameters);
                    var selectors = displayTableByTabName(activeTabName, response);

                    response.then(function(result) {
                        var countResults = result["count"];
                        displayPagination(activeTabName, selectors, countResults, parameters);
                    });
                    $scope.updateURLParameters('polygon', 'circle');
                    $scope.updateURLParameters('lon', coordinates.lng.toString());
                    $scope.updateURLParameters('lat', coordinates.lat.toString());
                    $scope.updateURLParameters('radius', radius.toString());
                }
            });
        }
    };

    //These functions handle changing of facet values. They are added to the url, and then tables are regenerated
    $scope.placeFacetChanged = debounce(function($event) {
        var parameters = getParameters();

        if (parameters['placeFacetsRegion'] != '')
            $scope.updateURLParameters('region', parameters['placeFacetsRegion']);
        else
            $scope.removeValue('region');
        if (parameters['placeFacetsZip'] != '')
            $scope.updateURLParameters('zip', parameters['placeFacetsZip']);
        else
            $scope.removeValue('zip');
        if (parameters['placeFacetsUSCD'] != '')
            $scope.updateURLParameters('uscd', parameters['placeFacetsUSCD']);
        else
            $scope.removeValue('uscd');
        if (parameters['placeFacetsNWZ'] != '')
            $scope.updateURLParameters('nwz', parameters['placeFacetsNWZ']);
        else
            $scope.removeValue('nwz');

        var tabName = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'place';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    }, debounceTimeout);

    $scope.hazardFacetChanged = debounce(function() {
        var parameters = getParameters();

        if (parameters['hazardFacetDateStart'] != '')
            $scope.updateURLParameters('date-start', parameters['hazardFacetDateStart']);
        else
            $scope.removeValue('date-start');
        if (parameters['hazardFacetDateEnd'] != '')
            $scope.updateURLParameters('date-end', parameters['hazardFacetDateEnd']);
        else
            $scope.removeValue('date-end');
        if (parameters['hazardFacetMagnitudeMin'] != '')
            $scope.updateURLParameters('mag-min', parameters['hazardFacetMagnitudeMin']);
        else
            $scope.removeValue('mag-min');
        if (parameters['hazardFacetMagnitudeMax'] != '')
            $scope.updateURLParameters('mag-max', parameters['hazardFacetMagnitudeMax']);
        else
            $scope.removeValue('mag-max');
        if (parameters['hazardQuakeDepthMin'] != '')
            $scope.updateURLParameters('depth-min', parameters['hazardQuakeDepthMin']);
        else
            $scope.removeValue('depth-min');
        if (parameters['hazardQuakeDepthMax'] != '')
            $scope.updateURLParameters('depth-max', parameters['hazardQuakeDepthMax']);
        else
            $scope.removeValue('depth-max');
        if (parameters['hazardFacetAcresBurnedMin'] != '')
            $scope.updateURLParameters('acres-min', parameters['hazardFacetAcresBurnedMin']);
        else
            $scope.removeValue('acres-min');
        if (parameters['hazardFacetAcresBurnedMax'] != '')
            $scope.updateURLParameters('acres-max', parameters['hazardFacetAcresBurnedMax']);
        else
            $scope.removeValue('acres-max');
        if (parameters['hazardFacetMeanDnbrMin'] != '')
            $scope.updateURLParameters('dnbr-min', parameters['hazardFacetMeanDnbrMin']);
        else
            $scope.removeValue('dnbr-min');
        if (parameters['hazardFacetMeanDnbrMax'] != '')
            $scope.updateURLParameters('dnbr-max', parameters['hazardFacetMeanDnbrMax']);
        else
            $scope.removeValue('dnbr-max');
        if (parameters['hazardFacetSDMeanDnbrMin'] != '')
            $scope.updateURLParameters('stddev-dnbr-min', parameters['hazardFacetSDMeanDnbrMin']);
        else
            $scope.removeValue('stddev-dnbr-min');
        if (parameters['hazardFacetSDMeanDnbrMax'] != '')
            $scope.updateURLParameters('stddev-dnbr-max', parameters['hazardFacetSDMeanDnbrMax']);
        else
            $scope.removeValue('stddev-dnbr-max');

        var tabName = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'hazard';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    }, debounceTimeout);

    $scope.selectHazard = debounce(function($event) {
        var parameters = getParameters();

        if (parameters['hazardTypes'].length > 0) {
            // $scope.earthquakeFacets = false;
            // $scope.fireFacets = false;

            for (let i = 0; i < parameters['hazardTypes'].length; i++) {
                let hazType = parameters['hazardTypes'][i];

                if (hazType.includes('Earthquake'))
                    $scope.earthquakeFacets = true;

                if (hazType.includes('fire') || hazType.includes('Fire'))
                    $scope.fireFacets = true;
            }

            $scope.updateURLParameters('hazard', parameters['hazardTypes'].join(','));
        } else {
            $scope.earthquakeFacets = true;
            $scope.fireFacets = true;
            $scope.removeValue('hazard');
        }

        var tabName = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'hazard';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    }, debounceTimeout);

    //DEVNOTE: This function may be unused
    $scope.expertFacetChanged = debounce(function($event) {
        var parameters = getParameters();

        //EXAMPLE:
        // if(parameters['expertFacetsZip']!='')
        //     $scope.updateURLParameters('expert-zip', parameters['expertFacetsZip']);
        // else
        //     $scope.removeValue('expert-zip');

        var tabName = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'people';

        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    }, debounceTimeout);

    $scope.selectTopic = debounce(function($event) {
        var parameters = getParameters();

        if (parameters['expertTopics'].length > 0)
            $scope.updateURLParameters('expert', parameters['expertTopics'].join(','));
        else
            $scope.removeValue('expert');

        var tabName = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'people';

        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    }, debounceTimeout);

    $scope.selectRegion = debounce(function() {
        var parameters = getParameters();

        if (parameters["facetRegions"].length > 0)
            $scope.updateURLParameters('regions', parameters['facetRegions'].join(','));
        else
            $scope.removeValue('regions');

        var tabName = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'place';
        var activeTabName = tabName.charAt(0).toUpperCase() + tab.slice(1);
        var pp = (urlVariables['pp'] != null && urlVariables['pp'] != '') ? parseInt(urlVariables['pp']) : 20;
        var page = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
        var response = sendQueries(activeTabName, page, pp, parameters);
        var selectors = displayTableByTabName(activeTabName, response);

        response.then(function(result) {
            var countResults = result["count"];
            displayPagination(activeTabName, selectors, countResults, parameters);
        });
    }, debounceTimeout);
}).directive('ngEnter', function() {
    return function(scope, elem, attrs) {
        elem.bind("keydown keypress", function(event) {
            // 13 represents enter button
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

kwgApp.controller("filters-controller", function($scope) {
    $scope.message = "filters-controller";
});

kwgApp.controller("results-controller", function($scope) {});

kwgApp.controller("spatialmap-controller", function($scope) {});

kwgApp.directive('autocomplete', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            getZipCodeArea().then(function(data) {
                if (element[0] == angular.element('#placeFacetsZip')[0] | element[0] == angular.element('#regionFacetsZip')[0]) {
                    element.autocomplete({
                        source: Object.keys(data['zipcodes']),
                        select: function(event, ui) {
                            ngModelCtrl.$setViewValue(ui.item);
                            scope.$apply();
                        }
                    });
                }
            });
            getUSClimateDivision().then(function(data) {
                if (element[0] == angular.element('#placeFacetsUSCD')[0] | element[0] == angular.element('#regionFacetsUSCD')[0]) {
                    element.autocomplete({
                        source: Object.keys(data['divisions']),
                        select: function(event, ui) {
                            ngModelCtrl.$setViewValue(ui.item);
                            scope.$apply();
                        }
                    });
                }
            });
            getNWZone().then(function(data) {
                if (element[0] == angular.element('#placeFacetsNWZ')[0] | element[0] == angular.element('#regionFacetsNWZ')[0]) {
                    element.autocomplete({
                        source: Object.keys(data['nwzones']),
                        select: function(event, ui) {
                            ngModelCtrl.$setViewValue(ui.item);
                            scope.$apply();
                        }
                    });
                }
            });
        }
    }
});

var init = function() {
    setTimeout(() => {
        // -77.036667, lng: 38.895
        // [40, -109.03]
        resultsSearchMap = L.map('results-search-map').setView([33.733464963369975, -96.40718835164839], 3);
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
    var parameters = { "keyword": getScope().inputQuery };
    var tabName = (urlVariables['tab'] != null && urlVariables['tab'] != '') ? urlVariables['tab'] : 'place';

    //Place facets
    parameters["placeFacetsRegion"] = angular.element("#placeFacetsRegion")[0].value;
    switch (tabName) {
        case 'place':
            parameters["placeFacetsZip"] = angular.element("#placeFacetsZip")[0].value;
            parameters["placeFacetsUSCD"] = angular.element("#placeFacetsUSCD")[0].value;
            parameters["placeFacetsNWZ"] = angular.element("#placeFacetsNWZ")[0].value;
            break;
        case 'hazard':
            parameters["placeFacetsZip"] = angular.element("#regionFacetsZip")[0].value;
            parameters["placeFacetsUSCD"] = angular.element("#regionFacetsUSCD")[0].value;
            parameters["placeFacetsNWZ"] = angular.element("#regionFacetsNWZ")[0].value;
            break;
    }
    //Hazard facets
    parameters["hazardFacetDateStart"] = angular.element("#hazardFacetDateStart")[0].value;
    parameters["hazardFacetDateEnd"] = angular.element("#hazardFacetDateEnd")[0].value;
    let hazardTypes = [];
    angular.element("input:checkbox[name='hazard']:checked").each((index, hazard) => {
        hazardTypes.push(hazard.value);
    });
    parameters["hazardTypes"] = hazardTypes;
    parameters["hazardFacetMagnitudeMin"] = angular.element("#hazardFacetMagnitudeMin")[0].value;
    parameters["hazardFacetMagnitudeMax"] = angular.element("#hazardFacetMagnitudeMax")[0].value;
    parameters["hazardQuakeDepthMin"] = angular.element("#hazardQuakeDepthMin")[0].value;
    parameters["hazardQuakeDepthMax"] = angular.element("#hazardQuakeDepthMax")[0].value;
    parameters["hazardFacetAcresBurnedMin"] = angular.element("#hazardFacetAcresBurnedMin")[0].value;
    parameters["hazardFacetAcresBurnedMax"] = angular.element("#hazardFacetAcresBurnedMax")[0].value;
    parameters["hazardFacetMeanDnbrMin"] = angular.element("#hazardFacetMeanDnbrMin")[0].value;
    parameters["hazardFacetMeanDnbrMax"] = angular.element("#hazardFacetMeanDnbrMax")[0].value;
    parameters["hazardFacetSDMeanDnbrMin"] = angular.element("#hazardFacetSDMeanDnbrMin")[0].value;
    parameters["hazardFacetSDMeanDnbrMax"] = angular.element("#hazardFacetSDMeanDnbrMax")[0].value;

    //People facets
    let expertTopics = [];
    angular.element("input:checkbox[name='expert']:checked").each((index, expert) => {
        expertTopics.push(expert.value);
    });
    parameters["expertTopics"] = expertTopics;

    //Place sub facets
    let facetRegions = [];
    angular.element("input:checkbox[name='region']:checked").each((index, facetRegion) => {
        facetRegions.push(facetRegion.value);
    });
    parameters["facetRegions"] = facetRegions;

    return parameters;
};

var sendQueries = function(tabName, pageNum, recordNum, parameters) {
    angular.element("#ttl-results").html('Loading query...');
    clearResultsTable(tabName);
    switch (tabName) {
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

/*
  Clears the table pertaining to a particular set of results. This removes any loading icons
  and the results in the table
*/
var clearResultsTable = function(tableName) {

    angular.element("#hazardTable-body #loading").remove();
    angular.element("#expertTable-body #loading").remove();
    angular.element("#placeTable-body #loading").remove();
}

var displayBreadCrumbs = function() {
    bcURL = '#/result_search?';
    bcHTML = '<li><a href="' + bcURL + '">Explore</a></li>';

    tab = urlVariables['tab'];
    tabCap = tab.charAt(0).toUpperCase() + tab.slice(1);
    bcURL += 'tab=' + tab;
    bcHTML += '<li><a href="' + bcURL + '">' + tabCap + '</a></li>';

    if (urlVariables['keyword'] != null && urlVariables['keyword'] != '') {
        mainUrl = bcURL + '&keyword=' + urlVariables['keyword'];
        bcHTML += '<li><a href="' + mainUrl + '">Keyword: ' + urlVariables['keyword'] + '</a></li>';
    }

    switch (tab) {
        case "place":
            if (urlVariables['region'] != null && urlVariables['region'] != '') {
                placeUrl = bcURL + '&region=' + urlVariables['region'];
                bcHTML += '<li><a href="' + placeUrl + '">Administrative Region: ' + urlVariables['region'] + '</a></li>';
            }
            if (urlVariables['zip'] != null && urlVariables['zip'] != '') {
                placeUrl = bcURL + '&zip=' + urlVariables['zip'];
                bcHTML += '<li><a href="' + placeUrl + '">Zip Code: ' + urlVariables['zip'] + '</a></li>';
            }
            if (urlVariables['uscd'] != null && urlVariables['uscd'] != '') {
                placeUrl = bcURL + '&uscd=' + urlVariables['uscd'];
                bcHTML += '<li><a href="' + placeUrl + '">US Climate Division: ' + urlVariables['uscd'] + '</a></li>';
            }
            if (urlVariables['nwz'] != null && urlVariables['nwz'] != '') {
                placeUrl = bcURL + '&nwz=' + urlVariables['nwz'];
                bcHTML += '<li><a href="' + placeUrl + '">National Weather Zone: ' + urlVariables['nwz'] + '</a></li>';
            }
            break;
        case "hazard":
            if (urlVariables['date-start'] != null && urlVariables['date-start'] != '') {
                placeUrl = bcURL + '&date-start=' + urlVariables['date-start'];
                bcHTML += '<li><a href="' + placeUrl + '">Date Start: ' + urlVariables['date-start'] + '</a></li>';
            }
            if (urlVariables['date-end'] != null && urlVariables['date-end'] != '') {
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
            if (urlVariables['mag-min'] != null && urlVariables['mag-min'] != '') {
                placeUrl = bcURL + '&mag-min=' + urlVariables['mag-min'];
                bcHTML += '<li><a href="' + placeUrl + '">Magnitude (min): ' + urlVariables['mag-min'] + '</a></li>';
            }
            if (urlVariables['mag-max'] != null && urlVariables['mag-max'] != '') {
                placeUrl = bcURL + '&mag-max=' + urlVariables['mag-max'];
                bcHTML += '<li><a href="' + placeUrl + '">Magnitude (max): ' + urlVariables['mag-max'] + '</a></li>';
            }
            if (urlVariables['depth-min'] != null && urlVariables['depth-min'] != '') {
                placeUrl = bcURL + '&depth-min=' + urlVariables['depth-min'];
                bcHTML += '<li><a href="' + placeUrl + '">Earthquake depth (min): ' + urlVariables['depth-min'] + '</a></li>';
            }
            if (urlVariables['depth-max'] != null && urlVariables['depth-max'] != '') {
                placeUrl = bcURL + '&depth-max=' + urlVariables['depth-max'];
                bcHTML += '<li><a href="' + placeUrl + '">Earthquake depth (max): ' + urlVariables['depth-max'] + '</a></li>';
            }
            if (urlVariables['acres-min'] != null && urlVariables['acres-min'] != '') {
                placeUrl = bcURL + '&acres-min=' + urlVariables['acres-min'];
                bcHTML += '<li><a href="' + placeUrl + '">Acres Burned (min): ' + urlVariables['acres-min'] + '</a></li>';
            }
            if (urlVariables['acres-max'] != null && urlVariables['acres-max'] != '') {
                placeUrl = bcURL + '&acres-max=' + urlVariables['acres-max'];
                bcHTML += '<li><a href="' + placeUrl + '">Acres Burned (max): ' + urlVariables['acres-max'] + '</a></li>';
            }
            if (urlVariables['dnbr-min'] != null && urlVariables['dnbr-min'] != '') {
                placeUrl = bcURL + '&dnbr-min=' + urlVariables['dnbr-min'];
                bcHTML += '<li><a href="' + placeUrl + '">Mean dNBR (min): ' + urlVariables['dnbr-min'] + '</a></li>';
            }
            if (urlVariables['dnbr-max'] != null && urlVariables['dnbr-max'] != '') {
                placeUrl = bcURL + '&dnbr-max=' + urlVariables['dnbr-max'];
                bcHTML += '<li><a href="' + placeUrl + '">Mean dNBR (max): ' + urlVariables['dnbr-max'] + '</a></li>';
            }
            if (urlVariables['stddev-dnbr-min'] != null && urlVariables['stddev-dnbr-min'] != '') {
                placeUrl = bcURL + '&stddev-dnbr-min=' + urlVariables['stddev-dnbr-min'];
                bcHTML += '<li><a href="' + placeUrl + '">SD of Mean dNBR (min): ' + urlVariables['stddev-dnbr-min'] + '</a></li>';
            }
            if (urlVariables['stddev-dnbr-max'] != null && urlVariables['stddev-dnbr-max'] != '') {
                placeUrl = bcURL + '&stddev-dnbr-max=' + urlVariables['stddev-dnbr-max'];
                bcHTML += '<li><a href="' + placeUrl + '">SD of Mean dNBR (max): ' + urlVariables['stddev-dnbr-max'] + '</a></li>';
            }
            if (urlVariables['region'] != null && urlVariables['region'] != '') {
                var facetRegions = urlVariables['region'].split(',');
                for (var j = 0; j < facetRegions.length; j++) {
                    expertUrl = bcURL + '&region=' + facetRegions[j];
                    bcHTML += '<li><a href="' + expertUrl + '">' + facetRegions[j] + '</a></li>';
                }
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
            if (urlVariables['region'] != null && urlVariables['region'] != '') {
                var facetRegions = urlVariables['region'].split(',');
                for (var j = 0; j < facetRegions.length; j++) {
                    expertUrl = bcURL + '&region=' + facetRegions[j];
                    bcHTML += '<li><a href="' + expertUrl + '">' + facetRegions[j] + '</a></li>';
                }
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
            "tbody": "#expertTable",
            "tbodyRes": "expertTableBody",
            "pagination": "#expertPagination"
        };
    } else if (activeTabName == "Place") {
        selectors = {
            "thead": "#placeTableTitle",
            "tbody": "#placeTable",
            "tbodyRes": "placeTableBody",
            "pagination": "#placePagination"
        };
    } else if (activeTabName == "Hazard") {
        selectors = {
            "thead": "#hazardTableTitle",
            "tbody": "#hazardTable",
            "tbodyRes": "#hazardTableBody",
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
            // When we get the result, clear the child elements of the table so that they're not
            // appended to existing rows
            angular.element(selectors['tbodyRes']).children().remove();
            angular.element('#loading').remove();
            countResults = result["count"];
            recordResults = result["record"];

            var attributeLinks = [];
            var tableBodyAttributes = [];

            showMap(recordResults);
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

                    if (Array.isArray(attr)) {
                        let linkArray = [];

                        for (let i = 0; i < attr.length; i++) {
                            linkArray.push('<a href="' + link[i] + '">' + attr[i] + "</a>")
                        }

                        cellHtml = linkArray.join(', ');
                    } else {
                        cellHtml = '<a href="' + link + '">' + attr + "</a>";
                    }

                    rowBodyHtml += "<td>" + cellHtml + "</td>";
                }

                if (activeTabName == "Place") {
                    var hazardCellHtml = addHazardsAttrToPlaceTab();
                    rowBodyHtml += "<td class = 'hazardIcons'>" + hazardCellHtml + "</td>";
                }

                var rowHtml = "<tr>" + rowBodyHtml + "</tr>";
                tableBody.append(rowHtml);
            });

            // showMap(recordResults);

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
        if (numPages < selectedPage) {
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

function showMap(recordResults) {
    // clear all the previous markers on the map
    if (place_markers) {
        place_markers.removeLayers(markers);
        markers = [];
    }

    var markerIndex = 0;
    recordResults.forEach(e => {
        if (e["wkt"]) {
            var wicket = new Wkt.Wkt();
            var center_lat = 0;
            var center_lon = 0;
            var count = 0;

            var coords = [];
            var wktString = "";
            var wktType = "";
            if (e["wkt"].includes("MULTIPOLYGON")) {
                wktType = "MULTIPOLYGON";
            } else if (e["wkt"].includes("POINT")) {
                wktType = "POINT";
            } else if (e["wkt"].includes("POLYGON")) {
                wktType = "POLYGON";
            }
            if (wktType) {
                wktString = e["wkt"].substring(e["wkt"].indexOf(wktType), e["wkt"].length);
                switch (wktType) {
                    case "POINT":
                        coords = [wicket.read(e["wkt"]).toJson().coordinates];
                        break
                    case "POLYGON":
                        coords = wicket.read(e["wkt"]).toJson().coordinates[0];
                        break
                    case "MULTIPOLYGON":
                        coords = wicket.read(e["wkt"]).toJson().coordinates[0][0];
                        break
                }
            }

            coords.forEach(coord => {
                count += 1;
                center_lat += coord[1];
                center_lon += coord[0];
            });

            if (count) {
                center_lat = center_lat / count;
                center_lon = center_lon / count;
                // L.circle([center_lat, center_lon], {
                //     color: "red",
                //     radius: 10000
                // }).addTo(resultsSearchMap);

                var keys = Object.keys(e).filter(attr => { return attr.indexOf("name") >= 0; });
                var vals = keys.map(key => {
                    val = e[key];
                    key = key.slice(0, 1).toUpperCase() + key.slice(1).toLowerCase();
                    return dd("span: " + key.replaceAll("_", " ") + ": " + val);
                });
                var concatDDs = function(rslt, e) {
                    if (rslt.length) {
                        return rslt.concat(dd("br"), e);
                    } else {
                        return [rslt, dd("br"), e];
                    }
                };
                // add range slider
                markerIndex += 1;
                var dds = vals.reduce(concatDDs);
                dds.push(dd("br"));
                // dds.push(dd("b: Please choose the value of the radius (km): "));
                // dds.push(dd("span.radius_value" + ":200"));
                // dds.push(dd("input.radius-range#radius_range_" + markerIndex, { "type": "range", "min": "100", "max": "5000", "value": "200" }));
                // dds.push(dd("br"));
                // dds.push(dd("button.btn.btn-primary#popup-query-btn:Query", { "type": "submit" }));
                let place_marker = new L.marker([center_lat, center_lon]).bindPopup(dd('.popup', dds));

                // add marker event listener
                // place_marker.on("click", function(ev) {
                //     if (!Object.keys(clickedMarker).length) {
                //         var index = markers.indexOf(ev.sourceTarget);
                //         clickedMarker["index"] = index;
                //         clickedMarker["marker"] = ev.sourceTarget;

                //         var domElement = angular.element(".results-table div.active .table-body-container table tbody tr")[index];
                //         clickedMarker["table-element"] = domElement;
                //         clickedMarker["pre-color"] = domElement.style.backgroundColor;
                //         domElement.style.backgroundColor = "pink";
                //     } else {
                //         if (clickedMarker["marker"] != ev.sourceTarget) {
                //             // reset the color on the table
                //             clickedMarker["table-element"].style.backgroundColor = clickedMarker["pre-color"];

                //             var index = markers.indexOf(ev.sourceTarget);
                //             clickedMarker["index"] = index;
                //             clickedMarker["marker"] = ev.sourceTarget;
                //             var domElement = angular.element(".results-table div.active .table-body-container table tbody tr")[index];
                //             clickedMarker["table-element"] = domElement;
                //             domElement.style.backgroundColor = "pink";
                //         }
                //     }

                //     // at this time, then find the slider in this marker.
                //     addSliderChangeListener(ev.sourceTarget.getLatLng());
                //     addPopupQueryButtonClickListener(ev.sourceTarget.getLatLng());
                // });
                // add marker popup remove listener
                place_marker.getPopup().on("remove", function() {
                    if (Object.keys(clickedMarker).length) {
                        clickedMarker["table-element"].style.backgroundColor = clickedMarker["pre-color"];
                        clickedMarker = {};
                    };

                    // also remove the circle on the layer
                    if (resultsSearchMap.hasLayer(circles)) {
                        resultsSearchMap.removeLayer(circles);
                    }
                });
                markers.push(place_marker);
                place_markers.addLayer(place_marker);
                resultsSearchMap.addLayer(place_markers);
            }
            coords = [];
        }
    });
    // zoom to fit all the markers in the map
    // if (markers.length > 0) {
    //     resultsSearchMap.fitBounds(new L.featureGroup(markers).getBounds());
    // }
}

/**
 * dynamically display the value of radius
 */
let circles;
var addSliderChangeListener = function(markerCoordinates) {
    var currentSlider = angular.element(".popup input.radius-range");

    // Circle with default radius
    var default_radius = 200;
    angular.element(".radius_value").each((e, v) => {
        default_radius = v.innerHTML;
    });

    circles = L.circle([markerCoordinates["lat"], markerCoordinates["lng"]], {
        color: "red",
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: default_radius * 1000
    }).addTo(resultsSearchMap);

    currentSlider.on("input", function($event) {
        var radius = $event.target.value;
        angular.element(".radius_value").each((e, v) => {
            v.innerHTML = radius;
        });

        // draw a circle
        if (resultsSearchMap.hasLayer(circles)) {
            resultsSearchMap.removeLayer(circles);
        }

        circles = L.circle([markerCoordinates["lat"], markerCoordinates["lng"]], {
            color: "red",
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: radius * 1000
        }).addTo(resultsSearchMap);
    });
}

// after choosing the coordinates, click the button, and collect the parameters for spatial query
var addPopupQueryButtonClickListener = function(markerCoordinates) {
    angular.element("#popup-query-btn").on("click", function() {
        var radius = 200;
        angular.element("input.radius-range").each((e, v) => { radius = v.value; });
    })

}


// add the icon and count for different hazard types in "Hazard column" in the place tab
var addHazardsAttrToPlaceTab = function() {
    var peopleCount = 5;
    var hurricaneCount = 1;
    var fireCount = 2;
    var earthquakeCount = 3;

    var peopleIconSrc = '../images/people-people-icon.svg';
    var hurricaneIconSrc = "../images/people-hurricane-icon.svg";
    var fireIconSrc = "../images/people-fire-icon.svg";
    var earthquakeIconSrc = "../images/people-earthquake-icon.svg";

    var cellHtml = "<ul id='place-hazard-count'>" +
        "<li><img src = '" + peopleIconSrc + "'></img><span class='IconCounter'>" + peopleCount + "</span><span class = 'tooltiptext people-tooltiptext'>People</span></li>" +
        "<li><img src = '" + hurricaneIconSrc + "'></img><span class='IconCounter'>" + hurricaneCount + "</span><span class = 'tooltiptext hurricane-tooltiptext'>Hurricane</span></li>" +
        "<li><img src = '" + fireIconSrc + "'></img><span class='IconCounter'>" + fireCount + "</span><span class = 'tooltiptext fire-tooltiptext'>Fire</span></li>" +
        "<li><img src = '" + earthquakeIconSrc + "'></img><span class='IconCounter'>" + earthquakeCount + "</span><span class = 'tooltiptext earthquake-tooltiptext'>Earthquake</span></li>" +
        "</ul>";
    return cellHtml;
}
var parameters = {};

var expertTitles = ["Name", "Affiliation", "Department", "Expertise", "Place"];
var placeTitles = ["Name", "Type"];
var hazardTitles = ["Name", "Type", "Place", "Date"];

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
        console.log(data);
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

    $scope.selectSubList = function($event) {
        let childListItems = $event.target.parentNode.nextElementSibling.children;
        for(let i=0; i< childListItems.length; i++) {
            console.log(childListItems[i].children);
        }
        // $event.target.parentNode.nextElementSibling.children.each(function(e) {
        //     console.log('here');
        // });
        //get neighbor list
        //for every input within that list
            //check the checkbox

        //$scope.selectHazard();
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

    return parameters;
};

var sendQueries = function(tabName, pageNum, recordNum, parameters) {
    angular.element("#ttl-results").html('Loading query...');
    switch(tabName) {
        case "Place":
            return getPlaceSearchResults(pageNum, recordNum, parameters);
        case "Hazard":
            return getHazardSearchResults(pageNum, recordNum, parameters);
        case "People":
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
                placeUrl = bcURL + '&region=' + urlVariables['uscd'];
                bcHTML += '<li><a href="' + placeUrl + '">US Climate Division: ' + urlVariables['uscd'] + '</a></li>';
            }
            if(urlVariables['nwz'] != null && urlVariables['nwz'] != '') {
                placeUrl = bcURL + '&region=' + urlVariables['nwz'];
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
            break;
        case "people":
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
            countResults = result["count"];
            recordResults = result["record"];

            var attributeLinks = [];
            var tableBodyAttributes = [];

            console.log(recordResults);
            recordResults.forEach(e => {
                var rowBodyHtml = "";
                if (selectors["thead"] == "#expertTableTitle") {
                    attributeLinks = [e["expert"], e["affiliation"], e["department"], e["expertise"], e["place"]];
                    tableBodyAttributes = [e["expert_name"], e["affiliation_name"], e["department_name"], e["expertise_name"], e["place_name"]];
                } else if (selectors["thead"] == "#placeTableTitle") {
                    attributeLinks = [e["place"], e["place_type"]];
                    tableBodyAttributes = [e["place_name"], e["place_type_name"]];
                } else if (selectors["thead"] == "#hazardTableTitle") {
                    attributeLinks = [e["hazard"], e["hazard_type"], e["place"], e["date"]];
                    tableBodyAttributes = [e["hazard_name"], e["hazard_type_name"], e["place_name"], e["date_name"]];
                };

                var numAttributes = attributeLinks.length;
                for (var index = 0; index < numAttributes; index++) {
                    var link = attributeLinks[index];
                    var attr = tableBodyAttributes[index];

                    var cellHtml = '<a target="_blank" href="' + link + '">' + attr + "</a>";

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
        if (numPages <= 10) {
            for (var page = 0; page < numPages; page++) {

                angular.element('<span class="page-item"></span>').text(page + 1).on('click', {
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
            //Build out pagination based on current selected page
            var selectedPage = (urlVariables['page'] != null && urlVariables['page'] != '') ? parseInt(urlVariables['page']) : 1;
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
        if(angular.element(paginationSelector + ' #page-number').length < 1) {
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

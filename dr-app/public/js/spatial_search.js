var startDate;
var endDate;
var parameters = {};

var expertTitles = ["Name", "Affiliation", "Department", "Expertise", "Place"];
var placeTitles = ["Name", "Type"];
var hazardTitles = ["Name", "Type", "Place", "Date"];

var activeTabName = "";
var loadedTabs = {};

var place_markers = new L.MarkerClusterGroup();
var markers = [];

var totalResults = 0;

kwgApp.controller("spatialSearchController", function($scope, $timeout) {
    // Show expertise, place, and hazard menu in the initial status
    $scope.showExpertiseList = true;
    $scope.showPlaceList = true;
    $scope.showHazardList = true;

    // show expertise, place, and hazard tab
    $scope.showPeopleTab = true;
    $scope.showPlaceTab = true;
    $scope.showHazardTab = true;

    // 1. Initialization: Display the expertise super topics, places, and hazard
    getFilters().then(function(data) {
        console.log("Data is loaded: ", data);

        // initialize the expertise super topics
        $scope.expertiseSupertopicUrls = Object.keys(data['Expertise']);
        $scope.getExpertiseLabel = function(expertiseSupertopicUrl) {
            return data['Expertise'][expertiseSupertopicUrl];
        };
        $scope.expertiseTopicShow = true;

        // initialize the place
        $scope.placeSupertopicUrls = Object.keys(data['Place']);
        $scope.getPlaceLabel = function(placeSupertopicUrl) {
            return data['Place'][placeSupertopicUrl];
        };

        // initialize the hazard
        $scope.hazardUrls = Object.keys(data['Hazard']);
        $scope.getHazardLabel = function(hazardUrl) {
            return data['Hazard'][hazardUrl];
        };
        $scope.$apply();
    });

    // data range initialization
    $('input[name="daterange"]').daterangepicker({
        opens: "right"
    }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        startDate = start.format('YYYY-MM-DD');
        endDate = end.format('YYYY-MM-DD');
    });

    // entire graph intialization
    init();

    // 2. select options of expertise, hide hazard
    var selectedElement = null;

    // 2.1. Select expertise and expand the subtopics 
    $scope.expertiseTopicShow = true; // show the super topics
    $scope.expertiseSubtopicShow = false; // hide the subtopics
    $scope.showSelectedExpertise = false; // hide the current selected supertopic
    $scope.selectExpertise = function($event) {
        // hide the hazard tab and hazard list
        $scope.showHazardList = !$scope.showHazardList;
        $scope.showHazardTab = !$scope.showHazardTab;
        // hide the supertopic list and show the subtopic list
        $scope.expertiseTopicShow = !$scope.expertiseTopicShow;
        $scope.expertiseSubtopicShow = !$scope.expertiseSubtopicShow;
        // display the corresponding subtopics 
        selectedElement = $event.target;
        console.log("select the supertopic: ", $event.target.value);
        var currentElement = $event.target.parentNode;
        var topicStr = currentElement.innerHTML.split(">")[1].trim();
        $scope.selectedExpertise = topicStr;
        console.log("selected expertise: ", topicStr);
        $scope.showSelectedExpertise = true;
        $scope.checkedExpertise = true;

        var addedHeight = 50;
        angular.element("#spatial-search").height(function(n, c) {
            return c + addedHeight;
        });
        console.log("selected, revised height is: ", angular.element("#spatial-search").height());

        var selectedTopicUrl = $event.target.value;
        var subtopics = getSubTopic(selectedTopicUrl);
        var expertiseSubtopics = null;
        subtopics.then(function(e) {
            expertiseSubtopics = e;
            // console.log("expertiseSubtopics: ", expertiseSubtopics);
        }).then(function() {
            $scope.expertiseSubtopics = expertiseSubtopics;
        }).then(function() {
            $scope.$apply();
        })

        // $timeout(function() {
        //     $scope.expertiseSubtopics = expertiseSubtopics;
        // }, 100);
        $scope.getSubtopicLabel = function(expertiseSubtopic) {
            return expertiseSubtopic.topic_label;
        };
        console.log("subtopic show: ", $scope.expertiseSubtopicShow);
        console.log("select the supertopic :", 　$scope.checkedExpertise);
    };
    $scope.unselectExpertise = function($event) {
        $scope.showHazardList = !$scope.showHazardList;
        $scope.showHazardTab = !$scope.showHazardTab;
        // set the selected topic invisible
        $scope.showSelectedExpertise = false;
        $scope.checkedExpertise = false;
        // come back to the previous display
        $scope.expertiseTopicShow = !$scope.expertiseTopicShow;
        $scope.expertiseSubtopicShow = !$scope.expertiseSubtopicShow;


        selectedElement.checked = false;
        selectedElement = null;

        var decreasedHeight = 50;
        angular.element("#spatial-search").height(function(n, c) {
            return c - decreasedHeight;
        });
        console.log("unselected , revised height is :", angular.element("#spatial-search").height());
        console.log("unselect the supertopic :", 　$scope.checkedExpertise);
    };

    // 2.2. select options of hazard, hide expertise
    $scope.selectHazard = function($event) {
        var checkedItems = angular.element("ul#hazard-list li input:checked");
        if (checkedItems.length) {
            $scope.showExpertiseList = false;
            $scope.showPeopleTab = false;
        } else {
            $scope.showExpertiseList = true;
            $scope.showPeopleTab = true;
        }

        // select hazard and interact with the backend, search for it
        console.log("selected hazard");
        displayActiveTab();

    };

    // 3. Interaction with the backend
    // 3.1 select subtopic of the expertise, search for it
    $scope.selectSubTopic = function($event) {
        console.log("selected expertise");
        displayActiveTab();
    };

    // 3.2 select place, search for it
    $scope.selectPlaceSupertopic = function($event) {
        console.log("selected place");
        displayActiveTab();
    };

    // 4. click on tab
    $scope.clickTab = function($event) {
        var newActiveTabName = "";
        var innerHTML = $event.target.innerHTML;
        if (innerHTML.indexOf("People") != -1) {
            newActiveTabName = "Expert";
        } else if (innerHTML.indexOf("Place") != -1) {
            newActiveTabName = "Place";
        } else if (innerHTML.indexOf("Hazard") != -1) {
            newActiveTabName = "Hazard";
        }
        console.log("clicked tab: ", newActiveTabName);
        newParameters = getParameters();
        console.log("different from the previous parameters: ", JSON.stringify(newParameters) == JSON.stringify(parameters));
        activeTabName = newActiveTabName;

        if (JSON.stringify(newParameters) != JSON.stringify(parameters)) {
            loadedTabs = {};
            parameters = newParameters;

            loadedTabs[activeTabName] = true;

            var response = sendQueries(activeTabName, 1, 50, parameters);
            var selectors = displayTableByTabName(activeTabName, response);
            // console.log("current params: ", params);
            response.then(function(e) {
                var key = Object.keys(e)[0];
                var val = e[key];
                val.then(function(result) {
                    console.log("result: ", result);
                    var countResults = result["count"];
                    displayPagination(activeTabName, selectors, countResults, parameters);
                });

            });
        } else {
            console.log("check if it's loaded or not:", loadedTabs[activeTabName]);
            // if the parameters are the same, then consider about the tab
            if (loadedTabs[activeTabName]) {
                // if the current tab is already loaded
                console.log("the clicked tab is already loaded");
            } else {
                var response = sendQueries(activeTabName, 1, 50, parameters);
                var selectors = displayTableByTabName(activeTabName, response);
                // console.log("current params: ", params);
                response.then(function(e) {
                    var key = Object.keys(e)[0];
                    var val = e[key];
                    val.then(function(result) {
                        console.log("result: ", result);
                        var countResults = result["count"];
                        displayPagination(activeTabName, selectors, countResults, parameters);
                    });

                });
                loadedTabs[activeTabName] = true;
            }
        }

    };


});



kwgApp.controller("filters-controller", function($scope) {});

kwgApp.controller("results-controller", function($scope) {});

kwgApp.controller("spatialmap-controller", function($scope) {});

var init = function() {
    setTimeout(() => {
        // -77.036667, lng: 38.895
        // [40, -109.03]
        spatialQueryMap = L.map('spatial-search-map').setView([36.895, -95.036667], 4);
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zS24k9i8nVWbUmI9ngCZ', {
            tileSize: 512,
            zoomOffset: -1,
            minZoom: 1,
            attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
            crossOrigin: true
        }).addTo(spatialQueryMap);

        // var latlngs = [
        //     [37, -109.05],
        //     [41, -109.03],
        //     [41, -102.05],
        //     [37, -102.04]
        // ];
        // var polygon = L.polygon(latlngs).addTo(spatialQueryMap);
        // var point = L.circle([38.895, -77.036667], {
        //     color: '#DF6C37',
        //     fillColor: '#DF6C37',
        //     fillOpacity: 0.5,
        //     radius: 500
        // }).addTo(spatialQueryMap);
        // console.log(point);
    }, 200);
    displayActiveTab();
}

// prepare the parameters
var getParameters = function() {
    var keyword = "";
    var expertiseTopics = [];
    var expertiseSubtopics = [];
    var places = [];
    var hazards = [];

    keyword = angular.element("#spatial-search .left-filters .search-dropdown-input input").val();
    angular.element("li#expertise ul.list-group input:checkbox[name='expertiseSuperTopic']:checked").each((index, supertopics) => {
        expertiseTopics.push(supertopics.value);
    });
    angular.element("li#expertise ul.list-group input:checkbox[name='expertiseSubtopic']:checked").each((index, subtopics) => {
        expertiseSubtopics.push(JSON.parse(subtopics.value).topic);
    });
    angular.element("li#place ul.list-group input:checkbox[name='placeTopic']:checked").each((index, place) => {
        places.push(place.value);
    });
    angular.element("li#hazard ul.list-group input:checkbox[name='hazard']:checked").each((index, hazard) => {
        hazards.push(hazard);
    });

    // console.log("expertiseTopics: ", expertiseTopics);
    // console.log("expertise Subtopics: ", expertiseSubtopics);
    // console.log("places: ", places);
    // console.log("hazards: ", hazards);


    if (!startDate) {
        startDate = "2020-01-01";
    }
    if (!endDate) {
        endDate = "2021-12-25";
    }
    var start_year = startDate.split("-")[0];
    var start_month = startDate.split("-")[1];
    var start_date = startDate.split("-")[2];

    var end_year = endDate.split("-")[0];
    var end_month = endDate.split("-")[1];
    var end_date = endDate.split("-")[2];
    // console.log("start year: ", start_year, ", start_month: ", start_month, ", start_date", start_date,
    //     ", end_year: ", end_year, ", end_month: ", end_month, ", end_date: ", end_date);

    return {
        "keyword": keyword,
        "expertiseTopics": expertiseTopics,
        "expertiseSubtopics": expertiseSubtopics,
        "places": places,
        "hazards": hazards,
        "start_year": start_year,
        "start_month": start_month,
        "start_date": start_date,
        "end_year": end_year,
        "end_month": end_month,
        "end_date": end_date
    };

};

var sendQueries = function(tabName, pageNum, recordNum, parameters) {
    var response = getFullTextSearchResult(tabName, pageNum, recordNum,
        parameters["keyword"],
        parameters["expertiseTopics"], parameters["expertiseSubtopics"],
        parameters["places"], parameters["hazards"],
        parameters["start_year"], parameters["start_month"], parameters["start_date"],
        parameters["end_year"], parameters["end_month"], parameters["end_date"]);
    return response;
}

// for initial status, click facets
var displayActiveTab = function() {
    // find the active tab
    // var activeTabName = "";
    var activeElement = angular.element(".results-table #pills-tabContent div.active");
    var activeElementID = activeElement[0].id;
    if (activeElementID.endsWith("people")) {
        console.log("current active tab is people");
        activeTabName = "Expert";
    } else if (activeElementID.endsWith("place")) {
        console.log("current active tab is place");
        activeTabName = "Place";
    } else if (activeElementID.endsWith("hazard")) {
        console.log("current active tab is hazard");
        activeTabName = "Hazard";
    };

    // get all the parameters
    var newParameters = getParameters();
    console.log("if the parameters have been changed: ", JSON.stringify(parameters) == JSON.stringify(newParameters));
    var response;
    if (JSON.stringify(parameters) != JSON.stringify(newParameters)) {
        loadedTabs = {};
        parameters = newParameters;

        // send queries to the current active tab
        response = sendQueries(activeTabName, 1, 50, parameters);
        console.log("response is: ", response);

        // get the count of records and display them in the table
        var selectors = displayTableByTabName(activeTabName, response);
        console.log("current params: ", selectors);
        response.then(function(e) {
            var key = Object.keys(e)[0];
            var val = e[key];
            val.then(function(result) {
                console.log("result: ", result);
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
    console.log("current active tab is : ", activeTabName);
    if (activeTabName == "Expert") {
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
        console.log("selectors: ", selectors);
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
        response.then(function(e) {
            var key = Object.keys(e)[0];
            var val = e[key];
            val.then(function(result) {
                console.log("result: ", result);
                countResults = result["count"];
                recordResults = result["record"];

                console.log("recordResults: ", recordResults);
                var attributeLinks = [];
                var tableBodyAttributes = [];

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
                        rowBodyHtml += "<td>" + '<a target="_blank" href="' + link + '">' + attr + "</a></td>";
                    }

                    var rowHtml = "<tr>" + rowBodyHtml + "</tr>";
                    tableBody.append(rowHtml);
                })

            }).then(function() {

                // console.log("selector pagination: ", angular.element("div.per-page"));
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
                //     console.log("changed the reocrds of per page here: ", recordsPerpage);

                //     tablePagination(selectors["tbody"], selectors["pagination"], countResults, recordsPerpage);
                // })
            });

            // console.log("val-->", val);
            // console.log("active Name: ", activeTabName);
            displayMap(val, activeTabName);

        });
    }
    return selectors;
};

var displayPagination = function(activeTabName, selectors, countResults, parameters) {
    console.log("selector pagination: ", angular.element("div.per-page"));
    angular.element(selectors["pagination"]).empty();
    var perPage = angular.element('<div class="dropdown per-page">\
                    <select class="dropdown-menu" aria-labelledby="dropdownMenuButton" [ng-model]="perpage" (ngModelChange)="onChange($event)">\
                        <option value="50" selected="selected">50 Per Page</option>\
                        <option value="100">100 Per Page</option>\
                        <option value="200">200 Per Page</option>\
                    </select>\
                </div>');

    perPage.appendTo(selectors["pagination"]);
    tablePagination(activeTabName, selectors["tbody"], selectors["pagination"], countResults, 50, parameters);
    angular.element(selectors["pagination"] + " .per-page select").on("change", function() {
        var recordsPerpage = angular.element(this).val();
        console.log("changed the reocrds of per page here: ", recordsPerpage);
        console.log("parameters: ", parameters);
        // recalculate the pages
        tablePagination(activeTabName, selectors["tbody"], selectors["pagination"], countResults, recordsPerpage, parameters);
        var response = sendQueries(activeTabName, 1, recordsPerpage, parameters);
        displayTableByTabName(activeTabName, response)
        console.log("after changing the recordsPerpage, response is: ", response);
    });
}


var tablePagination = function(activeTabName, selector, paginationSelector, totalRecords, numPerPage, parameters) {
    angular.element(selector).each(function() {
        var currentPage = 0;
        var $table = angular.element(this);
        $table.on('repaginate', function() {
            console.log("repaginate");
        });

        var numPages = Math.ceil(totalRecords / numPerPage);
        console.log("num rows:", totalRecords, ", total pages: ", numPages);

        if (angular.element(paginationSelector + 　" div.pager")) {
            angular.element(paginationSelector + " div.pager").remove();
        }

        var $pager = angular.element('<div class="pager"></div>');
        if (numPages <= 5) {
            for (var page = 0; page < numPages; page++) {

                angular.element('<span class="page-item"></span>').text(page + 1).on('click', {
                    newPage: page
                }, function(event) {
                    currentPage = event.data['newPage'];
                    angular.element(this).addClass("active").siblings().removeClass("active");
                    console.log("clicked the page: ", currentPage);

                    // click event
                    var response = sendQueries(activeTabName, currentPage + 1, numPerPage, parameters);
                    console.log("click reponse: ", response);
                    displayTableByTabName(activeTabName, response)

                }).appendTo($pager).addClass("clickable");

                console.log("pager: ", $pager);
            }
        } else {
            // the first 3 pages
            for (page = 0; page < 3; page++) {

                angular.element('<span class="page-item"></span>').text(page + 1).on('click', {
                    newPage: page
                }, function(event) {
                    currentPage = event.data['newPage'];

                    angular.element(paginationSelector + " div.pager button").val(currentPage + 1);
                    angular.element(this).addClass("active").siblings().removeClass("active");

                    console.log("clicked the page2: ", currentPage);

                    // click event
                    var response = sendQueries(activeTabName, currentPage + 1, numPerPage, parameters);
                    displayTableByTabName(activeTabName, response);
                    console.log("click reponse: ", response);


                }).appendTo($pager).addClass("clickable");
            }

            // page (...)
            angular.element('<span class="page-item"></span>').text("...").appendTo($pager).addClass("clickable");
            // page (last page)
            angular.element('<span class="page-item"></span>').text(numPages).on('click', {
                newPage: numPages - 1
            }, function(event) {
                currentPage = event.data['newPage'];

                angular.element(this).addClass("active").siblings().removeClass("active");

                //  click event
                var response = sendQueries(activeTabName, currentPage + 1, numPerPage, parameters);
                displayTableByTabName(activeTabName, response);
            }).appendTo($pager).addClass("clickable");

            angular.element('<button class="page-item"></button>').val(currentPage + 1).text("Next").on('click', function(event) {
                console.log("clicked the button, then the current page is:", angular.element(this).val());
                var nextPage = parseInt(angular.element(this).val()) + 1;
                console.log("then the next page is : ", nextPage);
                angular.element(this).val(nextPage);

                var pages = angular.element(paginationSelector + " div.pager span");
                pages.each(function(e) {
                    var innerHTML = this.innerHTML;
                    if (nextPage + "" == innerHTML) {
                        $(this).addClass("active").siblings().removeClass("active");
                    }
                });

                if (nextPage > 3) {
                    angular.element(paginationSelector + " div.pager span").removeClass("active");
                }

                currentPage = nextPage;
                console.log("currentPage: ", currentPage);
                //  click event
                var response = sendQueries(activeTabName, currentPage, numPerPage, parameters);
                displayTableByTabName(activeTabName, response);
            }).appendTo($pager).addClass("clickable");
        }

        $pager.appendTo(paginationSelector).find("span.page-item:first").addClass("active");
    });
}

function displayMap(fullTextResults, tabName) {
    console.log("get the fullTextResults to display, ", fullTextResults, tabName);
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
        console.log("here the place is ", place);

        if (place) {
            // var polygon = L.polygon(latlngs).addTo(spatialQueryMap);
            console.log("current map is :", spatialQueryMap);
            var wicket = new Wkt.Wkt();
            var center_lat = 0;
            var center_lon = 0;
            var count = 0;
            place.forEach(e => {
                // console.log("current elements: ", e);
                if (e["place_geometry_wkt"]) {
                    count += 1;
                    var coords = wicket.read(e["place_geometry_wkt"]).toJson().coordinates;
                    console.log("geometry: ", coords);
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
                console.log("count is : ", count);

                spatialQueryMap.panTo(new L.LatLng(center_lat, center_lon));
                place_markers.addTo(spatialQueryMap);
            } else {
                console.log("there is no returned locations");
            }
        }


    });


}
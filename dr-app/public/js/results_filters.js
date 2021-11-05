kwgApp.controller("filters-controller", function($scope, $timeout) {
    // Topics
    $scope.expertiseTopics = [
        "Biology Topic Group",
        "Computer Science Topic Group",
        "Data Science Topic Group",
        "Demography Topic Group",
        "Disaster Response Topic Group",
        "Disease Topic Group",
        "Ecology Topic Group",
        "Education Topic Group",
        "Epidemiology Topic Group",
        "Geography Topic Group",
        "Hazard Topic Group"
    ];
    $scope.places = [
        "City",
        "County",
        "Marine",
        "NWS Zone",
        "State",
        "Marine1",
        "NWS Zone1",
        "State1"
    ];
    $scope.hazards = [
        "Astronomoical Low Tide",
        "Avalanche",
        "Blizzard",
        "Coastal Flood",
        "Cold/Wind Chill",
        "Debris Flow",
        "Dense Fog",
        "Dense Smoke",
        "Drought",
        "Dust Devil",
        "Dust Storm1",
        "Dust Devil2",
        "Dust Storm2",
        "Dust Devil3",
        "Dust Storm3"
    ];
    $scope.individuals = [
        "Filter Title",
        "Filter Title1",
        "Filter Title2",
        "Filter Title3",
        "Filter Title4",
        "Filter Title5",
        "Filter Title6",
        "Filter Title7",
        "Filter Title8",
        "Filter Title9",
        "Filter Title10",
        "Filter Title11"
    ];

    // subtopics
    $scope.expertiseSubtopics = [
        "topic1", "topic2", "topic3", "topic4",
        "topic5", "topic6", "topic7", "topic8",
        "topic9", "topic10", "topic11", "topic12",
        "topic13", "topic14", "topic15"
    ];
    $scope.subPlaces = [
        "place1", "place2", "place3", "place4",
        "place5", "place6", "place7", "place8"
    ];




    // Add click event for the Expertise Topic
    // -1. Hide the selected topic
    // -2. Select the topic and then display the subtopics
    $scope.showSelectedExpertise = false;
    $scope.expertiseTopicShow = true;
    $scope.expertiseSubtopicShow = false;

    var selectedElement = null; // accept the element clicked

    $scope.selectExpertise = function($event) {
        // when click the topic: hide the topic and display the subtopic
        $scope.expertiseTopicShow = !$scope.expertiseTopicShow;
        $scope.expertiseSubtopicShow = !$scope.expertiseSubtopicShow;

        // get content from the current selected element
        selectedElement = $event.target;
        console.log("selected checkbox: ", $event.target.value);
        var currentElement = $event.target.parentNode;
        var topicStr = currentElement.innerHTML.split(">")[1].trim();
        $scope.selectedExpertise = topicStr;
        console.log("selected expertise: ", topicStr);

        // set the selected topic visible
        $scope.showSelectedExpertise = true;
        $scope.checkedExpertise = true;

        // reset the height of the main container 
        // .filters .filter div.selectedItem p{
        //     margin-top: 20px;
        //     margin-bottom: 16px;
        // }
        var addedHeight = 70;
        $("#results-filters").height(function(n, c) {
            return c + addedHeight;
        });
        console.log("revised height: ", $("#results-filters").height());


        var selectedTopicUrl = $event.target.value;
        var results = getSubTopic(selectedTopicUrl);
        var data = null;
        results.then(function(e) {
            data = e;
        });
        $timeout(function() {
            console.log("data: ", data);
            $scope.expertiseSubtopics = data;
        }, 100);
        $scope.getSubtopicLabel = function(expertiseSubtopic) {
            return expertiseSubtopic.topic_label;
        }





    };
    $scope.unselectExpertise = function() {
        // set the selected topic invisible
        $scope.showSelectedExpertise = false;
        $scope.checkedExpertise = false;

        // come back to the previous display
        $scope.expertiseTopicShow = !$scope.expertiseTopicShow;
        $scope.expertiseSubtopicShow = !$scope.expertiseSubtopicShow;

        // selectedElement.checkedExpertise = false;
        selectedElement.checked = false;
        selectedElement = null;

        // reset the height of the main container
        var decreasedHeight = 70;
        $("#results-filters").height(function(n, c) {
            return c - decreasedHeight;
        });
        console.log("revised height: ", $("#results-filters").height());
    };

    // Add click event for the Place Topic
    $scope.showSelectedPlace = false;
    $scope.placesTopicShow = true;
    $scope.placeSubtopicShow = false;

    var selectedPlace = null
    $scope.selectPlace = function($event) {
        $scope.placesTopicShow = !$scope.placesTopicShow;
        $scope.placeSubtopicShow = !$scope.placeSubtopicShow;

        console.log($scope.placeSubtopicShow);
        selectedPlace = $event.target;
        var currentPlace = selectedPlace.parentNode;
        var placeStr = currentPlace.innerHTML.split(">")[1].trim();
        $scope.selectedPlace = placeStr;
        console.log("selected place: ", placeStr);

        $scope.showSelectedPlace = true;
        $scope.checkedPlace = true;


        var addedHeight = 70;
        $("#results-filters").height(function(n, c) {
            return c + addedHeight;
        });
        console.log("revised height: ", $("#results-filters").height());


        var selectedPlaceUrl = $event.target.value;
        var results = getPlaceInstance(selectedPlaceUrl);
        var data = null;
        results.then(function(e) {
            data = e;
        });
        $timeout(function() {
            console.log("data: ", data);
            $scope.subPlaces = data;
        }, 500);

        $scope.getSubplaceLabel = function(subPlace) {
            return subPlace.place_label;
        }

    };
    $scope.unselectPlace = function() {
        $scope.showSelectedPlace = false;
        $scope.checkedPlace = false;

        $scope.placesTopicShow = !$scope.placesTopicShow;
        $scope.placeSubtopicShow = !$scope.placeSubtopicShow;

        selectedPlace.checked = false;
        selectedPlace = null;

        var decreaseHeight = 70;
        $("#results-filters").height(function(n, c) {
            return c - decreaseHeight;
        });
        console.log("revised height: ", $("#results-filters").height());
    };


    /*************Right menu******************/
    $scope.clickButton = function($event) {
        console.log($event.target);
    };

    // add expertise topics

    $scope.supertopicsUrls = Object.keys(h_superTopics);
    $scope.getLabel = function(supertopicUrl) {
        return h_superTopics[supertopicUrl];
    };

    // add place topics
    $scope.placeSupertopicsUrls = Object.keys(h_placeTypes);
    $scope.getPlaceLabel = function(placeSupertopicUrl) {
        return h_placeTypes[placeSupertopicUrl];
    }

    // add hazard topics
    $scope.hazardsUrls = Object.keys(h_hazardTypes);
    $scope.getHazardLabel = function(hazardUrl) {
        return h_hazardTypes[hazardUrl];
    };

    // emit the event values to the parent controller
    // $scope.getData = function() {
    // var keyword = angular.element("#spatial-search .left-filters .search-dropdown-input input").val();
    // var expertiseTopics = [];
    // var expertiseSubtopics = [];
    // var places = [];
    // var subplaces = [];
    // var hazards = [];
    // var startYear = 2010;
    // var endYear = 2020;
    // $("li#expertise ul.list-group input:checkbox[name='expertiseTopic']:checked").each(function(i) {
    //     expertiseTopics.push($(this).val());
    // });
    // $("li#expertise ul.list-group input:checkbox[name='expertiseSubtopic']:checked").each(function(i) {
    //     expertiseSubtopics.push($.parseJSON($(this).val()).topic);

    // });
    // $("li#place ul.list-group input:checkbox[name='placeTopic']:checked").each(function(i) {
    //     places.push($(this).val())
    // });
    // $("li#place ul.list-group input:checkbox[name='subplace']:checked").each(function(i) {
    //     subplaces.push($.parseJSON($(this).val()).place);
    // });
    // $("li#hazard ul.list-group input:checkbox[name='hazard']:checked").each(function(i) {
    //     hazards.push($(this).val())
    // });
    // var startYearInput = $("li#datarange-li input:text[name='start-year']").val();
    // var endYearInput = $("li#datarange-li input:text[name='end-year']").val();
    // if (startYearInput) {
    //     startYear = startYearInput;
    // }

    // if (endYearInput) {
    //     endYear = endYearInput;
    // }
    // $scope.parameters = {
    //     "keyword": keyword,
    //     "hazards": hazards,
    //     "startYear": startYear,
    //     "endYear": endYear
    // };
    // if (expertiseTopics.length) {
    //     $scope.parameters["expertise"] = expertiseTopics[0];
    //     $scope.parameters["expertiseSubtopics"] = expertiseSubtopics;
    // } else {
    //     $scope.parameters["expertise"] = "";
    //     $scope.parameters["expertiseSubtopics"] = [];
    // }
    // if (places.length) {
    //     $scope.parameters["place"] = places[0];
    //     $scope.parameters["subplaces"] = subplaces;
    // } else {
    //     $scope.parameters["place"] = "";
    //     $scope.parameters["subplaces"] = [];
    // }

    // console.log("clicked the search button: .....");
    // console.log($scope.parameters);


    // var data = $scope.parameters;
    // $scope.fullTextSrchresults = getFullTextSearchResult(data.keyword, data.expertiseSubtopics, data.subplaces, data.hazards, data.startYear, data.endYear);
    // $scope.$emit("clickedSearch", $scope.fullTextSrchresults);
    // console.log("result is : ", fullTextSrchresults);
    // }





});

kwgApp.controller("results-controller", function($scope, $compile, $timeout) {
    $scope.totalResultsNumber = 2141;
    // $scope.$on('change', function(event, data) {
    //     $scope.item = data;
    //     console.log("received the table content : ", $scope.item);


    //     $scope.tableTitles = Object.keys($scope.item[0]).filter(function(e) {
    //         return e != "$$hashKey";
    //     });
    //     console.log("titles: ", $scope.tableTitles);
    //     var insertedTitleInfo = '<th ng-repeat = "title in tableTitles">{{title}}</th>'
    //     var title = $compile(insertedTitleInfo)($scope);
    //     angular.element("#hazardTableTitle thead tr").empty();
    //     angular.element("#hazardTableTitle thead tr").append(title);


    //     var inseredBodyInfo = '<tr ng-repeat = "e in item">' +
    //         '<td ng-repeat = "value in e">{{value}}</td>'
    //     '</tr>';
    //     var body = $compile(inseredBodyInfo)($scope);
    //     console.log(body);
    //     angular.element("#hazardTableBody tbody").empty();
    //     angular.element("#hazardTableBody tbody").append(body);
    // });

    $scope.$on("fullTextSearchRlts", function($scope, data) {

        var hazard = null;

        // console.log("received the fullTextSearchRlts!");
        // console.log($scope.fullTextSrchresults);
        // $scope.item = data;





        // console.log("titles: ", $scope.tableTitles);
        // var insertedTitleInfo = '<th ng-repeat = "title in tableTitles">{{title}}</th>'
        // var title = $compile(insertedTitleInfo)($scope);
        // angular.element("#hazardTableTitle thead tr").empty();
        // angular.element("#hazardTableTitle thead tr").append(title);


        // var inseredBodyInfo = '<tr ng-repeat = "e in item">' +
        //     '<td ng-repeat = "value in e">{{value}}</td>'
        // '</tr>';
        // var body = $compile(inseredBodyInfo)($scope);
        // console.log(body);
        // angular.element("#hazardTableBody tbody").empty();
        // angular.element("#hazardTableBody tbody").append(body);
    });



});

kwgApp.controller("pagination-controller", function($scope, $http) {
    // var vm = this;
    // // vm.dummyItems = [...Array(100).keys()];
    // vm.pager = {};
    // vm.dummyItems = [];

    // $http.get("../pages/data.json").success(function(data) {
    //     vm.dummyItems = data;
    //     console.log(vm.dummyItems);
    //     initController()
    //     $scope.clickPage = function(index) {
    //         console.log("this is pagination");
    //         var pagers = document.querySelectorAll(".rlts-pagination .pagination li.page-item");
    //         var activePage = null
    //         pagers.forEach(function(page) {
    //             var attr = page.getAttribute("class");
    //             if (attr.indexOf("active") != -1) {
    //                 activePage = page;
    //             }
    //         });

    //         if (activePage) {
    //             activePage.classList.remove("active");
    //         }

    //         var clickedPage = pagers[index - 1];
    //         clickedPage.classList.add("active");

    //         setPage(index);
    //         console.log("onclick:");
    //         $scope.$emit('change', $scope.item);
    //     }
    // });





    // function initController() {
    //     vm.pager = getPager(vm.dummyItems.length, 1);
    //     $scope.item = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    //     // console.log("initial: ");
    //     $scope.$emit('change', $scope.item);
    // }

    // function getPager(totalItems, currentPage, pageSize) {
    //     var defaultPageSize = 12
    //     currentPage = currentPage || 1;
    //     pageSize = pageSize || defaultPageSize;
    //     var totalPages = Math.ceil(totalItems / pageSize);

    //     var startPage, endPage;
    //     startPage = 1;
    //     endPage = totalPages;
    //     // if (totalPages <= defaultPageSize) {
    //     //     startPage = 1;
    //     //     endPage = totalPages;
    //     // } else {
    //     //     if (currentPage <= 6) {
    //     //         startPage = 1;
    //     //         endPage = defaultPageSize;

    //     //     } else if (currentPage + 4 >= totalPages) {
    //     //         startPage = totalPages - 9;
    //     //         endPage = totalPages;
    //     //     } else {
    //     //         startPage = currentPage - 5;
    //     //         endPage = currentPage + 4;
    //     //     }
    //     // }

    //     var startIndex = (currentPage - 1) * pageSize;
    //     var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    //     var pages = []
    //     for (var i = startPage; i < endPage + 1; i++) {
    //         pages.push(i);
    //     }
    //     return {
    //         totalItems: totalItems,
    //         currentPage: currentPage,
    //         pageSize: pageSize,
    //         totalPages: totalPages,
    //         startPage: startPage,
    //         endPage: endPage,
    //         startIndex: startIndex,
    //         endIndex: endIndex,
    //         pages: pages
    //     };
    // };

    // function setPage(page) {
    //     // console.log("clicked");
    //     if (page < 1 || page > vm.pager.totalPages) {
    //         return;
    //     }
    //     vm.pager = getPager(vm.dummyItems.length, page);
    //     $scope.item = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    //     console.log("clicked one page");
    //     console.log($scope.item);
    // }



});

kwgApp.controller("spatialmap-controller", function($scope) {


    $(document).ready(function() {
        setTimeout(() => {
            var map = L.map('spatial-search-map').setView([40, -109.03], 5);
            L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zS24k9i8nVWbUmI9ngCZ', {
                tileSize: 512,
                zoomOffset: -1,
                minZoom: 1,
                attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
                crossOrigin: true
            }).addTo(map);

            var latlngs = [
                [37, -109.05],
                [41, -109.03],
                [41, -102.05],
                [37, -102.04]
            ];
            var polygon = L.polygon(latlngs).addTo(map);
        }, 200);
    });
});
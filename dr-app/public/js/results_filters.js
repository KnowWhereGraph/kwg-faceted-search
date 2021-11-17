kwgApp.controller("filters-controller", function($scope, $timeout) {
    // Topics
    $scope.expertiseTopics = [];
    $scope.places = [];
    $scope.hazards = [];
    $scope.individuals = [];

    // subtopics
    $scope.expertiseSubtopics = [];
    $scope.subPlaces = [];

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
        var addedHeight = 50;
        $("#spatial-search").height(function(n, c) {
            return c + addedHeight;
        });
        console.log("revised height: ", $("#spatial-search").height());


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
        var decreasedHeight = 50;
        $("#spatial-search").height(function(n, c) {
            return c - decreasedHeight;
        });
        console.log("revised height: ", $("#spatial-search").height());
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


        var addedHeight = 50;
        $("#spatial-search").height(function(n, c) {
            return c + addedHeight;
        });
        console.log("revised height: ", $("#spatial-search").height());


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

        var decreaseHeight = 50;
        $("#spatial-search").height(function(n, c) {
            return c - decreaseHeight;
        });
        console.log("revised height: ", $("#spatial-search").height());
    };


    /*************Right menu******************/
    $scope.clickButton = function($event) {
        console.log($event.target);
    };

    // add expertise topics

    getFilters().then(function (data){
        $scope.supertopicsUrls = Object.keys(data['Expertise']);
        $scope.getLabel = function(supertopicUrl) {
            return data['Expertise'][supertopicUrl];
        };
    
        // add place topics
        $scope.placeSupertopicsUrls = Object.keys(data['Place']);
        $scope.getPlaceLabel = function(placeSupertopicUrl) {
            return data['Place'][placeSupertopicUrl];
        }
    
        // add hazard topics
        $scope.hazardsUrls = Object.keys(data['Hazard']);
        $scope.getHazardLabel = function(hazardUrl) {
            return data['Hazard'][hazardUrl];
        };
        $scope.$apply();
    });







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

;
kwgApp.controller("spatialmap-controller", function($scope) {



});
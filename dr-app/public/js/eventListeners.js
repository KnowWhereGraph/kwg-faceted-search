var spatialQueryMap
$(document).ready(function() {
    setTimeout(() => {
        // -77.036667, lng: 38.895
        // [40, -109.03]
        spatialQueryMap = L.map('spatial-search-map').setView([38.895, -77.036667], 5);
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
});

function getData() {
    var fullTextResults = getParametersByClick();
    displayTables(fullTextResults);
    displayMap(fullTextResults);
}


function getParametersByClick() {
    // get parameters
    var expertiseTopics = [];
    var expertiseSubtopics = [];
    var places = [];
    var subplaces = [];
    var hazards = [];
    var startYear = 2010;
    var endYear = 2020;
    var keyword = "";

    keyword = $("#spatial-search .left-filters .search-dropdown-input input").val();

    $("li#expertise ul.list-group input:checkbox[name='expertiseTopic']:checked").each(function(i) {
        expertiseTopics.push($(this).val());
    });
    $("li#expertise ul.list-group input:checkbox[name='expertiseSubtopic']:checked").each(function(i) {
        expertiseSubtopics.push($.parseJSON($(this).val()).topic);

    });


    $("li#place ul.list-group input:checkbox[name='placeTopic']:checked").each(function(i) {
        places.push($(this).val())
    });
    $("li#place ul.list-group input:checkbox[name='subplace']:checked").each(function(i) {
        subplaces.push($.parseJSON($(this).val()).place);
        console.log("***here****");
        console.log($.parseJSON($(this).val()).place);
    });


    $("li#hazard ul.list-group input:checkbox[name='hazard']:checked").each(function(i) {
        hazards.push($(this).val())
    });

    // console.log("expertiseTopics: ", expertiseTopics);
    // console.log("expertiseSubtopics: ", expertiseSubtopics);
    // console.log("places: ", places);
    // console.log("subplaces: ", subplaces);
    // console.log("hazards: ", hazards);


    var startYearInput = $("li#datarange-li input:text[name='start-year']").val();
    var endYearInput = $("li#datarange-li input:text[name='end-year']").val();

    if (startYearInput) {
        startYear = startYearInput;
    }

    if (endYearInput) {
        endYear = endYearInput;
    }

    // console.log("star year: ", startYear, "- end year: ", endYear);
    var parameters = {
        "hazards": hazards,
        "startYear": startYear,
        "endYear": endYear
    };
    if (expertiseTopics.length) {
        parameters["expertise"] = expertiseTopics[0];
        parameters["expertiseSubtopics"] = expertiseSubtopics;
    }
    if (places.length) {
        parameters["place"] = places[0];
        parameters["subplaces"] = subplaces;
    }

    console.log("parameters: ", parameters);

    var fullTextResults = getFullTextSearchResult(keyword, expertiseSubtopics, subplaces, hazards, startYear, endYear);

    return fullTextResults;
}


function displayTables(fullTextResults) {
    console.log("get the fullTextResults");
    fullTextResults.then(function(e) {
        console.log("e->", e);
        var expert = e.Expert;
        var hazard = e.Hazard;
        var place = e.Place;
        console.log("expert: ", expert);
        console.log("hazard: ", hazard);
        console.log("place: ", place);
        var expertTableHeadSelectors = {
            "thead": "#expertTableTitle",
            "tbody": "#expertTableBody",
            "pagination": "#expertPagination"
        };
        var placeTableHeadSelectors = {
            "thead": "#placeTableTitle",
            "tbody": "#placeTableBody",
            "pagination": "#placePagination"
        };

        var hazardTableHeadSelectors = {
            "thead": "#hazardTableTitle",
            "tbody": "#hazardTableBody",
            "pagination": "#hazardPagination"
        };
        displayTable(expertTableHeadSelectors, expert);
        displayTable(placeTableHeadSelectors, place);
        displayTable(hazardTableHeadSelectors, hazard);

    });
}

function displayTable(selectors, optionPromise) {
    console.log("selector: ", selectors);
    console.log(optionPromise);
    optionPromise.then(function(elements) {
        if (elements.length) {
            var tableTitles = Object.keys(elements[0]).filter(function(k) {
                return k != "$$hashKey";
            });
            console.log("table titles: ", tableTitles);
            $(selectors["thead"] + " thead tr").empty();
            tableTitles.map(function(e) {
                return "<th>" + e + "</th>";
            }).forEach(function(tableTitleHtml) {
                $(selectors["thead"] + " thead tr").append(tableTitleHtml);
            });
            console.log($(selectors["thead"] + " thead tr"));

            var tableBody = $(selectors["tbody"] + " tbody");
            tableBody.empty();
            elements.forEach(e => {
                var rowBodyHtml = "";
                Object.values(e).map(function(val) {
                    return "<td>" + val + "</td>";
                }).forEach(html => {
                    rowBodyHtml += html;
                });
                var rowHtml = "<tr>" + rowBodyHtml + "</tr>";
                tableBody.append(rowHtml);
            })
        }
    }).then(function() {
        tablePagination(selectors["tbody"], selectors["pagination"], 12);
    });

}

function tablePagination(selector, paginationSelector, numPerPage) {
    console.log("numer of per page: ", numPerPage);
    // console.log("pagination:", paginationSelector);
    $(selector).each(function() {
        var currentPage = 0;
        var $table = $(this);
        $table.on('repaginate', function() {
            console.log("repagination");
            $table.find('tbody tr').hide().slice(
                currentPage * numPerPage,
                (currentPage + 1) * numPerPage
            ).show();
        });
        $table.trigger('repaginate');
        var numRows = $table.find('tbody tr').length;
        console.log("num rows: ", numRows);
        var numPages = Math.ceil(numRows / numPerPage);
        console.log("num of pages: ", numPages);


        var $pager = $('<div class="pager"></div>');
        if (numPages <= 5) {
            for (var page = 0; page < numPages; page++) {
                $('<span class="page-item"></span>').text(page + 1).on('click', {
                    newPage: page
                }, function(event) {
                    currentPage = event.data['newPage'];
                    $table.trigger('repaginate');
                    $(this).addClass("active").siblings().removeClass("active");
                }).appendTo($pager).addClass("clickable");
            }
        } else {
            for (page = 0; page < 3; page++) {

                $('<span class="page-item"></span>').text(page + 1).on('click', {
                    newPage: page
                }, function(event) {
                    currentPage = event.data['newPage'];
                    $table.trigger('repaginate');
                    $(paginationSelector + " div.pager button").val(currentPage + 1);
                    $(this).addClass("active").siblings().removeClass("active");
                }).appendTo($pager).addClass("clickable");
            }

            $('<span class="page-item"></span>').text("...").appendTo($pager).addClass("clickable");
            $('<span class="page-item"></span>').text(numPages).on('click', {
                newPage: numPages - 1
            }, function(event) {
                currentPage = event.data['newPage'];
                $table.trigger('repaginate');
                $(this).addClass("active").siblings().removeClass("active");
            }).appendTo($pager).addClass("clickable");

            $('<button class="page-item"></button>').val(currentPage + 1).text("Next").on('click', function(event) {

                console.log("clicked the button, then the current page is : ", $(this).val());
                var nextPage = parseInt($(this).val()) + 1;
                console.log("then the next page is: ", nextPage);
                $(this).val(nextPage);

                var pages = $(paginationSelector + " div.pager span");
                pages.each(function(e) {
                    var innerHTML = this.innerHTML;
                    if (nextPage + "" == innerHTML) {
                        $(this).addClass("active").siblings().removeClass("active");
                    }
                });

                if (nextPage > 3) {
                    $(paginationSelector + " div.pager span").removeClass("active");
                }

                currentPage = nextPage;
                console.log("currentPage: ", currentPage);
                $table.trigger('repaginate');

            }).appendTo($pager).addClass("clickable")



        }


        var $perPage = $('<div class="per-page"><span>12</span> Per Page <i class="bi bi-chevron-down"></i></div>');
        // var $perPage = $('<div class="dropdown per-page">\
        //     <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
        //         Dropdown button</button>\
        //     <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">\
        //         <span class="dropdown-item">Action</span>\
        //         <span class="dropdown-item">Another action</span>\
        //         <span class="dropdown-item">Something else here</span>\
        //     </div>\
        // </div>');

        $perPage.appendTo(paginationSelector);
        $pager.appendTo(paginationSelector).find("span.page-item:first").addClass("active");

    })

}

function displayMap(fullTextResults) {
    console.log("get the fullTextResults to display ");


    fullTextResults.then(function(e) {
        var place = e.Place;

        place.then(function(elements) {
            // var polygon = L.polygon(latlngs).addTo(spatialQueryMap);
            console.log("current map is :", spatialQueryMap);
            var wicket = new Wkt.Wkt();
            var place_iri_list = elements.map(e => { return e["place"]; });
            var placeLocations = getPlaceGeometry(place_iri_list);
            placeLocations.then(function(places) {
                places.forEach(e => {
                    var wkt_geom = e["place_geometry_wkt"];
                    wicket.read(wkt_geom);
                    var coords = wicket.toJson().coordinates;
                    console.log("geometry: ", coords);
                    var point = L.circle([coords[1], coords[0]], {
                        color: '#DF6C37',
                        fillColor: '#DF6C37',
                        fillOpacity: 0.5,
                        radius: 5000
                    }).addTo(spatialQueryMap);
                    console.log(point);
                });
            })
        })
    });


}
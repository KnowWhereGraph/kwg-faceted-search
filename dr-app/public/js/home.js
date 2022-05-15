// console.log("url....");
// console.log(window.location.href);
kwgApp.controller("mainController", function($scope, $window) {
    $scope.inputQuery = "";

    $scope.onKeywordChange = function() {
        $scope.inputQuery = this.inputQuery;
    }

    $scope.keywordSubmit = function($event) {
        var keyword = $scope.inputQuery;
        if (keyword != "")
            $window.location.href = "#/result_search?keyword=" + keyword;
        else
            $window.location.href = "#/result_search";
    }
});
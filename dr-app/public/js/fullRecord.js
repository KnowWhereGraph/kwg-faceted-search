$(document).ready(function(){

    /**
     * Search a spatial query click event
     */
    $("a#navbarDropdown").click(function(){
        // $("div.search-dropdown-input").toggle();
        $("div#search-dropdown").toggle();
    }); 
    
    $(document).click(function(e){
        var elements = document.querySelector("a#navbarDropdown");
        // console.log($.contains(elements, e.target));
        if (!$.contains(elements, e.target)){
            // var display = $("div.search-dropdown-input").css("display");
            var display = $("div#search-dropdown").css("display");
            if (display){
                if (display != "none"){
                    // $("div.search-dropdown-input").css("display", "none");
                    $("div#search-dropdown").css("display", "none");
                }
            }
            
        }
    });



       
})
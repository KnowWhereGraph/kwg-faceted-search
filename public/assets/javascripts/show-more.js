var content = Array.from(document.querySelectorAll(".show-more-wrap"));

content.forEach(function(el){
    var content= el.querySelector(".more");
    var button = el.querySelector(".show-more");
    button.addEventListener("click", function () {
        el.classList.toggle("open");

    }, false)
});


var content = Array.from(document.querySelectorAll(".show-more-wrap-inner"));

content.forEach(function(el){
    var content= el.querySelector(".more-inner");
    var button = el.querySelector(".show-more-inner");
    button.addEventListener("click", function () {
        el.classList.toggle("open");

    }, false)
});


var content = Array.from(document.querySelectorAll(".show-more-wrap-inner-2"));

content.forEach(function(el){
    var content= el.querySelector(".more-inner-2");
    var button = el.querySelector(".show-more-inner-2");
    button.addEventListener("click", function () {
        el.classList.toggle("open");

    }, false)
});


var content = Array.from(document.querySelectorAll(".show-less-wrap"));

content.forEach(function(el){
    var content= el.querySelector(".less");
    var button = el.querySelector(".show-less");
    button.addEventListener("click", function () {
        el.classList.toggle("close");

    }, false)
});

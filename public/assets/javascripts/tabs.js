var tabs = $('.tab'); // get all tabs
var displays = $('main'); // get all <main> elements
if (displays) {
    displays.css('display', 'none');
    displays[0].style.display = 'block'
}

$(document).ready(function() {
    $('#about').addClass('selected');
    var full_url = window.location.href;
    var page = full_url.split("/");
    var index;
    page = page[page.length-1];
    if(page == "about"){
      $('.tab').removeClass('active');
      $('#mission').addClass('active');
      index = '#mission';
    }
    if(page == "grants"){
      $('.tab').removeClass('active');
      $('#grants').addClass('active');
      index = '#grants';
    }
    if(page == "research"){
      $('.tab').removeClass('active');
      $('#research').addClass('active');
      index = '#research';
    }
    if(page == "people"){
      $('.tab').removeClass('active');
      $('#people').addClass('active');
      index = '#people';
    }
    setDisplay ($(index).index());
    // scroll selected tab into view
    var scrollTo = $(index);
    $('.arrow-wrap').animate({
        scrollLeft: scrollTo.offset().left - $('.arrow-wrap').offset().left + $('.arrow-wrap').scrollLeft() - 50 // neg = element moves right
    });
});

$('.tab').click(function () {
    $('.tab').removeClass('active');
    $(this).addClass('active');
    setDisplay ($(this).index());

    let stateObj = { id: "100" };
    var currentTab = $(this).text().toLowerCase();
    if (currentTab == "mission"){
      currentTab = "about";
    }
    var url = BASE_URL + currentTab;
    window.history.replaceState(stateObj, $(this).text(), url);

    // scroll selected tab into view
    var scrollTo = $(this);
    $('.arrow-wrap').animate({
        scrollLeft: scrollTo.offset().left - $('.arrow-wrap').offset().left + $('.arrow-wrap').scrollLeft() - 50 // neg = element moves right
    });
});

$('.arrow.right').click(function(event) {
    event.preventDefault();
    $('.arrow-wrap').animate({
        scrollLeft: $('.arrow-wrap').scrollLeft() + 300
    }, 800);
});

$('.arrow.left').click(function(event) {
    event.preventDefault();
    $('.arrow-wrap').animate({
        scrollLeft: $('.arrow-wrap').scrollLeft() - 300
    }, 800);
});

$('.arrow-wrap').scroll(function() {
    var fb = $('.arrow-wrap');
    if (fb.scrollLeft() + fb.innerWidth() >= fb[0].scrollWidth) {
        $('.arrow.right').addClass('hidden');
    } else {
        $('.arrow.right').removeClass('hidden');
    }
    if (fb.scrollLeft() <= 20) {
        $('.arrow.left').addClass('hidden');
    } else {
        $('.arrow.left').removeClass('hidden');
    }
});

function setDisplay (i) {
    displays.css('display', 'none');
    if (!displays[i]){
        displays[0].style.display = 'block'
    } else {
        displays[i].style.display = 'block'
    }
}

$(document).on('keyup', function(e) {
    //The only time this shouldn't execute is when we are dealing with date
    //range filters in *-filters.js
    if(
      !$('.grant-start-year-js').is(":focus")
      && !$('.grant-end-year-js').is(":focus")
      && !$('.research-start-year-js').is(":focus")
      && !$('.research-end-year-js').is(":focus")
    )
        PresTab(e);
});
$(document).on('keydown', function(e) {
    KeyDown(e);
});
var next;

function PresTab(e)
{
   var keycode = (window.event) ? event.keyCode : e.keyCode;
   if (keycode == 9){
     var current = $('.tab.active').text();
     if (current != "Community"){
       next = $('.tab.active').next();
     }
     else{
       next = $('ul.tabs > li:first-child');
     }
     $('.tab').removeClass('active');
     next.addClass('active');
     // setDisplay (next.index());
   }
   if (keycode == 13){
     setDisplay (next.index());
     let stateObj = { id: "100" };
     var currentTab = $(next).text().toLowerCase();
     if (currentTab == "mission"){
       currentTab = "about";
     }
     var url = BASE_URL + currentTab;
     window.history.replaceState(stateObj, $(this).text(), url);
     // scroll selected tab into view
     var scrollTo = next;
     $('.arrow-wrap').animate({
         scrollLeft: scrollTo.offset().left - $('.arrow-wrap').offset().left + $('.arrow-wrap').scrollLeft() - 50 // neg = element moves right
     });
   }
}
function KeyDown(e)
{
    var keycode = (window.event) ? event.keyCode : e.keyCode;
    if (keycode == 9){
      event.preventDefault();
    }
    if (keycode == 13){
      event.preventDefault();
    }
}

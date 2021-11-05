$(document).ready(function(){
    setTimeout(function(){
        var map = L.map('top-map').setView([35.0843, -106.6198], 12);
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zS24k9i8nVWbUmI9ngCZ',{
            tileSize: 512,
            zoomOffset: -1,
            minZoom: 1,
            attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
            crossOrigin: true
        }).addTo(map);

        // draw a circle on the map
        var circle = L.circle([35.0843, -106.6198], {
            color: '#DF6C37',
            fillColor: '#DF6C37',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map);
        circle.bindPopup("This is the city Albuquerque.")
    }, 200);

    



    
})

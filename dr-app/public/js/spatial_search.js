var spatialSearchMap;
spatialSearchMap = L.map("spatialSearch-map", {
    zoomControl: false,
}).setView([40.895, -100.036667], 5);
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zS24k9i8nVWbUmI9ngCZ', {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(spatialSearchMap);

L.control.zoom({
    position: "bottomleft"
}).addTo(spatialSearchMap);

// drawing
spatialSearchMap.pm.addControls({
    position: "topleft",
    positions: {
        draw: 'topleft',
        edit: 'topright'
    },


    drawMarker: false,
    drawCircleMarker: false,
    drawPolyline: false,
    drawRectangle: false,
    drawPolygon: false,
    drawCircle: true,

    drawControls: true,
    editControls: true,
    optionsControls: true,
    customControls: true
});

spatialSearchMap.on("pm:create", (e) => {
    console.log("the shape is drawn/finished");
    console.log(e.shape);
    var coordinates;
    var radius;

    if (e.shape == "Polygon" || e.shape == "Rectangle") {
        coordinates = spatialSearchMap.pm.getGeomanDrawLayers()[0].getLatLngs()[0];
    } else if (e.shape == "Circle") {
        coordinates = spatialSearchMap.pm.getGeomanDrawLayers()[0].getLatLng();
        radius = spatialSearchMap.pm.getGeomanDrawLayers()[0].getRadius();
    }

    console.log("coordinates: ", coordinates);
    console.log("radius: ", radius);

});
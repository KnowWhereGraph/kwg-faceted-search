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
    drawRectangle: true,
    drawPolygon: true,
    drawCircle: true,

    drawControls: true,
    editControls: false,
    optionsControls: true,
    customControls: true
});
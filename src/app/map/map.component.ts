import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import "leaflet.markercluster";

// install leaflet markercluster: https://blog.mestwin.net/leaflet-angular-marker-clustering/
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private map: any;
  @Input() locations: any;
  createMarkerCluster = L.markerClusterGroup();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
    // this.createMarkerCluster.clearLayers();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [25.79611, -96.86278],
      zoom: 5
    });

    // const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 18,
    //   minZoom: 3,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });

    // const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //         maxZoom: 18,
    //         id: 'mapbox/streets-v11',
    //         tileSize: 512,
    //         zoomOffset: -1,
    //         accessToken: 'pk.eyJ1IjoidHJ1Y2hhbiIsImEiOiJjazZqaGJwdWwwYnJkM21vYnl1cDMwbGplIn0.--s7U90M9eJARzPGTGyQjg'
    //     });
    const tiles = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zS24k9i8nVWbUmI9ngCZ', {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
      crossOrigin: true
    });
    tiles.addTo(this.map);

    // add the circle drawing, edits, and clear functions to support further spatial search on the homepage
    if(this.map){
      this.map.pm.addControls({
        position: "topleft",
        positions: {
            draw: "topleft",
            edit: "topleft"
        },
        drawMarker: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawPolygon: false,
        drawCircle: true,
        drawText: false,

        drawControls: true,
        editControls: true,
        optionsControls: true,
        customControls: true,
        cutPolygon: false,
        rotateMode: false
    });
    }
  }

  private showClusters(locations){
    const icon = L.icon({
      iconSize: [25, 41],
     iconAnchor: [10, 41],
     popupAnchor: [2, -40],
     // specify the path here
     iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
     shadowUrl:
       "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
   });

    // place: "http://stko-kwg.geog.ucsb.edu/lod/resource/geometry.multipolygon.North_America.United_States.USA.10_1"
    // hazard: <http://www.opengis.net/def/crs/OGC/1.3/CRS84>POINT (-89.6458056 32.3111059)
    // person: POINT (-77.86278 40.79611)

   for(let i = 0; i < locations.length; i++){
    let marker = L.marker([locations[i][0], locations[i][1]], {icon});
    this.createMarkerCluster.addLayer(marker);
  }
  this.map.addLayer(this.createMarkerCluster);
  }

  public displayClustersForTab(tabName, locations){
    // clear all the clusters
    var coordinates: number[][] = [];
    this.createMarkerCluster.clearLayers();
    // display the clusters
    if (tabName == "place"){
      coordinates = [];
    } else{
      for (var loc of locations){
        var split_text = loc.split(" ");
        var coord: number[] = [];
        var coordX = parseFloat(split_text[1].split("(")[1]);
        var coordY = parseFloat(split_text[2].split(")")[0]);
        coord.push(coordY);
        coord.push(coordX);
        coordinates.push(coord);
      }
    }

    if(coordinates.length){
      this.showClusters(coordinates);
    }
  }
}

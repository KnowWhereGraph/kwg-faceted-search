import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import "leaflet.markercluster";
import { auto } from '@popperjs/core';

// install leaflet markercluster: https://blog.mestwin.net/leaflet-angular-marker-clustering/
/**
 * Component for the map interface. This component is responsible for handling map
 * updates and displaying information on the map.
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private map: any;
  @Input() locations: any;
  createMarkerCluster = L.markerClusterGroup();
  markers: L.Marker[] = [];


  constructor() {

  }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.initMap();
    // this.createMarkerCluster.clearLayers();
  }

  /**
   * Creates a new map instance centered at a point.
   */
  private initMap(): void {
    this.map = L.map('map', {
      // center: [51.505, -0.09],
      center: [-37.8208292333, 175.2214374833],
      zoom: 5
    });

    // const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 18,
    //   minZoom: 3,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });

    const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoidHJ1Y2hhbiIsImEiOiJjazZqaGJwdWwwYnJkM21vYnl1cDMwbGplIn0.--s7U90M9eJARzPGTGyQjg'
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

  private showClusters(){
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

    for(let i = 0; i < this.locations.length; i++) {
      let marker = L.marker([this.locations[i][0], this.locations[i][1]], {icon});
      this.createMarkerCluster.addLayer(marker);
    }
    this.map.addLayer(this.createMarkerCluster);
  }
}

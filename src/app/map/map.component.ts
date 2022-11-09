import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import "leaflet.markercluster";


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

  /**
   * An empty constructor; the map is initialized after the view is ready.
   */
  constructor() { }

  /**
   * An empty ngOnInit to satisfy the constraints from OnInit.
   */
  ngOnInit(): void { }

  /**
   * Once the view is ready, initialize the map and show the data clusters.
   */
  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * Creates a new map instance centered at a point.
   */
  private initMap(): void {
    this.map = L.map('map', {
      center: [-37.8208292333, 175.2214374833],
      zoom: 5
    });

    // The tile layer from mapbox definition
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
    if (this.map) {
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

        drawControls: true,
        editControls: true,
        optionsControls: true,
        customControls: true,
        cutPolygon: false,
        rotateMode: false
      });
    }
  }

  /**
   * Show given locations as point clusters on the map
   * @param locations coordinates of points
   */
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

    for (let i = 0; i < locations.length; i++) {
      let marker = L.marker([locations[i][0], locations[i][1]], { icon });
      this.createMarkerCluster.addLayer(marker);
    }
    this.map.addLayer(this.createMarkerCluster);

  }

  /**
   * Display point clustering for given tab name (place, hazard, or people)
   * @param tabName choose the tab name for locations to be shown
   * @param locations coordinates for points
   */
  public displayClustersForTab(tabName, locations){
    // clear all the clusters
    var coordinates: number[][] = [];
    this.createMarkerCluster.clearLayers();

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

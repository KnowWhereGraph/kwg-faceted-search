import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import "leaflet.markercluster";
import * as wkt from 'wicket'

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
  // markers: L.Marker[] = [];

>>>>>>> b845fbe8 (recenter the map)

  constructor() {
  }

  ngOnInit(): void {
  }
=======
  markers: L.Marker[] = [];

  /**
   * An empty constructor; the map is initialized after the view is ready.
   */
  constructor() { }

  /**
   * An empty ngOnInit to satisfy the constraints from OnInit.
   */
  ngOnInit(): void { }
>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)

  /**
=======
  markers: L.Marker[] = [];

  /**
   * An empty constructor; the map is initialized after the view is ready.
   */
  constructor() { 
    
  }

  /**
   * An empty ngOnInit to satisfy the constraints from OnInit.
   */
  ngOnInit(): void { }

  /**
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
   * Once the view is ready, initialize the map and show the data clusters.
   */
  ngAfterViewInit(): void {
    this.initMap();
    this.showClusters();
  }

  /**
   * Creates a new map instance centered at a point.
   */
  private initMap(): void {
    this.map = L.map('map', {
<<<<<<< HEAD
<<<<<<< HEAD
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
<<<<<<< HEAD
=======
      center: [-37.8208292333, 175.2214374833],
      zoom: 5
    });
=======
      center: [-37.8208292333, 175.2214374833],
      zoom: 5
    });

    // The tile layer from mapbox definition
    const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
<<<<<<< HEAD
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoidHJ1Y2hhbiIsImEiOiJjazZqaGJwdWwwYnJkM21vYnl1cDMwbGplIn0.--s7U90M9eJARzPGTGyQjg'
        });
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
=======
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoidHJ1Y2hhbiIsImEiOiJjazZqaGJwdWwwYnJkM21vYnl1cDMwbGplIn0.--s7U90M9eJARzPGTGyQjg'
    });
>>>>>>> 093c3e3c (Format all source fileS)

    // The tile layer from mapbox definition
    const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoidHJ1Y2hhbiIsImEiOiJjazZqaGJwdWwwYnJkM21vYnl1cDMwbGplIn0.--s7U90M9eJARzPGTGyQjg'
        });
=======
>>>>>>> b845fbe8 (recenter the map)

>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
  /**
   * Plots a location on the map
   * @param locations coordinates of points
   */
<<<<<<< HEAD
>>>>>>> 9f3ef866 (uncomment console; jsdoc format)
  private showClusters(locations){
=======
=======
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
  /**
   * Creates the cluster icons on the map.
   */
  private showClusters() {
<<<<<<< HEAD
>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)
=======
  private showClusters(locations){
>>>>>>> b845fbe8 (recenter the map)
=======
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
=======
  private showPoint(feature){
>>>>>>> e749fcb5 (Refactor query triggering events & partially add places to the map)
    const icon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
    });

<<<<<<< HEAD
    let locations = [[-37.8210922667, 175.2209316333],
    [-37.8210819833, 175.2213903167],
    [-37.8210881833, 175.2215004833],
    [-37.8211946833, 175.2213655333],
    [-37.8209458667, 175.2214051333],
    [-37.8208292333, 175.2214374833],
    [-37.8325816, 175.2238798667],
    [-37.8315855167, 175.2279767]];

    for (let i = 0; i < locations.length; i++) {
      let marker = L.marker([locations[i][0], locations[i][1]], { icon });
      this.createMarkerCluster.addLayer(marker);
    }
    this.map.addLayer(this.createMarkerCluster);
<<<<<<< HEAD
=======
    function onEachFeature(feature, layer) {
      layer.bindPopup(feature.properties.ATT1);
    }
>>>>>>> e749fcb5 (Refactor query triggering events & partially add places to the map)

    L.geoJSON(feature, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: icon
        });
      },
    }).addTo(this.map);
  }

  /**
   * Plots a location on the map
   * @param geom
   */
   private showTwoDim(geom){
    const icon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
      
    });

    let marker = L.marker([location[0], location[1]], { icon });
    this.createMarkerCluster.addLayer(marker);
    this.map.addLayer(this.createMarkerCluster);
  }

  /**
   * Display point clustering for given tab name (place, hazard, or people)
   * @param tabName choose the tab name for locations to be shown
   * @param records coordinates for points
   */
  public displayClustersForTab(tabName: string, records: Array<JSON>){
    this.createMarkerCluster.clearLayers();
    let wkt_reader = new  wkt.Wkt();
    let wkt_representation = {};
    records.forEach(record => {
      try {
        wkt_representation = wkt_reader.read(record['wkt']).toJson();
      } catch (error) {
          console.warn("Failed to read the geometry of a table result: ", record, error)
          return;
      }
      if(tabName == "people") {
        wkt_representation["properties"]["name"] = record["name"],
        wkt_representation["properties"]["affiliation"] = record["affiliation"],
        wkt_representation["properties"]["expertise"] = record["expertise"],
        wkt_representation["properties"]["place"] = record["place"]
      }

<<<<<<< HEAD
    if(coordinates.length){
      this.showClusters(coordinates);
    }
=======
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
=======
      if (wkt_representation['type'] != "Point") {
        // Then it's a 2d geometry
      } else {
        // Add it as a point
        this.showPoint(wkt_representation);
      }
    });
    this.map.addLayer(this.createMarkerCluster);
>>>>>>> e749fcb5 (Refactor query triggering events & partially add places to the map)
  }
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)
=======
>>>>>>> 19451625 (merge the change)
}

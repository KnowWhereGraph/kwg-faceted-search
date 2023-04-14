import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import "leaflet.markercluster";
import * as wkt from 'wicket'
import * as turf from 'turf';

/**
 * Component for the map interface. This component is responsible for handling map
 * updates and displaying information on the map.
 * 
 * The overarching goal is to turn each node into a GeoJSON object and get it into the map object, while supporting
 * clustering.
 * 
 * This map uses the Marker Cluster Group plugin - which uses a layer to interface with the map. The GeoJSON
 * objects are added to the cluster layer, which is then added to the map.
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private map: any;
  @Input() locations: any;
<<<<<<< HEAD
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
=======
  markerCluster = L.markerClusterGroup();
>>>>>>> d9b27ca1 (Add the map for the 'Persons' tab)
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
<<<<<<< HEAD
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
<<<<<<< HEAD
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
=======
    const tiles = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zS24k9i8nVWbUmI9ngCZ', {
>>>>>>> f94feaa9 (Remove unused code)
=======
    this.map = L.map('map', {
      center: [36.895, -95.036667],
      zoom: 4
    });

    // The tile layer from mapbox definition
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zS24k9i8nVWbUmI9ngCZ', {
>>>>>>> d9b27ca1 (Add the map for the 'Persons' tab)
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoidHJ1Y2hhbiIsImEiOiJjazZqaGJwdWwwYnJkM21vYnl1cDMwbGplIn0.--s7U90M9eJARzPGTGyQjg'
<<<<<<< HEAD
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
=======
    }).addTo(this.map);
>>>>>>> d9b27ca1 (Add the map for the 'Persons' tab)
  }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
  /**
   * Plots a feature on the map. A long function because it contains several methods
   * that need to be within this function's scope. 
   * 
   * @param feature The feature being plotted on the map
   */
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
  private showPoint(feature) {
>>>>>>> 1420d57c (Format code)
=======
  private showGeometry(feature) {
>>>>>>> f94feaa9 (Remove unused code)
=======
  private addFeature(feature) {
>>>>>>> d9b27ca1 (Add the map for the 'Persons' tab)
    const icon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: '../../assets/images/map/marker.png',
      shadowUrl: '../../assets/images/map/marker-shadow.png'
    });

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
    /**
     * Returns the HTML used in the popup
     * 
     * @param name Name off the person
     * @param affiliation Their affiliation
     * @param expertise The area of their expertise
     * @param phone Their phone number
     * @param email Their email
     * @param homepage Their website
     * @returns A string of HTML with inline styling
     */
>>>>>>> 942f9746 (Add support for plotting geometries as points on the 'Place' tab)
    function getPersonPopup(name: string, affiliation: string, expertise: [[string, string]], phone: string, email: string, homepage: string) {
      // Use Array to sort & handle concatenating the expert topics
      let expertTopics: Array<string> = []
      expertise.forEach((topic) => {expertTopics.push(topic[1])})
      expertTopics.sort()
      let topicString = expertTopics.join(", ")
      // Get the name out of the exert topics
      let phone_row = `<span><b>Phone: </b> <a target="_blank" href='tel:${phone}'>${phone}</a></span><br>`;
      let homepage_row = `<span><b>Homepage:</b><a target="_blank" href='${homepage}'>${homepage}</a></span><br>`;
      let email_row = `<span><b>Email: </b><a target="_blank" href='mailto:${email}'>${email}</a></span>`;
      return `
      <span><b>Name:</b> ${name}</span>
      <br>
      <span><b>Affiliation:</b> ${affiliation}</span>
      <br>
      <span><b>Expertise:</b> ${topicString}</span>
      <br>
      ${email.length ? email_row : ''}
<<<<<<< HEAD
      ${homepage.length ? homepage_row : ''}`
>>>>>>> d9b27ca1 (Add the map for the 'Persons' tab)
=======
      ${homepage.length ? homepage_row : ''}
      ${phone.length ? phone_row : ''}`
>>>>>>> 4458e805 (Clear when viewing 'Place' tab and re-order card)
    }
<<<<<<< HEAD
>>>>>>> e749fcb5 (Refactor query triggering events & partially add places to the map)
=======
 
    /**
     * Creates the popup for elements on the 'Place' tab
     * @param name The name of the place
     * @param place_type The type of the place
     * @returns HTML that goes inside the map popup
     */
    function getPlacePopup(name: string, place_type: string) {
      return `
      <span><b>Name:</b> ${name}</span>
      <br>
      <span><b>Type:</b> ${place_type}</span>
      `
    }
>>>>>>> 942f9746 (Add support for plotting geometries as points on the 'Place' tab)

  /**
   * Called on each map marker; used to set popup properties
   * 
   * @param feature The geojson feature being acted on
   * @param layer The layer that the feature is in
   * @param place_type: The type of place the node represents
   */
  function onEachFeature(feature, layer) {
    let content = ''
    if (feature.properties.type === "place") {
      content = getPlacePopup(feature.properties.name, feature.properties.place_type);
    } else if (content === 'people') {
      content = getPersonPopup(feature.properties.name, feature.properties.affiliation, feature.properties.expertise, feature.properties.phone, feature.properties.email, feature.properties.homepage);
    }
    layer.bindPopup(content);
  } 
    // Get a geoJSON representation
    let newFeature = L.geoJSON(feature, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: icon
        });
      },
      onEachFeature: onEachFeature
    });
    // Add the feature to the marker layer
    this.markerCluster.addLayer(newFeature)
  }

  /**
   * Display point clustering for given tab name (place, hazard, or people)
   * 
   * @param tabName choose the tab name for locations to be shown
   * @param records coordinates for points
   */
  public displayClustersForTab(tabName: string, records: Array<JSON>) {

    // If the map has already been initialized, clear it for repainting
    this.markerCluster.clearLayers();
    let wkt_reader = new wkt.Wkt();
    let wkt_representation: any = {};
    records.forEach(record => {
      try {
        wkt_representation = wkt_reader.read(record['wkt']).toJson();
        // If this isn't a POINT geometry, turn it into one by using the centroid
        if (!this.isPoint(record['wkt'])) {
          let geojson = L.geoJSON(wkt_representation).toGeoJSON()
          wkt_representation = turf.centroid(geojson);
        }
      } catch (error) {
        // This is okay because not all results have geometries
        console.warn("Failed to read the geometry of a table result: ", error);
        return;
      }
      wkt_representation['properties'] = {}
      wkt_representation['properties']['name'] = record['name']

      // Get information for the popup based on the tab
      if (tabName == "people") {
        wkt_representation["properties"]["type"] = "people"
          wkt_representation["properties"]["affiliation"] = record["affiliation"],
          wkt_representation["properties"]["expertise"] = record["expertise"],
          wkt_representation["properties"]["place"] = record["place"]
          wkt_representation["properties"]["email"] = record["email"]
          wkt_representation["properties"]["phone"] = record["phone"]
          wkt_representation["properties"]["homepage"] = record["homepage"]
<<<<<<< HEAD
      } else if (tabName == "hazard") {

      }
<<<<<<< HEAD

<<<<<<< HEAD
    if(coordinates.length){
      this.showClusters(coordinates);
    }
=======
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
=======
=======
>>>>>>> d9b27ca1 (Add the map for the 'Persons' tab)
      if (wkt_representation['type'] != "Point") {
        // Then it's a 2d geometry
      } else {
        // Add it as a point
        this.addFeature(wkt_representation);
=======
      } else if (tabName == "place") {
        wkt_representation["properties"]["type"] = "place"
        wkt_representation["properties"]["name"] = record["name"];
        wkt_representation["properties"]["place_type"] = record["type"];
>>>>>>> 942f9746 (Add support for plotting geometries as points on the 'Place' tab)
      }
      this.addFeature(wkt_representation);
    });
<<<<<<< HEAD
    this.map.addLayer(this.createMarkerCluster);
>>>>>>> e749fcb5 (Refactor query triggering events & partially add places to the map)
=======
    this.map.addLayer(this.markerCluster);
>>>>>>> d9b27ca1 (Add the map for the 'Persons' tab)
  }
<<<<<<< HEAD
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
=======

  /**
   * Determines whether a wkt string is describing a point or not
   * 
   * @param wkt The WKT geometry
   * @returns A boolean whether the geometry is a point or not
   */
  private isPoint(wkt: string) {
    if (wkt.includes("POINT") || wkt.includes("point")) {
      return true;
    }
    return false
  }
>>>>>>> 942f9746 (Add support for plotting geometries as points on the 'Place' tab)
}

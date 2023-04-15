import { Component, Input, OnInit } from '@angular/core'
import * as L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import 'leaflet.markercluster'
import * as wkt from 'wicket'
import * as turf from 'turf'

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
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map: any
  @Input() locations: any
  markerCluster = L.markerClusterGroup()
  markers: L.Marker[] = []

  /**
   * An empty constructor; the map is initialized after the view is ready.
   */
  constructor() {}

  /**
   * An empty ngOnInit to satisfy the constraints from OnInit.
   */
  ngOnInit(): void {}

  /**
   * Once the view is ready, initialize the map and show the data clusters.
   */
  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [36.895, -95.036667],
      zoom: 4,
    })

    // The tile layer from mapbox definition
    L.tileLayer(
      'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=zS24k9i8nVWbUmI9ngCZ',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1IjoidHJ1Y2hhbiIsImEiOiJjazZqaGJwdWwwYnJkM21vYnl1cDMwbGplIn0.--s7U90M9eJARzPGTGyQjg',
      }
    ).addTo(this.map)
  }

  /**
   * Plots a feature on the map. A long function because it contains several methods
   * that need to be within this function's scope.
   *
   * @param feature The feature being plotted on the map
   */
  private addFeature(feature) {
    const icon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: '../../assets/images/map/marker.png',
      shadowUrl: '../../assets/images/map/marker-shadow.png',
    })

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
    function getPersonPopup(
      name: string,
      affiliation: string,
      expertise: [[string, string]],
      phone: string,
      email: string,
      homepage: string
    ) {
      // Use Array to sort & handle concatenating the expert topics
      let expertTopics: Array<string> = []
      expertise.forEach((topic) => {
        expertTopics.push(topic[1])
      })
      expertTopics.sort()
      let topicString = expertTopics.join(', ')
      // Get the name out of the exert topics
      let phone_row = `<span><b>Phone: </b> <a target="_blank" href='tel:${phone}'>${phone}</a></span><br>`
      let homepage_row = `<span><b>Homepage:</b><a target="_blank" href='${homepage}'>${homepage}</a></span><br>`
      let email_row = `<span><b>Email: </b><a target="_blank" href='mailto:${email}'>${email}</a></span>`
      return `
      <span><b>Name:</b> ${name}</span>
      <br>
      <span><b>Affiliation:</b> ${affiliation}</span>
      <br>
      <span><b>Expertise:</b> ${topicString}</span>
      <br>
      ${email.length ? email_row : ''}
      ${homepage.length ? homepage_row : ''}
      ${phone.length ? phone_row : ''}`
    }

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

    /**
     * Creates the HTML for the popup that appears on
     * the map markers for hazards
     * @param name: The name of the hazard
     * @param hazardType The type of hazard
     * @param startDate The start of the hazard event
     * @param endDate The end of the hazard event
     * @returns The HTML for the popup
     */
    function getHazardPopup(name, hazardType, startDate, endDate) {
      return `
      <span><b>Name:</b> ${name}</span>
      <br>
      <span><b>Type:</b> ${hazardType}</span>
      <br>
      <span><b>Start Data:</b> ${startDate}</span>
      <br>
      <span><b>End Date:</b> ${endDate}</span>
      `
    }
    /**
     * Called on each map marker; used to set popup properties
     *
     * @param feature The geojson feature being acted on
     * @param layer The layer that the feature is in
     * @param place_type: The type of place the node represents
     */
    function onEachFeature(feature, layer) {
      let content = ''
      if (feature.properties.type === 'place') {
        content = getPlacePopup(
          feature.properties.name,
          feature.properties.place_type
        )
      } else if (feature.properties.type === 'people') {
        content = getPersonPopup(
          feature.properties.name,
          feature.properties.affiliation,
          feature.properties.expertise,
          feature.properties.phone,
          feature.properties.email,
          feature.properties.homepage
        )
      } else if (feature.properties.type === 'hazard') {
        content = getHazardPopup(
          feature.properties.name,
          feature.properties.hazard_type,
          feature.properties.startDate,
          feature.properties.endDate
        )
      }
      layer.bindPopup(content)
    }
    // Get a geoJSON representation
    let newFeature = L.geoJSON(feature, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: icon,
        })
      },
      onEachFeature: onEachFeature,
    })
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
    this.markerCluster.clearLayers()
    let wkt_reader = new wkt.Wkt()
    let wkt_representation: any = {}
    records.forEach((record) => {
      try {
        wkt_representation = wkt_reader.read(record['wkt']).toJson()
        // If this isn't a POINT geometry, turn it into one by using the centroid
        if (!this.isPoint(record['wkt'])) {
          let geojson = L.geoJSON(wkt_representation).toGeoJSON()
          wkt_representation = turf.centroid(geojson)
        }
      } catch (error) {
        // This is okay because not all results have geometries
        console.warn('Failed to read the geometry of a table result: ', error)
        return
      }
      wkt_representation['properties'] = {}
      wkt_representation['properties']['name'] = record['name']
      // Get information for the popup based on the tab
      if (tabName == 'people') {
        wkt_representation['properties']['type'] = 'people'
        ;(wkt_representation['properties']['affiliation'] =
          record['affiliation']),
          (wkt_representation['properties']['expertise'] = record['expertise']),
          (wkt_representation['properties']['place'] = record['place'])
        wkt_representation['properties']['email'] = record['email']
        wkt_representation['properties']['phone'] = record['phone']
        wkt_representation['properties']['homepage'] = record['homepage']
      } else if (tabName == 'place') {
        wkt_representation['properties']['type'] = 'place'
        wkt_representation['properties']['name'] = record['name']
        wkt_representation['properties']['place_type'] = record['type']
      } else if (tabName == 'hazard') {
        wkt_representation['properties']['type'] = 'hazard'
        wkt_representation['properties']['name'] = record['name']
        wkt_representation['properties']['hazard_type'] = Array()
        // Get a unique set of types
        let hazard_types = new Set()
        record['type'].forEach((type_element) => {
          hazard_types.add(type_element[1])
        })
        wkt_representation['properties']['hazard_type'] = [...hazard_types]
        wkt_representation['properties']['startDate'] = record['startDate']
        wkt_representation['properties']['endDate'] = record['endDate']
      }
      this.addFeature(wkt_representation)
    })
    this.map.addLayer(this.markerCluster)
    try {
      this.map.fitBounds(this.markerCluster.getBounds())
    } catch (error) {
      // Sometimes if there aren't any valid geometries on the map, this throws
      // Leave it silent because it should be okay
    }
  }

  /**
   * Determines whether a wkt string is describing a point or not
   *
   * @param wkt The WKT geometry
   * @returns A boolean whether the geometry is a point or not
   */
  private isPoint(wkt: string) {
    if (wkt.includes('POINT') || wkt.includes('point')) {
      return true
    }
    return false
  }
}

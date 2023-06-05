import { Component, Input, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import "leaflet.markercluster";
import * as wkt from 'wicket'

/**
 * Component for the map interface. This component is responsible for handling map
 * updates and displaying information on the map.
 */
@Component({
  selector: 'browser-map',
  templateUrl: './browser-map.component.html',
  styleUrls: ['./browser-map.component.scss']
})
export class BrowserMap implements AfterViewInit {

  private map: any;
  public showMap: boolean;
  @Input() locations: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor() { 
    this.showMap = false;
  }

  ngAfterViewInit(): void {
    if (this.showMap) {
      this.initMap()
    }
  }

}

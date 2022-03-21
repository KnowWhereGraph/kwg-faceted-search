import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  private initMap(): void {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13
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

        drawControls: true,
        editControls: true,
        optionsControls: true,
        customControls: true,
        cutPolygon: false,
        rotateMode: false

    });
    }
  }

  


}

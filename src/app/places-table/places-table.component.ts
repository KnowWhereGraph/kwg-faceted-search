import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-places-table',
  templateUrl: './places-table.component.html',
  styleUrls: ['./places-table.component.scss']
})

export class PlacesTableComponent implements OnInit {
  // Columns for the table
  placesColumns: Array<String> = ["name", "type"];
  // The data source that's responsible for fetching data
  placesDataSource: MatTableDataSource<Place>;
  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();

  constructor() {
    // Initialize the places data to an empty array
    this.placesDataSource = new MatTableDataSource();
    console.log("Places ctor")
   }

  ngOnInit(): void {
    // Un-mocked, this is where the initial query is made for the initial list of results
    // this.places should be updated, and then
    this.placesDataSource = new MatTableDataSource(this.places);

    // Update the number of results
    this.resultsCountEvent.emit(this.places.length);
  }

  // Un-mocked, this should be empty
  places: Array<Place> = [
    {
      name: "California",
      type: "Admin Region 2",
    },
    {
      name: "California",
      type: "Admin Region 2",
    },
    {
      name: "California",
      type: "Admin Region 2",
    },
    {
      name: "California",
      type: "Admin Region 2",
    },
  ]
}

// Prototype for Places
export interface Place {
  name: string;
  type: string,
}

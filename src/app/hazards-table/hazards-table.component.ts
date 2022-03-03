import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-hazards-table',
  templateUrl: './hazards-table.component.html',
  styleUrls: ['./hazards-table.component.scss']
})
export class HazardsTableComponent implements OnInit {
  // Columns for the table
  hazardColumns: Array<String> = ["name", "type", "place", "startDate", "endDate"];
  // The data source that's responsible for fetching data
  hazardsDataSource: MatTableDataSource<Hazard>;
  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();

  constructor() {
    console.log("Hazards ctor")
    this.hazardsDataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.hazardsDataSource = new MatTableDataSource(this.hazards);
    // Update the number of results
    this.resultsCountEvent.emit(this.hazards.length);
  }

  // Un-mocked, this should be empty
  hazards: Array<Hazard> = [
    {
      name: "Alfred",
      type: "Hurricane",
      place: "Dorchester",
      startDate: "1996-07-12 T01:00:00+05:00",
      endDate: "1996-07-12 T11:00:00+05:00",
    },
    {
      name: "Alfred",
      type: "Hurricane",
      place: "Dorchester",
      startDate: "1996-07-12 T01:00:00+05:00",
      endDate: "1996-07-12 T11:00:00+05:00",
    },
    {
      name: "Alfred",
      type: "Hurricane",
      place: "Dorchester",
      startDate: "1996-07-12 T01:00:00+05:00",
      endDate: "1996-07-12 T11:00:00+05:00",
    },
  ]
}

// Prototype for Hazard
export interface Hazard {
  name: string;
  type: string,
  place: string,
  startDate: string,
  endDate: string,
}

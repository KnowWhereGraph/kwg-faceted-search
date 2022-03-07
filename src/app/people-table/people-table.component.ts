import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-people-table',
  templateUrl: './people-table.component.html',
  styleUrls: ['./people-table.component.scss']
})
export class PeopleTableComponent implements OnInit {
  // Columns for the table
  peopleColumns: Array<String> = ["name", "affiliation", "expertise", "place"];
  // The data source that's responsible for fetching data
  peopleDataSource: MatTableDataSource<Person>;
  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();

  constructor() {
    this.peopleDataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.peopleDataSource = new MatTableDataSource(this.people);
    // Update the number of results
    this.resultsCountEvent.emit(this.people.length);
  }

  // Un-mocked, this should be empty
  people: Array<Person> = [
    {
      name: "Alfreds Futterkiste",
      affiliation: "UCL",
      expertise: "Topic instance storm",
      place: "Germany"
    },
    {
      name: "Alfreds Futterkiste",
      affiliation: "UCL",
      expertise: "Topic instance storm",
      place: "Germany"
    },
    {
      name: "Alfreds Futterkiste",
      affiliation: "UCL",
      expertise: "Topic instance storm",
      place: "Germany"
    },
    {
      name: "Alfreds Futterkiste",
      affiliation: "UCL",
      expertise: "Topic instance storm",
      place: "Germany"
    },
    {
      name: "Alfreds Futterkiste",
      affiliation: "UCL",
      expertise: "Topic instance storm",
      place: "Germany"
    },
    {
      name: "Alfreds Futterkiste",
      affiliation: "UCL",
      expertise: "Topic instance storm",
      place: "Germany"
    },
  ]
}

// Prototype for Hazard
export interface Person {
  name: string;
  affiliation: string,
  expertise: string,
  place: string,
}

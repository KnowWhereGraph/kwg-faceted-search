import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'
import {MatTableDataSource} from '@angular/material/table';
import { SafeResourceUrl } from '@angular/platform-browser';
import { QueryService } from '../services/query.service'

/**
 * Component for the 'People' table. This component represents the table for
 * people. This is rendered when users click the 'People' tab. It is responsible
 * for handling queries and displaying the table.
 */
@Component({
  selector: 'app-people-table',
  templateUrl: './people-table.component.html',
  styleUrls: ['./people-table.component.scss']
})
export class PeopleTableComponent implements OnInit {
  // Columns for the table
  peopleColumns: Array<String> = ["name", "affiliation", "expertise", "place"];
  // The data source that's responsible for fetching data
  people: Array<Person> = [];
  peopleDataSource: MatTableDataSource<Person>;
  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();
  // Event that notifies the parent component that a query has finished
  @Output() searchQueryFinishedEvent = new EventEmitter<boolean>();
  // Pagniator on the table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // The number of results that the user wants to see in the table
  public pageSize = 20;
  // The current table page that the user is on
  public currentPage = 0;
  // The number of results
  public totalSize = 0;
  // Holds the locations of the results
  locations: Array<string> = [];
  // Event that sends the locations of people from a query to the parent component
  @Output() locationEvent = new EventEmitter();

  /**
   * Creates a new table for people.
   *
   * @param queryService The query service for SPARQL queries
   */
  constructor(private queryService: QueryService) {
    this.peopleDataSource = new MatTableDataSource();
  }

  /**
   * When the table is initialized, create the table's data source, fetch
   * the first set of results, show them, and then count them.
   */
  ngOnInit(): void {
    this.peopleDataSource = new MatTableDataSource(this.people);
    this.populateTable();
    this.queryService.getPeopleCount(this.pageSize * 10).subscribe({
      next: response => {
        let results = this.queryService.getResults(response)
        this.totalSize = results[0]['COUNT']['value'];
        // Update the number of results
        this.resultsCountEvent.emit(this.totalSize);
      },
      error: response => {
        console.error("There was an error while retrieving the number of results", response)
      }
    })
  }

  /**
   * Once the view has been initialized, catch any events on the paginator
   * to update the table.
   */
  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.pageSize = event.pageSize;
      let offset = event.pageIndex*this.pageSize;
      this.populateTable(offset);
    });
  }

  /**
   * Populates the data table with people. Because the user may be on a different table page than 1, it accepts an 'offset' parameter
   * which gets inserted into the subsequent query.
   * @param offset The query offset
   */
   populateTable(offset:number=0) {
    this.queryService.getAllPeople(this.pageSize, offset).subscribe({
      next: response => {
        let results = this.queryService.getResults(response);
        this.locations = [];
        this.people = [];
        for (var result of results) {
          let expertise: Array<[string, string]> =[]
          expertise =  result["expertise"]["value"].split(', ').map(function (x, i) {
            return [x, result["expertiseLabel"]["value"].split(', ')[i]]
          });
           this.people.push({
            "name": result["label"]["value"],
            "name_uri": result["entity"]["value"],
            "affiliation": result["affiliationLabel"]["value"],
            "affiliation_uri": result["affiliation"]["value"],
            "expertise": expertise.slice(0, 5),
            "place": result["affiliationQuantName"]? result["affiliationQuantName"]["value"]: "",
            "place_uri": result["affiliationLoc"]? result["affiliationLoc"]["value"]: ""
          });
          if (result['wkt']){
            this.locations.push(result['wkt']['value']);
          }
        }
        this.peopleDataSource = new MatTableDataSource(this.people);
        this.searchQueryFinishedEvent.emit(true);
        this.locationEvent.emit(this.locations);
      }
   });
  }
}

/**
 * Prototype for a row in the table; represents a Person.
 */
export interface Person {
  name: string,
  name_uri: string,
  affiliation: string,
  affiliation_uri: string,
  expertise: Array<[SafeResourceUrl, string]>,
  place: string,
  place_uri: string,
}

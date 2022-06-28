import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { QueryService } from '../services/query.service'

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
  places: Array<Place> = [];
  // The number of results that the user wants to see in the table
  public pageSize = 20;
  // The current table page that the user is on
  public currentPage = 0;
  // The number of results
  public totalSize = 0;
  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();
  // Event that notifies the parent component that a query has finished
  @Output() searchQueryFinishedEvent = new EventEmitter<boolean>();
  // Testing....
  @Output() testEvent = new EventEmitter<number>();
  // Paginator for the results
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Event that sends the locations of results from a query to the parent component
  locations: Array<string> = [];
  @Output() locationEvent = new EventEmitter();

  constructor(private queryService: QueryService) {
    // Initialize the places data to an empty array
    this.placesDataSource = new MatTableDataSource();
   }

  ngOnInit(): void {
    this.placesDataSource = new MatTableDataSource(this.places);
    this.populateTable();
    this.getResultsSize();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.pageSize = event.pageSize;
      let offset = event.pageIndex*this.pageSize;
      this.populateTable(offset);
      this.getResultsSize();
    });
  }

  /**
   * Retrieves the number of results for a query and updates the count in the UI
  */
  getResultsSize() {
    this.queryService.getPlacesCount(this.pageSize * 10).subscribe({
      next: response => {
        let results = this.queryService.getResults(response)
        this.totalSize = results[0]['COUNT']['value'];
        // Update the number of results
        this.resultsCountEvent.emit(this.totalSize);
        this.testEvent.emit(500);
      },
      error: response => {
        console.error("There was an error while retrieving the number of results", response)
      }
    });
  }

  /**
   * Populates the data table with places. Because the user may be on a different table page than 1, it accepts an 'offset' parameter
   * which gets inserted into the subsequent query.
   * @param offset The query offset
   * @param count The number of results to retrieve
   */
   populateTable(offset:number=0, count: number=20) {

    // A map of a place's URI to its properties that are retrieved from the database
    this.queryService.getAllPlaces(count, offset).subscribe({
      next: response => {
        let results = this.queryService.getResults(response)
        console.log("place results: ", results);
        this.places = [];
        this.locations = [];
        for (var result of results) {
          this.places.push({
            "name": result["label"]["value"],
            "type": result["typeLabel"]["value"],
          });
          if (result['geo']){
            this.locations.push(result['geo']['value']);
          }
        }
        this.placesDataSource = new MatTableDataSource(this.places);
        this.searchQueryFinishedEvent.emit(true);
        this.locationEvent.emit(this.locations);
      }
   });
  }
}
// Prototype for Places
export interface Place {
  name: string;
  type: string,
}

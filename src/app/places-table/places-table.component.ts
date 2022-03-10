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
  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();
  // Paginator attached to the table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // The number of results that the user wants to see in the table
  public pageSize = 20;
  // The current table page that the user is on
  public currentPage = 0;
  // The number of results
  public totalSize = 0;

  constructor(private queryService: QueryService) {
    // Initialize the places data to an empty array
    this.placesDataSource = new MatTableDataSource();
   }

  ngOnInit(): void {
    this.placesDataSource = new MatTableDataSource(this.places);
    this.populateTable();
    this.queryService.getPlacesCount().subscribe({
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

  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.pageSize = event.pageSize;
      let offset = event.pageIndex*this.pageSize;
      this.populateTable(offset);
    });
  }

  /**
   * Populates the data table with places. Because the user may be on a different table page than 1, it accepts an 'offset' parameter
   * which gets inserted into the subsequent query.
   * @param offset The query offset
   */
   populateTable(offset:number=0) {
    // A map of a place's URI to its properties that are retrieved from the database
    this.queryService.getAllPlaces(this.pageSize, offset).subscribe({
      next: response => {
        let results = this.queryService.getResults(response)
        this.places = [];
        for (var result of results) {
          this.places.push({
            "name": result["label"]["value"],
            "type": result["typeLabel"]["value"],
          })
        }
        this.placesDataSource = new MatTableDataSource(this.places);
      }
   });
  }
}
// Prototype for Places
export interface Place {
  name: string;
  type: string,
}

import { Component, OnInit, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { QueryService } from '../services/query.service'

/**
 * Component for the places table. This component is responsible for representing the
 * data table on the 'Places' tab.
 */
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
  // The query offset
  private offset = 0;
  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();
  // Event that notifies the parent component that a query has finished
  @Output() searchQueryFinishedEvent = new EventEmitter<boolean>();
  // Used to trigger the error modal
  @Output() errorModal = new EventEmitter<void>();
  // Paginator for the results
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Event that sends the locations of results from a query to the parent component
  locations: Array<string> = [];
  @Output() locationEvent = new EventEmitter();
  // Event that notifies the parent component that a query has started
  @Output() searchQueryStartedEvent = new EventEmitter<boolean>();
  // Triggered on paginations. It tells the search component to trigger a table refresh (sending the facet data)
  @Output() paginationEvent = new EventEmitter<void>();

  /**
   * Creates a new table for the place results.
   *
   * @param queryService The query service for SPARQL queries.
   */
  constructor(private queryService: QueryService) {
    // Initialize the places data to an empty array
    this.placesDataSource = new MatTableDataSource();
  }

  /**
   * When ready, initialize the data source and get the search results.
   */
  ngOnInit(): void {
    this.placesDataSource = new MatTableDataSource(this.places);
    this.populateTable();
    this.totalSize = 0;
    this.resultsCountEvent.emit(this.totalSize);
  }

  /**
  * Once the view has been initialized, catch any events on the paginator
  * to update the table.
  */
  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.pageSize = event.pageSize;
      this.offset = event.pageIndex * this.pageSize;
      this.paginationEvent.emit();
    });
  }

  /**
 * The changes are directed by the search component, hence an empty event listener
 *
 * @param changes The change event
 */
  ngOnChanges(changes: SimpleChanges) { }

  /**
   * Populates the data table with places. Because the user may be on a different table page than 1, it accepts an 'offset' parameter
   * which gets inserted into the subsequent query.
   * @param offset The query offset
   * @param count The number of results to retrieve
   */
  populateTable(facets = {}) {
    this.searchQueryStartedEvent.emit();
    this.places = [];
    this.placesDataSource = new MatTableDataSource(this.places);
    // A map of a place's URI to its properties that are retrieved from the database

    this.queryService.getPlaces(facets, this.pageSize, this.offset).then((results: any) => {
      this.places = [];
      this.locations = [];
      // Check to see if the query failed
      if (results === false) {
        this.totalSize = 0;
        this.resultsCountEvent.emit(this.totalSize);
        this.searchQueryFinishedEvent.emit(true);
        this.errorModal.emit();
        return;
      }
      results.records.forEach(result => {
        this.places.push({
          "name": result["place_name"],
          "nameUri": result["place"],
          "type": result["place_type_name"],
          "typeUri": result["place_type"],
        });
        if (result['wkt']) {
          this.locations.push(result['wkt']);
        }
      });
      this.placesDataSource = new MatTableDataSource(this.places);
      this.queryService.query(`SELECT (COUNT(*) as ?count) { ` + results.query + 'LIMIT ' + this.pageSize * 10 + ` }`).then((res) => {
        console.log("res: ", res)
        this.totalSize = res.results.bindings[0].count.value;
        // Update the number of results
        this.resultsCountEvent.emit(this.totalSize);
        this.searchQueryFinishedEvent.emit(true);
      })
      this.locationEvent.emit(this.locations);
    });
  }
}

/**
 * Prototype for a row in the table; represents a Place.
 */
export interface Place {
  name: string,
  nameUri: string;
  type: string,
  typeUri: string,
}

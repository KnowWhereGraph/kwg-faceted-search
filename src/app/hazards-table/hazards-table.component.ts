import { Component, OnInit, Output, EventEmitter, SimpleChanges, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table';
import { QueryService } from '../services/query.service';

/**
 * Component that represents a table of Hazards. This is the component that
 * is rendered when users select the 'Hazards' tab on the main search landing page.
 * It's responsible for populating itself and catching events from the Facets Component
 * when facets are selected (so that it knows to fetch new data).
 */
@Component({
  selector: 'app-hazards-table',
  templateUrl: './hazards-table.component.html',
  styleUrls: ['./hazards-table.component.scss']
})
export class HazardsTableComponent implements OnInit {
  // Holds all of the hazards that are actively being displayed in the table
  hazards: Array<Hazard> = [];
  // Columns for the table
  hazardColumns: Array<String> = ["name", "type", "place", "startDate", "endDate"];
  // The data source that's responsible for fetching data
  hazardsDataSource: MatTableDataSource<Hazard>;
  // Pagniator on the table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // The number of results that the user wants to see in the table
  public pageSize = 20;
  // The current table page that the user is on
  public currentPage = 0;
  // The number of results. This is used by the paginator to create the page numbers
  public totalSize = 0;
  // The page offset
  private offset = 0;
  private facets = {};
  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();
  // Event that notifies the parent component that a query has finished
  @Output() searchQueryFinishedEvent = new EventEmitter<boolean>();
  // Event that notifies the parent component that a query has started
  @Output() searchQueryStartedEvent = new EventEmitter<boolean>();
  // Triggered on paginations. It tells the search component to trigger a table refresh (sending the facet data)
  @Output() paginationEvent = new EventEmitter<void>();
  // Event that sends the locations of hazards from a query to the parent component. This
  // is used in the map display
  locations: Array<string> = [];
  @Output() locationEvent = new EventEmitter();

  /**
   * Creates a new Hazards-table component. It initializes a new data source
   * for the data table.
   * @param queryService The query service so that SPARQL queries can be sent to fetch data.
   */
  constructor(private queryService: QueryService) {
    this.hazardsDataSource = new MatTableDataSource();
  }

  /**
   * When the component is ready, initialize the table source,
   * displays the results, and then counts the number of results.
   */
  ngOnInit(): void {
    this.hazardsDataSource = new MatTableDataSource(this.hazards);
  }

  /**
   * The changes are directed by the search component, hence an empty event listener
   *
   * @param changes The change event
   */
  ngOnChanges(changes: SimpleChanges) { }


  /**
   * Once the view has finished initializing, make the paginator subscribe
   * to user clicks which either change the page or page size.
   */
  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.pageSize = event.pageSize;
      this.offset = event.pageIndex * this.pageSize;
      this.paginationEvent.emit();
    });
  }

  /**
   * Retrieves the number of results for a query and updates the count in the UI
   */
  getResultsSize() {
    this.queryService.getHazardCount(this.pageSize * 10, this.currentPage).subscribe({
      next: response => {
        let results = this.queryService.getResults(response)
        this.totalSize = results[0]['COUNT']['value'];
        // Update the number of results
        this.resultsCountEvent.emit(this.totalSize);
      },
      error: response => {
        console.error("There was an error while retrieving the number of results", response)
      }
    });
  }

  populateTable(facets = {}) {
    if (Object.keys(facets).length) {
      this.facets = facets;
    }

    this.searchQueryStartedEvent.emit();
    // Clear the current results set so that the table is blank
    this.hazards = [];
    this.hazardsDataSource = new MatTableDataSource(this.hazards);
    // A map of a hazard's URI to its properties that are retrieved from the database
    let hazardRecords = new Map<string, any>();
    // Get a list of all the hazards and their associated properties. Start by first getting a list of all the
    // hazard URI's.
    this.queryService.getHazardSearchResults(facets, this.pageSize, this.offset).then((results: any) => {
      // Once the hazards have been retrieved, attempt to get the associated properties
      let hazardUris: Array<string> = [];
      this.locations = [];
      // Once the initial list of hazards is retrieved, create a list of URIs and get additional information about them
      results.record.forEach(row => {
        let entityUri = row['hazard'];
        let entityInfo = {
          "name": row["hazard_name"],
          "nameUri": row["hazard_type"],
          "type": row["hazard_type_name"],
          "typeUri": row["type"],
        }
        // Save the name and type of the hazard for later
        hazardRecords.set(entityUri, entityInfo);
        // Replace the prefixed URI part so we don't have to escape the slashes in the query
        entityUri = entityUri.replace('http://stko-kwg.geog.ucsb.edu/lod/resource/', 'kwgr:')
        // Make a list of all the hazards that we want properties for
        hazardUris.push(entityUri);
      });

      this.queryService.query(`SELECT (COUNT(*) as ?count) {` + results.query + ` LIMIT` + this.pageSize * 10 + `}`).then((res) => {
        this.totalSize = res.results.bindings[0].count.value;
        // Update the number of results
        this.resultsCountEvent.emit(this.totalSize);
      })
      this.queryService.getHazardProperties(hazardUris, this.pageSize).subscribe({
        next: response => {
          // Once all of the properties have been retrieved, populate the table
          let hazard_properties = this.queryService.getResults(response);
          this.hazards = [];
          hazard_properties.forEach(row => {
            let record = hazardRecords.get(row.entity.value);
            record.entityUri = row.entity.value;
            record.place = (typeof row.place === 'undefined') ? '' : row.place.value;
            record.placeName = (typeof row.placeQuantName === 'undefined') ? '' : row.placeQuantName.value;
            record.placeWkt = (typeof row.placeWkt === 'undefined') ? '' : row.placeWkt.value;
            record.startDate = (typeof row.time === 'undefined') ? '' : row.time.value;
            record.startDateName = (typeof row.startTimeLabel === 'undefined') ? '' : row.startTimeLabel.value;
            record.endDate = (typeof row.time === 'undefined') ? '' : row.time.value;
            record.endDateName = (typeof row.endTimeLabel === 'undefined') ? '' : row.endTimeLabel.value;
            record.wkt = (typeof row.wkt === 'undefined') ? '' : row.wkt.value;
            let resTypes = row["typeLabel"]["value"].split(',').filter(function (resType) { return (resType !== "NIFCWildfire") })
            let types: Array<[string, string]> = [];
            types = row.type.value.split(",").map(function (x, i) {
              return [x, resTypes[i]]
            });
            let new_record = {
              name: record.name,
              entityUri: record.entityUri,
              type: types,
              place: record.placeName,
              placeUri: record.place,
              startDateUri: record.startDate,
              startDate: record.startDateName,
              endDateUri: record.endDate,
              endDate: record.endDateName,
              dateUri: record.time,
              wkt: record.wkt
            }
            this.hazards.push(new_record);
            if (record.wkt) {
              this.locations.push(record.wkt);
            }
          });
          this.hazardsDataSource = new MatTableDataSource(this.hazards);
          this.searchQueryFinishedEvent.emit(true);
          this.locationEvent.emit(this.hazards);
        },
        error: error => {
          console.error("Error getting the hazard properties", error)
        }
      })
    })
  }
}

/**
 * Prototype for a hazard row. It contains information about the hazard
 * that the user sees.
 */
export interface Hazard {
  name: string;
  entityUri: string,
  type: Array<[string, string]>,
  place: string,
  placeUri: string,
  startDateUri: string,
  startDate: string,
  endDateUri: string,
  endDate: string,
  dateUri: string,
}

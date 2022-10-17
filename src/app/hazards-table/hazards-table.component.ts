import { error } from '@angular/compiler/src/util';
import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
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
  @Input() hazardFacets = {};
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
  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();
  // Event that notifies the parent component that a query has finished
  @Output() searchQueryFinishedEvent = new EventEmitter<boolean>();
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
    this.populateTableA();
    //this.getResultsSize();
  }

  /**
   * Once the view has finished initializing, make the paginator subscribe
   * to user clicks which either change the page or page size.
   */
  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.pageSize = event.pageSize;
      let offset = event.pageIndex*this.pageSize;
      this.populateTableA(offset);
      //this.getResultsSize();
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

  /**
   * Populates the data table with hazards. Because the user may be on a different table page than 1, it accepts an 'offset' parameter
   * which gets inserted into the subsequent query.
   *
   * @param offset The query offset
   */
  populateTable(offset:number=0) {
    // A map of a hazard's URI to its properties that are retrieved from the database
    let hazardRecords = new  Map<string, any>();
    // Get a list of all the hazards and their associated properties. Start by first getting a list of all the
    // hazard URI's.
    this.queryService.getAllHazards(this.pageSize, offset).subscribe({
      next: response => {
      // Once the hazards have been retrieved, attempt to get the associated properties
      let results = this.queryService.getResults(response);
      let hazardUris: Array<string> = [];
      this.locations = [];
      // Once the initial list of hazards is retrieved, create a list of URIs and get additional information about them
      for (var result of results) {
        let entityUri = result['entity']['value'];
        let entityInfo = {
          "name": result["label"]["value"],
          "nameUri": result["entity"]["value"],
          "type": result["typeLabel"]["value"],
          "typeUri": result["type"]["value"],
        }
        // Save the name and type of the hazard for later
        hazardRecords.set(entityUri, entityInfo);
        // Replace the prefixed URI part so we don't have to escape the slashes in the query
        entityUri = entityUri.replace('http://stko-kwg.geog.ucsb.edu/lod/resource/', 'kwgr:')
        // Make a list of all the hazards that we want properties for
        hazardUris.push(entityUri);
      }
      this.queryService.getHazardProperties(hazardUris).subscribe({
        next: response => {
          // Once all of the properties have been retrieved, populate the table
          results = this.queryService.getResults(response);
          this.hazards = [];
          for (var row of results) {
            let record = hazardRecords.get(row.entity.value);
            record.place = (typeof row.place === 'undefined') ? '' : row.place.value;
            record.placeName = (typeof row.placeQuantName === 'undefined') ? '' : row.placeQuantName.value;
            record.placeWkt = (typeof row.placeWkt === 'undefined') ? '' : row.placeWkt.value;
            record.startDate = (typeof row.time === 'undefined') ? '' : row.time.value;
            record.startDateName = (typeof row.startTimeLabel === 'undefined') ? '' : row.startTimeLabel.value;
            record.endDate = (typeof row.time === 'undefined') ? '' : row.time.value;
            record.endDateName = (typeof row.endTimeLabel === 'undefined') ? '' : row.endTimeLabel.value;
            record.wkt = (typeof row.wkt === 'undefined') ? '' : row.wkt.value;
            let resTypes = row["typeLabel"]["value"].split(',').filter(function(resType) { return (resType !== "NIFCWildfire") })
            let types: Array<[string, string]> = [];
            types = row.type.value.split(",").map(function (x, i) {
              return [x, resTypes[i]]
            });
            this.hazards.push({
              name: record.name,
              entityUri: record.nameUri,
              type: types,
              place: record.placeName,
              placeUri: record.place,
              startDateUri: record.startDate,
              startDate: record.startDateName,
              endDateUri: record.endDate,
              endDate: record.endDateName,
              dateUri: record.time,
            });
            if (record.wkt){
              this.locations.push(record.wkt);
            }
          }
          this.hazardsDataSource = new MatTableDataSource(this.hazards);
          this.searchQueryFinishedEvent.emit(true);
          this.locationEvent.emit(this.locations);
        },
        error: error => {
          console.error("Error getting the hazard properties", error)
        }
      })
      },
      error: error => {
        console.error("Error")
      }
    })
  }


populateTableA(offset:number=0) {
  // A map of a hazard's URI to its properties that are retrieved from the database
  let hazardRecords = new  Map<string, any>();
  // Get a list of all the hazards and their associated properties. Start by first getting a list of all the
  // hazard URI's.
  this.queryService.getHazardSearchResults(this.hazardFacets, this.pageSize, offset).then((results: any) => {
    // Once the hazards have been retrieved, attempt to get the associated properties
    let hazardUris: Array<string> = [];
    this.locations = [];
    // Once the initial list of hazards is retrieved, create a list of URIs and get additional information about them
    console.log("results: ", results)
    for (var result of results.record) {
      let entityUri = result['entity']['value'];
      let entityInfo = {
        "name": result["label"]["value"],
        "nameUri": result["entity"]["value"],
        "type": result["typeLabel"]["value"],
        "typeUri": result["type"]["value"],
      }
      // Save the name and type of the hazard for later
      hazardRecords.set(entityUri, entityInfo);
      // Replace the prefixed URI part so we don't have to escape the slashes in the query
      entityUri = entityUri.replace('http://stko-kwg.geog.ucsb.edu/lod/resource/', 'kwgr:')
      // Make a list of all the hazards that we want properties for
      hazardUris.push(entityUri);
    }
    this.queryService.getHazardProperties(hazardUris).subscribe({
      next: response => {
        // Once all of the properties have been retrieved, populate the table
        results = this.queryService.getResults(response);
        this.hazards = [];
        for (var row of results) {
          let record = hazardRecords.get(row.entity.value);
          record.place = (typeof row.place === 'undefined') ? '' : row.place.value;
          record.placeName = (typeof row.placeQuantName === 'undefined') ? '' : row.placeQuantName.value;
          record.placeWkt = (typeof row.placeWkt === 'undefined') ? '' : row.placeWkt.value;
          record.startDate = (typeof row.time === 'undefined') ? '' : row.time.value;
          record.startDateName = (typeof row.startTimeLabel === 'undefined') ? '' : row.startTimeLabel.value;
          record.endDate = (typeof row.time === 'undefined') ? '' : row.time.value;
          record.endDateName = (typeof row.endTimeLabel === 'undefined') ? '' : row.endTimeLabel.value;
          record.wkt = (typeof row.wkt === 'undefined') ? '' : row.wkt.value;
          let resTypes = row["typeLabel"]["value"].split(',').filter(function(resType) { return (resType !== "NIFCWildfire") })
          let types: Array<[string, string]> = [];
          types = row.type.value.split(",").map(function (x, i) {
            return [x, resTypes[i]]
          });
          this.hazards.push({
            name: record.name,
            entityUri: record.nameUri,
            type: types,
            place: record.placeName,
            placeUri: record.place,
            startDateUri: record.startDate,
            startDate: record.startDateName,
            endDateUri: record.endDate,
            endDate: record.endDateName,
            dateUri: record.time,
          });
          if (record.wkt){
            this.locations.push(record.wkt);
          }
        }
        this.hazardsDataSource = new MatTableDataSource(this.hazards);
        this.searchQueryFinishedEvent.emit(true);
        this.locationEvent.emit(this.locations);
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

import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table';
import { QueryService } from '../services/query.service'

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
  // The number of results
  public totalSize = 0;

  // Event that sends the number of results from a query to the parent component
  @Output() resultsCountEvent = new EventEmitter<number>();
  // Event that notifies the parent component that a query has finished
  @Output() searchQueryFinishedEvent = new EventEmitter<boolean>();

  constructor(private queryService: QueryService) {
    this.hazardsDataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.hazardsDataSource = new MatTableDataSource(this.hazards);
    this.populateTable();
    this.queryService.getHazardCount().subscribe({
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
   * Populates the data table with hazards. Because the user may be on a different table page than 1, it accepts an 'offset' parameter
   * which gets inserted into the subsequent query.
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
      let results = this.queryService.getResults(response)
      let hazardUris: Array<string> = [];

      // Once the initial list of hazards is retrieved, create a list of URIs and get additional information about them
      for (var result of results) {
        let entityUri = result['entity']['value'];
        let entityInfo = {
          "name": result["label"]["value"],
          "type": result["typeLabel"]["value"],
        }
        // Save the name and type of the hazard for later
        hazardRecords.set(entityUri, entityInfo);
        // Replace the prefixed URI part so we don't have to escape the slashes in the query
        entityUri = entityUri.replace('http://stko-kwg.geog.ucsb.edu/lod/resource/', 'kwgr:')
        // Make a list of all the hazards that we want properties for
        hazardUris.push(entityUri)
      }
      this.queryService.getHazardProperties(hazardUris).subscribe({
        next: response => {
          // Once all of the properties have been retrieved, populate the table
          results = this.queryService.getResults(response)
          this.hazards = [];
          for (var row of results) {
            let record = hazardRecords.get(row.entity.value);
            record.place = (typeof row.place === 'undefined') ? '' : row.place.value;
            record.placeName = (typeof row.placeLabel === 'undefined') ? '' : row.placeLabel.value;
            record.placeWkt = (typeof row.placeWkt === 'undefined') ? '' : row.placeWkt.value;
            record.startDate = (typeof row.time === 'undefined') ? '' : row.time.value;
            record.startDateName = (typeof row.startTimeLabel === 'undefined') ? '' : row.startTimeLabel.value;
            record.endDate = (typeof row.time === 'undefined') ? '' : row.time.value;
            record.endDateName = (typeof row.endTimeLabel === 'undefined') ? '' : row.endTimeLabel.value;
            record.wkt = (typeof row.wkt === 'undefined') ? '' : row.wkt.value;

            this.hazards.push({
              name: record.name,
              type: record.type,
              place: record.placeName,
              startDate: record.startDateName,
              endDate: record.endDateName,
            })
          }
          this.hazardsDataSource = new MatTableDataSource(this.hazards);
          this.searchQueryFinishedEvent.emit(true);
        },
        error: error => {
          console.log("Error getting the hazard properties", error)
        }
      })
      },
      error: error => {
        console.log("Error")
        console.log(error)
      }
    })
  }
}

// Prototype for Hazard
export interface Hazard {
  name: string;
  type: string,
  place: string,
  startDate: string,
  endDate: string,
}

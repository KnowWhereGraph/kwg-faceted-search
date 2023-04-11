import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table';
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
  // Query offset
  private offset = 0;
  // Holds the locations of the results
  locations: Array<string> = [];
  // Event that sends the locations of people from a query to the parent component
  @Output() locationEvent = new EventEmitter();
  // Event that notifies the parent component that a query has started
  @Output() searchQueryStartedEvent = new EventEmitter<boolean>();
  // Triggered on paginations. It tells the search component to trigger a table refresh (sending the facet data)
  @Output() paginationEvent = new EventEmitter<void>();
  // Used to trigger the error modal
  @Output() errorModal = new EventEmitter<void>();

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
  }

  /**
   * Once the view has been initialized, catch any events on the paginator
   * to update the table.
   */
  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.pageSize = event.pageSize;
      this.offset = event.pageIndex * this.pageSize;
      this.searchQueryStartedEvent.emit();
      this.paginationEvent.emit();
    });
  }

  /**
 * The changes are directed by the search component, hence an empty event listener
 *
 * @param changes The change event
 */
  ngOnChanges(changes: SimpleChanges) {
  }


  /**
   * Populates the data table with people. Because the user may be on a different table page than 1, it accepts an 'offset' parameter
   * which gets inserted into the subsequent query.
   *
   * @param offset The query offset
   */
  populateTable(facets = {}) {
    // Retrieves a list of all the potential subtopics for each topic. If there aren't any,
    // use the existing values in expertiseTopicFacets
    if (facets['expertiseTopics'] !== undefined && facets['expertiseTopics'].length) {
      let expertiseTopics = facets['expertiseTopics'];
      this.queryService.getSubTopics(expertiseTopics).subscribe({
        next: response => {
          if (response === false) {
            this.totalSize = 0
            this.resultsCountEvent.emit(this.totalSize);
            this.searchQueryFinishedEvent.emit(true);
            this.errorModal.emit();
            return;
          }
          let results = this.queryService.getResults(response);
          results = results.map(res => {
            return res['sub_topic']['value'];
          });
          if (!results.length) {
            results = expertiseTopics
          }
          facets['expertiseTopics'] = results;
          this.queryPeople(facets);
        },
        error: response => {
          console.error("There was an error while retrieving subtopics", response);
          this.totalSize = 0
          this.resultsCountEvent.emit(this.totalSize);
          this.searchQueryFinishedEvent.emit(true);
          this.errorModal.emit();
          return;
        }
      });
    } else {
      this.queryPeople(facets);
    }
  }

  /**
   * Queries the database for people and populates the table with the results.
   *
   * @param expertiseTopicFacets An array of URIs of expert topics
   */
  queryPeople(facets) {
    this.queryService.getAllPeople(facets['expertiseTopics'], facets['keyword'], this.pageSize, this.offset).then((response: any) => {
      this.locations = [];
      this.people = [];
      if (response === false) {
        this.totalSize = 0
        this.resultsCountEvent.emit(this.totalSize);
        this.searchQueryFinishedEvent.emit(true);
        this.errorModal.emit();
        return;
      }
      response.results['results']['bindings'].forEach(result => {
        let expertise: Array<[string, string]> = []
        expertise = result["expertise"]["value"].split(', ').map(function (x, i) {
          return [x, result["expertiseLabel"]["value"].split(', ')[i]]
        });
        this.people.push({
          "affiliation": result["affiliationLabel"]["value"],
          "affiliation_uri": result["affiliation"]["value"],
          "email": result["email"] ? result["email"]["value"] : "",
          "expertise": expertise.slice(0, 5),
          "homepage": result["homepage"] ? result["homepage"]["value"] : "",
          "name": result["label"]["value"],
          "name_uri": result["entity"]["value"],
          "phone": result["phone"] ? result["phone"]["value"] : "",
          "place": result["affiliationQuantName"] ? result["affiliationQuantName"]["value"] : "",
          "place_uri": result["affiliationLoc"] ? result["affiliationLoc"]["value"] : "",
          "wkt": result["wkt"]["value"]
        });
      });
      this.peopleDataSource = new MatTableDataSource(this.people);
      this.searchQueryFinishedEvent.emit(true);
      this.queryService.query(`select (count(*) as ?count) { ` + response.query + ` } LIMIT 200`).then((res) => {
        this.totalSize = res.results.bindings[0].count.value;
        // Update the number of results
        this.resultsCountEvent.emit(this.totalSize);
        this.searchQueryFinishedEvent.emit(true);
      })
      this.locationEvent.emit(this.people);
    });
  }
  /**
   * Triggered to count the number of experts that have expertise in
   * a particular field.
   */
  countResults(facets) {
    if (facets['expertiseTopics'] !== undefined && facets['expertiseTopics'].length) {
      let expertiseTopics: Array<string>;
      expertiseTopics = facets['expertiseTopics'].map(expertiseTopic => {
        return expertiseTopic['data']['uri']
      });
      this.queryService.getSubTopics(expertiseTopics).subscribe({
        next: response => {
          if (response === false) {
            this.totalSize = 0
            this.resultsCountEvent.emit(this.totalSize);
            this.searchQueryFinishedEvent.emit(true);
            this.errorModal.emit();
            return;
          }
          let results = this.queryService.getResults(response);
          results = results.map(res => {
            return res['sub_topic']['value']
          });
          if (!results.length) {
            results = expertiseTopics
          }
          this.getPeopleCount(results)
        },
        error: response => {
          console.error("There was an error while finding subtopics", response)
        }
      })
    } else {
      this.getPeopleCount(facets)
    }
  }

  /**
     * Counts the number of experts that are expertise in the fields contained
     * in expertiseTopics.
     *
     * @param expertiseTopics An array of expert topic URIs
     */
  getPeopleCount(facets) {
    this.queryService.getPeopleCount(facets['expertiseTopics'], facets['keyword'], this.pageSize * 10).subscribe({
      next: response => {
        if (response === false) {
          this.totalSize = 0
          this.resultsCountEvent.emit(this.totalSize);
          this.searchQueryFinishedEvent.emit(true);
          this.errorModal.emit();
          return;
        }
        let results = this.queryService.getResults(response)
        this.totalSize = results[0]['COUNT']['value'];
        // Update the number of results
        this.resultsCountEvent.emit(this.totalSize);
      },
      error: response => {
        this.totalSize = 0
        this.resultsCountEvent.emit(this.totalSize);
        this.searchQueryFinishedEvent.emit(true);
        this.errorModal.emit();
        return;
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
  phone: string,
  email: string,
  homepage: string,
  wkt: string
}

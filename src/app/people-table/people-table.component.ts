import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
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
  @Input() peopleFacets = {};
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
   * Called when users make facet selections
   *
   * @param changes The change event
   */
  ngOnChanges(changes: SimpleChanges) {
    this.populateTable();
    this.countResults();
  }

  /**
   * Triggered to count the number of experts that have expertise in
   * a particular field.
   */
  countResults() {
    if (this.peopleFacets['expertiseTopics'] !== undefined && this.peopleFacets['expertiseTopics'].length) {
      let expertiseTopics: Array<string>;
      expertiseTopics = this.peopleFacets['expertiseTopics'].map(expertiseTopic => {
        return expertiseTopic['data']['uri']
      });
    this.queryService.getSubTopics(expertiseTopics).subscribe({
      next: response => {
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
      this.getPeopleCount(this.peopleFacets['expertiseTopics'])
    }
  }

  /**
   * Counts the number of experts that are expertise in the fields contained
   * in expertiseTopics.
   *
   * @param expertiseTopics An array of expert topic URIs
   */
  getPeopleCount(expertiseTopics: Array<string>) {
    this.queryService.getPeopleCount(expertiseTopics, this.peopleFacets['keyword'], this.pageSize * 10).subscribe({
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
   * Populates the data table with people. Because the user may be on a different table page than 1, it accepts an 'offset' parameter
   * which gets inserted into the subsequent query.
   *
   * @param offset The query offset
   */
<<<<<<< HEAD
<<<<<<< HEAD
   populateTable(offset:number=0) {
    this.queryService.getAllPeople(this.pageSize, offset).subscribe({
=======
   populateTable(expertiseTopicFacets, offset:number=0) {
=======
   populateTable(offset:number=0) {
    // Retrieves a list of all the potential subtopics for each topic. If there aren't any,
    // use the existing values in expertiseTopicFacets
    if (this.peopleFacets['expertiseTopics'] !== undefined && this.peopleFacets['expertiseTopics'].length) {
      let expertiseTopics = this.peopleFacets['expertiseTopics'].map(expertiseTopic => {
        return expertiseTopic['data']['uri']
    });
    this.queryService.getSubTopics(expertiseTopics).subscribe({
      next: response => {
        let results = this.queryService.getResults(response);
        results = results.map(res => {
          return res['sub_topic']['value']
        });
        if (!results.length) {
          results = expertiseTopics
        }
        this.queryPeople(results, offset);
      },
      error: response => {
        console.error("There was an error while retrieving subtopics", response)
      }
    });
    } else {
      this.queryPeople(this.peopleFacets['expertiseTopics'], offset);
    }
  }
>>>>>>> 5990c42a (Enable querying experts)

  /**
   * Queries the database for people and populates the table with the results.
   *
   * @param expertiseTopicFacets An array of URIs of expert topics
   * @param offset The offset to start at for obtaining experts
   */
  queryPeople(expertiseTopicFacets: Array<string>, offset:number=0) {
<<<<<<< HEAD
    this.queryService.getAllPeople(expertiseTopicFacets, this.pageSize, offset).subscribe({
>>>>>>> 51bce0fa (Sending facet selection from searchComponent to PeopleTableComponent and update people-table)
=======
    this.queryService.getAllPeople(expertiseTopicFacets, this.peopleFacets['keyword'], this.pageSize, offset).subscribe({
>>>>>>> 3fde403d (Support searching for places)
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
      },
      error: response => {
        console.error("There was an error while populating the data table", response)
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

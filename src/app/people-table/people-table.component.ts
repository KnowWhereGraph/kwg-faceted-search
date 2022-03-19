import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'
import {MatTableDataSource} from '@angular/material/table';
import { QueryService } from '../services/query.service'

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

  constructor(private queryService: QueryService) {
    this.peopleDataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.peopleDataSource = new MatTableDataSource(this.people);
    this.populateTable();
    this.queryService.getPeopleCount().subscribe({
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
   * Populates the data table with people. Because the user may be on a different table page than 1, it accepts an 'offset' parameter
   * which gets inserted into the subsequent query.
   * @param offset The query offset
   */
   populateTable(offset:number=0) {

    this.queryService.getAllPeople(this.pageSize, offset).subscribe({
      next: response => {
        let results = this.queryService.getResults(response)
        this.people = [];
        for (var result of results) {
           this.people.push({
            "name": result["label"]["value"],
            "affiliation": "NA",
            "expertise": result["expertiseLabel"]["value"],
            "place": "NA",
          })
        }
        this.peopleDataSource = new MatTableDataSource(this.people);
        this.searchQueryFinishedEvent.emit(true);
      }
   });
  }
}

// Prototype for Person
export interface Person {
  name: string;
  affiliation: string,
  expertise: string,
  place: string,
}

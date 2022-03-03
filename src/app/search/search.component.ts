import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

/**
 * A class that represents the main search page. It controls the logic for handling tab switching (ie clicking 'People', 'Places' or 'Hazards).
 * Based on the tab clicked, it renders the appropriate table component.
 */
export class SearchComponent implements OnInit {

  // The current number of results for a query
  resultsCount: number;
  selectedTabIndex: number = 0;
  constructor(private cd: ChangeDetectorRef) {
    this.resultsCount = 0;
  }

  // An event handler for changes to the number of query results
  changeResultsCount(newCount: number) {
    console.log("Got event")
    this.resultsCount = newCount;

  }

  // An event handler that gets triggered when the tab changes
  onTabChanged(tabChangeEvent: MatTabChangeEvent) {
    let clickedIndex = tabChangeEvent.index;
    console.log("index: " + clickedIndex)
    // Emit the change event to the facets controller

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
}

}


export interface Hazard {
  id: string;
  name: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
}



export interface Person {
  id: string;
  name: string;
  location: string;
  expertise: string;
}

import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatPaginator } from '@angular/material/paginator';
import { PlacesTableComponent } from '../places-table/places-table.component';

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

  // Tracks the active tab
  selectedTabIndex: number = 0;
  // Tracks whether the counting query has finished
  isCounting: boolean;;
  // Tracks whether the searching query has finished
  isSearching: boolean;;
  // The number of results that the user wants to see in the table
  public pageSize: number = 20;
  // The current table page that the user is on
  public currentPage: number = 0;
  // The number of results
  public totalSize: number = 0;
  @ViewChild(MatPaginator) placesPaginator: MatPaginator;

  @ViewChild(PlacesTableComponent) placesTable: PlacesTableComponent;
  /**
   * Create a new search component
   *
   * @param cd
   */
  constructor(private cd: ChangeDetectorRef) {
    this.totalSize = 0;
    this.isCounting = true;
    this.isSearching = true;
  }

  // An event handler for changes to the number of query results
  changeResultsCount(newCount: number) {
    this.totalSize = newCount;
    this.isCounting = false;
  }

  /**
   * Event handler that gets triggered by a child component when a main
   * search query finishes
   */
  searchQueryFinished() {
    this.isSearching = false;
  }

  // An event handler that gets triggered when the tab changes
  onTabChanged(tabChangeEvent: MatTabChangeEvent) {
    let clickedIndex = tabChangeEvent.index;
    // When the tab changes the child component runs the counting and search queries
    // Update the corresponding state variables to reflect this
    this.isCounting = true;
    this.isSearching = true;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
    this.placesPaginator.page.subscribe((event) => {
      this.pageSize = event.pageSize;
      let offset = event.pageIndex * this.pageSize;
      this.placesTable.populateTable(offset, this.pageSize);
    });
  }

}

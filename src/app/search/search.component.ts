import { ActivatedRoute, Router } from '@angular/router';
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

  /**
   * test for communication between facetComponent and searchComponent
   */
  searchFacets = {};
  changeFacets(selectedFacets: object){
    this.searchFacets = selectedFacets;
  }

  @ViewChild(PlacesTableComponent) placesTable: PlacesTableComponent;

  // variable to hold the data from the place/hazard/people component.
  public returnedLocations: any;

  // public testValue: number = 0;
  /**
   * Create a new search component
   *
   * @param cd
   * @param route: The activated route for this page
   * @param router: The global router
   */
  constructor(private cd: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {
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

    let clickedTabName = "place";
    switch (clickedIndex){
      case 0:
        clickedTabName = "place";
        break
      case 1:
        clickedTabName = "hazard";
        break
      case 2:
        clickedTabName = "people";
    }
    const queryParams = { tab: clickedTabName };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });

  }

  ngOnInit(): void {
    // Check to see if a particular tab should be loaded
    let tab = this.route.snapshot.queryParamMap.get('tab');
    // if(tab) {
    //     this.selectedTabIndex=Number(tab);
    // }
    switch (tab){
      case "place":
        this.selectedTabIndex = Number(0);
        break;
      case "hazard":
        this.selectedTabIndex = Number(1);
        break;
      case "person":
        this.selectedTabIndex = Number(2);
        break;
    }
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  // getTestEventValue(testNumber: number){
  //   console.log("print the test value: ", testNumber);
  //   this.testValue = testNumber;
  //   console.log("test value is : ", testNumber);
  // }

  // changeResultsCount(newCount: number) {
  //   this.totalSize = newCount;
  //   this.isCounting = false;
  // }

  getPlaceLocationEvent(values){

    this.returnedLocations = values;
  }

  getHazardLocationEvent(values){
    this.returnedLocations = values;
  }

  getPeopleLocationEvent(values){

    this.returnedLocations = values;
  }

  getLocationsFromComponent(values){
    this.returnedLocations = values;
  }




}
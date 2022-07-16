import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
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

<<<<<<< HEAD
<<<<<<< HEAD
    // this.testValue = 0;
=======
>>>>>>> 38f7329d (Add the current tab to the query parameters and navigate to the correct tab based on them)
=======
>>>>>>> c829d74e (merge change)
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

  @ViewChild('mapChild')
  public mapChild: any;



  getPlaceLocationEvent(values){
    this.returnedLocations = values;

    console.log(this.mapChild.displayClustersForTab("place", values));
  }

  getHazardLocationEvent(values){
    this.returnedLocations = values;

    console.log(this.mapChild.displayClustersForTab("hazard", this.returnedLocations));
  }

  getPeopleLocationEvent(values){
    this.returnedLocations = values;

    console.log(this.mapChild.displayClustersForTab("people", values));
  }

  getLocationsFromComponent(values){
    this.returnedLocations = values;
  }




}

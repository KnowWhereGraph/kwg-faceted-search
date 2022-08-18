import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PlacesTableComponent } from '../places-table/places-table.component';
/**
 * A component that represents the main search page. It controls the logic for handling tab switching (ie clicking 'People', 'Places' or 'Hazards).
 * Based on the tab clicked, it renders the appropriate table component.
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
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

  /**
   * Create a new search component
   *
   * @param cd The change detector reference to catch events
   * @param route: The activated route for this page
   * @param router: The global router
   */
  constructor(private cd: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {
    this.totalSize = 0;
    this.isCounting = true;
    this.isSearching = true;
<<<<<<< HEAD

<<<<<<< HEAD
<<<<<<< HEAD
    // this.testValue = 0;
=======
>>>>>>> 38f7329d (Add the current tab to the query parameters and navigate to the correct tab based on them)
=======
>>>>>>> c829d74e (merge change)
=======
>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)
  }

  /**
   * An event handler for changes to the number of query results
   *
   * @param newCount The number of results that will be displayed
   */
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

  /**
   * An event handler that gets triggered when the tab changes
   *
   * @param tabChangeEvent The event for the tab change
   */
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

  /**
   * When the initialization is ready, check to see if a particular tab should be
   * navigated to.
   */
  ngOnInit(): void {
    // Check to see if a particular tab should be loaded
    let tab = this.route.snapshot.queryParamMap.get('tab');
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

  /**
   * Once the view is ready, wait for any state changes.
   */
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



  /**
   * Called when an event with a set of locations is triggered
   *
   * @param values The locations in the event
   */
  getPlaceLocationEvent (values){
<<<<<<< HEAD
>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)
=======
>>>>>>> 19451625 (merge the change)
    this.returnedLocations = values;
    console.log(this.mapChild.displayClustersForTab("place", values));
  }

  /**
   * Called when an event with a set of locations is triggered
   *
   * @param values The locations in the event
   */
  getHazardLocationEvent(values){
    this.returnedLocations = values;
    console.log(this.mapChild.displayClustersForTab("hazard", this.returnedLocations));
  }

  /**
   * Called when an event with a set of locations is triggered
   *
   * @param values The locations in the event
   */
  getPeopleLocationEvent(values){
    this.returnedLocations = values;
    console.log(this.mapChild.displayClustersForTab("people", values));
  }
<<<<<<< HEAD
=======

  getLocationsFromComponent(values){
    this.returnedLocations = values;
  }
>>>>>>> 19451625 (merge the change)
}

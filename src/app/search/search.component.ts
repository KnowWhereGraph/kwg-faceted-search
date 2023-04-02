import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

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
<<<<<<< HEAD
=======
  // State of all of the facet values
  facetState = {};

  // Reference to the map component
  @ViewChild('mapChild')
  public mapChild: any;
  // Reference to the places tab
  @ViewChild('placesTable')
  public placesTable: any;
  // Reference to the hazards table
  @ViewChild('hazardsTable')
  public hazardsTable: any;
  // Reference people table
  @ViewChild('peopleTable')
  public peopleTable: any;
  // Reference to the facets component
  @ViewChild('appfacets')
  public appfacets: any;
>>>>>>> e749fcb5 (Refactor query triggering events & partially add places to the map)

  /**
   * Called when a facet changes
   * 
   * @param selectedFacets: object JSON object of the facet state
   */
  changeFacets(selectedFacets: object) {
    this.facetState = selectedFacets;
    // Let the table know that it needs to update. First find out which table is active
    switch (this.selectedTabIndex) {
      case 0:
        this.placesTable.populateTable(selectedFacets);
        break;
      case 1:
        this.hazardsTable.populateTable(selectedFacets);
        break;
      case 2:
        this.peopleTable.populateTable(selectedFacets);
        break;
    }
  }
  // variable to hold the data from the place/hazard/people component.
  public returnedLocations: any;

  /**
   * Create a new search component
   *
   * @param cd The change detector reference to catch events
   * @param route: The activated route for this page
   * @param router: The global router
   */
  constructor(private cd: ChangeDetectorRef, private route: ActivatedRoute, private router: Router, private errorModal: MatDialog) {
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
   * Called when a pagination event is triggered.
   */
  recievedPagination() {
    this.changeFacets(this.appfacets.selectedFacets);
  }

  /**
   * Event handler to set the searching state
   * 
   */
  searchQueryStarted() {
    this.isSearching = true;
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
    switch (clickedIndex) {
      case 0:
        clickedTabName = "place";
        break
      case 1:
        clickedTabName = "hazard";
        break
      case 2:
        clickedTabName = "people";
    }
    //const queryParams = { tab: clickedTabName };

  }

  /**
   * When the initialization is ready, check to see if a particular tab should be
   * navigated to.
   */
  ngOnInit(): void {
    // Check to see if a particular tab should be loaded
    let tab = this.route.snapshot.queryParamMap.get('tab');

    switch (tab) {
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

  /**
   * Called when an event with a set of locations is triggered
   *
   * @param values The locations in the event
   */
<<<<<<< HEAD
  getPlaceLocationEvent (values){
<<<<<<< HEAD
>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)
=======
>>>>>>> 19451625 (merge the change)
=======
  getPlaceLocationEvent(values) {
>>>>>>> 093c3e3c (Format all source fileS)
    this.returnedLocations = values;
<<<<<<< HEAD
<<<<<<< HEAD
    this.mapChild.displayClustersForTab("place", values)
=======
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
=======
    // We don't display place locations; uncomment this when we support it
    //this.mapChild.displayClustersForTab("place", values)
>>>>>>> e749fcb5 (Refactor query triggering events & partially add places to the map)
  }

  /**
   * Called when an event with a set of locations is triggered
   *
   * @param values The locations in the event
   */
  getHazardLocationEvent(values) {
    this.returnedLocations = values;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    this.mapChild.displayClustersForTab("hazard", this.returnedLocations)
=======
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
=======
    //this.mapChild.displayClustersForTab("hazard", this.returnedLocations)
>>>>>>> e749fcb5 (Refactor query triggering events & partially add places to the map)
=======
    this.mapChild.displayClustersForTab("hazard", this.returnedLocations)
>>>>>>> f94feaa9 (Remove unused code)
  }

  /**
   * Called when an event with a set of locations is triggered
   *
   * @param values The locations in the event
   */
  getPeopleLocationEvent(values) {
    this.returnedLocations = values;
<<<<<<< HEAD
<<<<<<< HEAD
    this.mapChild.displayClustersForTab("people", values)
=======
    //this.mapChild.displayClustersForTab("people", values)
>>>>>>> e749fcb5 (Refactor query triggering events & partially add places to the map)
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======

<<<<<<< HEAD
  getLocationsFromComponent(values){
    this.returnedLocations = values;
=======
>>>>>>> 4b4b2ec2 (Revert "1. migrate changes from previous branch to the current one; 2. display markers and clusters on the map according to different tabs selected")
  }
<<<<<<< HEAD
>>>>>>> 19451625 (merge the change)
=======
  // getLocationsFromComponent(values){
  //   this.returnedLocations = values;
  // }
>>>>>>> 9f3ef866 (uncomment console; jsdoc format)
=======

  /**
   * Opens the error modal dialog
   */
  openErrorModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.height = '200px';
    this.errorModal.open(ErrorModalComponent, dialogConfig);
  }
>>>>>>> 04ee827b (Add an error modal)
}
=======




}
>>>>>>> 2faa7dda (Configure SearchComponent for testing its communication with FacetsComponent during expertise topic selection)

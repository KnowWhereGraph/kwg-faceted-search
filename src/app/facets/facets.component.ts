import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QueryService } from '../services/query.service'
import { ITreeOptions, TreeNode, TREE_ACTIONS, IActionMapping, TreeModel } from '@circlon/angular-tree-component'
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

/**
 * Component for the facet panel. This component is responsible for handling the display
 * and event handling of facet selections. When facets are selected, the component
 * fires an event containing a data structure of facet selections for other components
 * to process.
 */
@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.scss']
})
export class FacetsComponent implements OnInit {

  floatLabelControl = new FormControl('auto');
  // The selected facets
  selectedExpertFacets: Array<any> = [];
  // The selected place facets from the tree
  selectedFeatureTypeFacet: Array<any> = [];
  // The current tab that the user selected. This is used to decide which facets to show
  @Input() selectedTabIndex = 0;
  // The keyword that the user put in the search bar
  keyword: string = '';
  // This Administrative Region that the user specified
  adminRegion: string = '';
  // A dict of admin region label -> URI
  adminRegionRecords: Map<string, string> = new Map();
  // The Zip Code that the user has selected
  zipCode: string = '';
  // A dict of zipcode label -> URI
  zipCodeRecords: Map<string, string> = new Map();
  // The Climate Division that the user has selected
  climateDivision: string = '';
  // A dict of division label -> URI
  climateDivsionRecords: Map<string, string> = new Map();
  // The national Weather Zone that the user has selected
  nationalWeatherZone: string = '';
  // Dict of the nwz records of label -> URI
  nationalWeatherZoneRecords: Map<string, string> = new Map();
  // The FIPS code that the user has entered
  fipsCode: string = '';
  // A dict of admin regions label -> URI
  fipsCodeRecords: Map<string, string> = new Map();
  // Container that holds all of the admin regions that are shown on the UI
  administrativeRegionsDisplay: Array<any> = [];
  // Container for all of the hazard classes that are shown in the dropdown selection
  hazardClassesDisplay: Array<any> = [];
  // A dict of GNIS label -> URI
  gnisRecords: Map<string, string> = new Map();
  // Container for all the GNIS classes in the dropdown menu
  gnisClassesDisplay: Array<{ name: string, hasChildren: boolean }> = [];
  // Container for all of the experts in the dropdown facet
  expertClassesDisplay: Array<{ name: string, hasChildren: boolean, uri: string }> = [];
  // The start date of the search
  startDate: string = "";
  // The end date of the search
  endDate: string = "";
  // Flag set when the MTBFire observation collections should be shown
  showMTBFireOC: boolean = false;
  // Flag set when the Earthquake observation collections should be shown
  showEarthquakeOC: boolean = false;
  // Flag set when the NOAA observation collections should be shown
  showNOAAOC: boolean = false;
  // Holds all of the zip codes that are used in autocompletion
  zipCodes: Array<string> = [];
  // Holds all of the National Weather Zones used in autocompletion
  nwZones: Array<string> = []
  // Holds all of the National Weather Zones used in autocompletion
  fipsCodes: Array<string> = [];
  // Holds all of the climate divisions used in autocompletion
  climateDivisions: Array<string> = []
  // Holds all of the administrative regions used in autocompletion
  adminRegions: Array<string> = []

  // An action map that all of the checkbox facets share. It disables highlighting the facet when clicked by
  // doing nothing with the action
  actionMap =  {
    mouse: {
      click: (tree, node, $event) => { }
    },
  }

  /**
   * An angular-tree component definition for specifying node behavior.
   * This specification is specific to the administrative regions list.
   */
  adminRegionOptions: ITreeOptions = {
    getChildren: this.getRegionChildren.bind(this),
    useCheckbox: true,
    actionMapping: this.actionMap,
    idField: "Admin"
  }

  /**
   * An angular-tree component definition for specifying node behavior.
   * This specification is specific to the hazard class list.
   */
  hazardOptions: ITreeOptions = {
    getChildren: this.getHazardChildren.bind(this),
    useCheckbox: true,
    actionMapping: this.actionMap,
    idField: "Hazard"
  }

  /**
   * An angular-tree component definition for specifying node behavior.
   * This specification is specific to the GNIS list.
   */
  gnisOptions: ITreeOptions = {
    getChildren: this.getGNISChildren.bind(this),
    useCheckbox: true,
    actionMapping: this.actionMap,
    idField: "GNIS"
  }

  /**
   * An angular-tree component definition for specifying node behavior.
   * This specification is specific to the expert topics list.
   */
  expertOptions: ITreeOptions = {
    getChildren: this.getExpertChildren.bind(this),
    useCheckbox: true,
    actionMapping: this.actionMap,
    idField: "Expert"
  }

  @Output() facetChangedEvent = new EventEmitter<object>();

  /**
   * Called each time the search page is visited.
   *
   * @param _route The current active route
   * @param router The global Angular router object
   * @param queryService: The query service for making SPARQL calls
   */
  constructor(private _route: ActivatedRoute, private router: Router, private queryService: QueryService) { }

  ngOnInit(): void {
    this.populateDynamicFacets();
    this.fetchTypeaheadData();
  }

  /**
   * Searches a list for potential matches. This is used in the typeahead input fields to match
   * the user's input to an existing zip, fips, etc.
   *
   * @param term Searches a container
   * @param container The array of things being searched.
   * @returns An array of matching items
   */
   searchText(term, container:Array<string>) {
    let matches:Array<string> = [];
    container.forEach(elem => {
      if (elem.toLowerCase().indexOf(term.toLowerCase()) === 0) {
        matches.push(String(elem));
      }
    });
    return matches.slice(0, 10);
  }

  /**
   * Called when the datepicker is used. The signature for a data picking event needs two parameters
   * which is why this function calls facetChanged.
   *
   * @param control The name of the control, this value is not used
   * @param event The selection event
   */
  dateChanged(control: string, event) {
    this.facetChanged(event);
  }
  /**
   * Called when the user inputs text into the ZIP code input box
   * @param text$ The text in the ZIP code field
   * @returns Terms that match the input text
   */
  searchZIPCodes: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []: this.searchText(term, this.zipCodes))
    )
  }

  /**
   * Called when the user inputs text into the FIPS code input box
   * @param text$ The text in the zip code field
   * @returns Terms that match the input text
   */
  searchFIPSCodes: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []: this.searchText(term, this.fipsCodes))
    )
  }

  /**
   * Called when the user inputs text into the National Weather Zone input box
   * @param text$ The text in the NWZ field
   * @returns Terms that match the input text
   */
     searchNWZones: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
      return text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term.length < 2 ? []: this.searchText(term, this.nwZones))
      )
    }

  /**
   * Called when the user inputs text into the National Weather Zone input box
   * @param text$ The text in the NWZ field
   * @returns Terms that match the input text
   */
   searchClimateDivision: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []: this.searchText(term, this.climateDivisions))
    )
  }

  /**
   * Called when the user inputs text into the Administrative Regions input box
   * @param text$ The text in the NWZ field
   * @returns Terms that match the input text
   */
  searchAdminRegions: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []: this.searchText(term, this.adminRegions))
    )
  }

  /**
   * Called when the hazard class is changed. This method exists separately than the other
   * facetChanged method because we want to process observation collections here
   */
  hazardFacetChanged(event: ClickEvent | undefined=undefined) {
    let selected = (eventName: string) => {
      if (eventName === 'select') {
        return true;
      } else if (eventName === 'deselect') {
        return false;
      }
      return undefined;
    }

    if (event && event.node && event.node.data) {
      if (event.node.data.name == 'MTBS Fire') {
        this.showMTBFireOC = selected(event.eventName)? true: false;
      } else if (event.node.data.name == 'Earthquake') {
        this.showEarthquakeOC = selected(event.eventName)? true: false;
      } else if (event.node.data.name == 'NOAA Hurricane Event') {
        this.showNOAAOC = selected(event.eventName)? true: false;
      }
      this.updateUrlParams();
    }
  }

  /**
   * When facet values are changed and the user clicks 'Enter' or 'Search', this method
   * is called. It's responsible for updating the URL query parameters and for letting
   * the sibling components know to update the data table.
   *
   * @param event The event fired from the facet changing
   */
  facetChanged(event: any=undefined) {
    if (event) {
      if (event instanceof KeyboardEvent || event instanceof PointerEvent) {
        // The user pressed enter or clicked 'Search'
        this.updateUrlParams();
        this.updateFacetSelections();
      } else if (event.eventName == 'select' || event.eventName == 'deselect') {
        // The user clicked a checkbox on a facet
        this.updateUrlParams();
        let selected = Object.entries(event.treeModel.selectedLeafNodeIds)
          .filter(([key, value]) => {
            return (value === true);
          }).map((id) => {
            let node = event.treeModel.getNodeById(id[0]);
          return node;
        });
        if (event.treeModel.options.options.idField === "GNIS") {
          this.selectedFeatureTypeFacet = selected;
        } else if (event.treeModel.options.options.idField === "Expert") {
          this.selectedExpertFacets = selected;
        }
        this.updateFacetSelections();
      }
    }
  }

  /**
   * The function to retrieve the selected facets and send them to the parent component SearchComponent.
   */
  updateFacetSelections() {
    let selectedFacets = {'keyword': this.keyword};
    if (this.selectedTabIndex == 0) {
      selectedFacets['adminRegion'] = this.adminRegionRecords.get(this.adminRegion);
      selectedFacets['climateDivision'] = this.climateDivsionRecords.get(this.climateDivision);
      selectedFacets['zipCode'] = this.zipCodeRecords.get(this.zipCode);
      selectedFacets['fipsCode'] = this.fipsCodeRecords.get(this.fipsCode);
      selectedFacets['nationalWeatherZone'] = this.nationalWeatherZoneRecords.get(this.nationalWeatherZone);
      // Select the URI of the GNIS types
      let gnisURIS: Array<string> = new Array();
      this.selectedFeatureTypeFacet.forEach((gnisType) => {
        gnisURIS.push(gnisType.data.uri);
      })
      selectedFacets['gnisType'] = gnisURIS;
    } else if (this.selectedTabIndex == 1)
    {

    }
    else if (this.selectedTabIndex == 2)
    {
      selectedFacets['expertiseTopics'] = this.selectedExpertFacets;
    }
    this.facetChangedEvent.emit(selectedFacets);
  }

  /**
   * Fetches the data for the typeahead input fields. The data is stored in corresponding
   * class member variables.
   */
  fetchTypeaheadData() {
    this.queryService.getZipCodes().subscribe({
      next: response => {
        let responseRows: Array<string> = response.split(/[\n]+/);
        let formatted: Array<any> = [];
        responseRows.forEach((row) => {
          formatted.push(row.split(',')[1])
          this.zipCodeRecords.set(row.split(',')[1], row.split(',')[0])
        });
        formatted.pop();
        this.zipCodes = formatted;
      }
    });

    this.queryService.getFIPSCodes().subscribe({
      next: response => {
        let responseRows: Array<string> = response.split(/[\n]+/);
        let formatted: Array<string> = [];
        responseRows.forEach((row) => {
          formatted.push(row.split(',')[1]);
          this.fipsCodeRecords.set(row.split(',')[1], row.split(',')[0])
        });
        formatted.pop();
        this.fipsCodes = formatted;
      }
    });

    this.queryService.getNWZones().subscribe({
      next: response => {
        let responseRows: Array<string> = response.split(/[\n]+/);
        let formatted: Array<any> = [];
        responseRows.forEach((row) => {
          formatted.push(row.split(',')[1])
          this.nationalWeatherZoneRecords.set(row.split(',')[1], row.split(',')[0])
        });
        formatted.pop();
        this.nwZones = formatted;
      }
    });

    this.queryService.getClimateDivisions().subscribe({
      next: response => {
        // Get an array of rows of the form id,label
        let responseRows: Array<string> = response.split(/[\n]+/);
        let formatted: Array<string> = [];
        responseRows.forEach((row) => {
          formatted.push(row.split(',')[1]);
          this.climateDivsionRecords.set(row.split(',')[1], row.split(',')[0])
        })
        // Remove the last empty line
        formatted.pop()
        this.climateDivisions = formatted;
      }
    });

    this.queryService.getAdministrativeRegions().subscribe({
      next: response => {
        // Get an array of rows of the form id,label
        let responseRows: Array<string> = response.split(/[\n]+/);
        let formatted: Array<string> = [];
        responseRows.forEach((row) => {
          formatted.push((row.split(',')[1]));
          this.adminRegionRecords.set(row.split(',')[1], row.split(',')[0])
        })
        // Remove the last empty line
        formatted.pop()
        this.adminRegions = formatted;
      }
    });
  }

  /**
   * Updates the URL parameters to match the facet value. When a facet value is unused, its value is
   * 'null'. When a facet value is used, and then deleted, its value is an empty string '' (dumb, I know).
   * For these reasons, null and the empty string need to be checked.
   *
   * The general format is, for each facet:
   *  1. Check if it's an empty string. If so make the query param null
   *  3. If not, use the value stored inside
   */
  updateUrlParams() {
    const queryParams: Params = {};
    if (this.adminRegion == '') {
      queryParams['admin_region'] = null;
    } else {
      queryParams['admin_region'] = this.adminRegion;
    }

    if (this.climateDivision == '') {
      queryParams['climate_division'] = null;
    } else {
      queryParams['climate_division'] = this.climateDivision;
    }

    if (this.zipCode == '') {
      queryParams['zip'] = null;
    } else {
      queryParams['zip'] = this.zipCode;
    }

    if (this.nationalWeatherZone == '' || this.nationalWeatherZone == null) {
      queryParams['weather_zone'] = null;
    } else {
      queryParams['weather_zone'] = this.nationalWeatherZone;
    }

    if (this.fipsCode == '' || this.fipsCode == null) {
      queryParams['fips'] = null;
    } else {
      queryParams['fips'] = this.fipsCode;
    }


    // After the query parameters are set, tell the router to navigate to the new page with them,
    // but set it relative to the current route so that the page isn't reloaded
    this.router.navigate(
      [],
      {
        relativeTo: this._route,
        queryParams: queryParams,
      });
  }

  /**
   * A number of the facets depend on values that are either cached in JSON files or
   * ones that are in the database. This method is responsible for querying the dynamic
   * facet data and populating the facets with the results.
   */
  populateDynamicFacets() {
    // Load the initial GNIS classes
    this.queryService.getGNISClasses().subscribe({
      next: response => {
        let results = this.queryService.getResults(response);
        let formatted: Array<any> = [];
        results.forEach((element) => {
          formatted.push({
            name: element['place_label']['value'],
            hasChildren: true,
            uri: element['place']['value']
          });
          this.gnisRecords.set(element['place_label']['value'], element['place']['value'])
        });
        this.gnisClassesDisplay = formatted;
      }
    });

    // Load the top level experts
    this.queryService.getTopLevelExperts().subscribe({
      next: response => {
        let results = this.queryService.getResults(response);
        this.expertClassesDisplay = [];
        results.forEach(element => {
          this.expertClassesDisplay.push({
            name: element['name']['value'],
            hasChildren: element['count']['value'] > 0,
            uri: element['topic']['value'],
          })
        });
      }
    });

    // Load the top level administrative regions (countries)
    this.queryService.getTopLevelAdministrativeRegions().subscribe({
      next: response => {
        let results = this.queryService.getResults(response);
        this.administrativeRegionsDisplay = [];
        results.forEach(element => {
          this.administrativeRegionsDisplay = [{
            name: element['country_label']['value'],
            hasChildren: true,
            level: "country"
          }];
        })
      }
    });

    // Load the top level hazard classes
    this.queryService.getTopLevelHazards().subscribe({
      next: response => {
        let results = this.queryService.getResults(response);
        this.hazardClassesDisplay = [];
        results.forEach(element => {
          this.hazardClassesDisplay.push({
            name: element['hazard_label']['value'],
            hasChildren: element['count']['value'] > 0,
            uri: element['hazard']['value']
          })
        });
      }
    })
  }

  /**
    * Gets the child elements of the state/county tree on the 'Hazards' tab
    * @param node The node that the user selected
  */
  getRegionChildren(node: TreeNode) {
    return new Promise((resolve, reject) => {
      if (node['data']['level'] == 'country') {
        // Get all of the states
        this.queryService.getStateAdministrativeRegions().subscribe({
          next: response => {
            let states: any = new Array();
            let parsedResponse = this.queryService.getResults(response);
            parsedResponse.forEach(element => {
              states.push({
                name: element['state_label']['value'],
                hasChildren: true,
                level: "county",
                uri: element['state']['value']
              });
            })
            resolve(states);
          }
        });
      }
      else if (node['data']['level'] == 'county') {
        this.queryService.getCountyAdministrativeRegions(node['data']['uri']).subscribe({
          next: response => {
            let states: any = new Array();
            let parsedResponse = this.queryService.getResults(response);
            parsedResponse.forEach(element => {
              states.push({
                name: element['county_label']['value'],
                hasChildren: false,
              });
            })
            resolve(states);
          }
        });
      }
    })
  }

  /**
    * Returns the children of a particular hazard.
    *
    * @param node The node that the user selected
  */
  getHazardChildren(node: TreeNode) {
    return new Promise((resolve, reject) => {
      this.queryService.getHazardChildren(node['data']['uri']).subscribe({
        next: response => {
          let states: any = new Array();
          let parsedResponse = this.queryService.getResults(response);
          parsedResponse.forEach(element => {
            states.push({
              name: element['hazard_label']['value'],
              hasChildren: element['count']['value'] > 0,
              uri: element['hazard']['value']
            });
          })
          resolve(states);
        }
      });
    })
  }

  /**
   * Retrieves all of the child nodes for a particular GNIS node
   *
   * @param node The nod that the user selcted
   */
  getGNISChildren(node: TreeNode) {
    return new Promise((resolve, reject) => {
      this.queryService.getGNISChildren(node['data']['uri']).subscribe({
        next: response => {
          let states: any = new Array();
          let parsedResponse = this.queryService.getResults(response);
          parsedResponse.forEach(element => {
            let hasChildren = Boolean(element['count']['value'] > 0)
            states.push({
              name: element['gnis_label']['value'],
              hasChildren: hasChildren,
              uri: element['place']['value']
            });
            this.gnisRecords.set(element['gnis_label']['value'], element['place']['value'])
          })
          resolve(states);
        }
      });
    });
  }

  /**
   * Retrieves the children for a particular expert node
   *
   * @param parent The tree node whose children are being retrieved
   */
  getExpertChildren(node: TreeNode) {
    return new Promise((resolve, reject) => {
      this.queryService.getExpertChildren(node['data']['uri']).subscribe({
        next: response => {
          let children: any = new Array();
          let parsedResponse = this.queryService.getResults(response);
          parsedResponse.forEach(element => {
            children.push({
              name: element['name']['value'],
              hasChildren: element['count']['value'] > 0,
              uri: element['sub_topic']['value']
            });
          })
          resolve(children);
        }
      });
    });
  }
}

/**
 * Prototype for clicking events. It has the name of the event, the node,
 * and the tree model for all of the nodes.
*/
export interface ClickEvent {
  eventName: string;
  node: TreeNode,
  treeModel: TreeModel,
}

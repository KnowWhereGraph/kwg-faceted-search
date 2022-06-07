import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QueryService } from '../services/query.service'
import { ITreeOptions, TreeNode } from '@circlon/angular-tree-component'

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.scss']
})
export class FacetsComponent implements OnInit {
  floatLabelControl = new FormControl('auto');
  // The current tab that the user selected. This is used to decide which facets to show
  @Input() selectedTabIndex = 0;
  // This Administrative Region that the user specified
  adminRegion: string = '';
  // The Zip Code that the user has selected
  zipCode: string = '';
  // The Climate Division that the user has selected
  climateDivision: string = '';
  // The national Weather Zone that the user has selected
  nationalWeatherZone: string = '';
  // The FIPS code that the user has entered
  fipsCode: string = '';
  // Container that holds all of the admin regions that are shown on the UI
  administrativeRegionsDisplay: Array<any> = [];
  // Container for all of the hazard classes that are shown in the dropdown selection
  hazardClassesDisplay: Array<any> = [];
  // Container for all the GNIS classes in the dropdown menu
  gnisClassesDisplay: Array<{ name: string, hasChildren: boolean }> = [];
  // Container for all of the experts in the dropdown facet
  expertClassesDisplay: Array<{ name: string, hasChildren: boolean }> = [];
  // The start date of the search
  startDate: string = "";
  // The end date of the search
  endDate: string = "";

  adminRegionOptions: ITreeOptions = {
    getChildren: this.getRegionChildren.bind(this),
    useCheckbox: true
  }

  hazardOptions: ITreeOptions = {
    getChildren: this.getHazardChildren.bind(this),
    useCheckbox: true
  }

  gnisOptions: ITreeOptions = {
    getChildren: this.getGNISChildren.bind(this),
    useCheckbox: true
  }

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
  }

  /**
   * When facet values are changed and the user clicks 'Enter' or 'Search', this method
   * is called. It's responsible for updating the URL query parameters and for letting
   * the sibling components to update the data table.
   */
  facetChanged() {
    this.updateUrlParams();
  }

  generateArray(obj) {
    return Object.keys(obj).map((key) => { return { key: key, value: obj[key] } });
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
          })
        });
        this.gnisClassesDisplay = formatted;
      }
    });
    // Load the climate divisions for autocompletion
    this.queryService.getClimateDivisions().subscribe({
      next: response => {
        let results = this.queryService.getResults(response);
        let formattedResults: any = [];
        results.forEach((element) => {
          let division = element.division.value;
          let division_label = element.division_label.value;
          formattedResults[division_label] = division;
        });
      }
    });

    // Load the top level administrative regions (country)
    this.queryService.getTopLevelExperts().subscribe({
      next: response => {
        let results = this.queryService.getResults(response);
        this.expertClassesDisplay = [];
        results.forEach(element => {
          this.expertClassesDisplay.push({
            name: element['name']['value'],
            hasChildren: true,
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
            hasChildren: true,
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
            let hasChildren = Boolean(element['count']['value'] > 0)
            states.push({
              name: element['hazard_label']['value'],
              hasChildren: hasChildren,
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
          })
          resolve(states);
        }
      });
    })
  }
}

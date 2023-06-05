import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SubscriptionLoggable } from 'rxjs/internal/testing/SubscriptionLoggable';
import { QueryService } from '../services/query.service'


/**
 * A component that represents the main search page. It controls the logic for handling tab switching (ie clicking 'People', 'Places' or 'Hazards).
 * Based on the tab clicked, it renders the appropriate table component.
 */
@Component({
  selector: 'browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  // The identifier of the node being presented
  node_name: string = '';
  // The full path to the node (eg stko-kwg.ucsb.edu/lod/resource/1234)
  full_node_id: string = '';
  large: boolean = true;
  // The fully qualified URI of predicates that should appear at the top of the page
  preferred_order: Array <string> = [
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "http://www.w3.org/2000/01/rdf-schema#label",
    "http://www.opengis.net/ont/geosparql#hasDefaultGeometry"
  ];
  // Any predicates to hide
  hide_list = [
    "http://www.w3.org/2002/07/owl#sameAs"
  ]
  public outbound_relations: Array<{
    predicate_name: string,
    predicate_label: string | undefined,
    predicate_link: string,
    predicate_kwg_link: string,
    objects: Array<{name: string, link: string, isPredicate: boolean, localURI: string, dataType: string}
    >}> = []
  public rows: Array<{predicate: string, object: string}> = [];


    /**
   * 
   * @param name1 The first name being compared
   * @param name2 The second name being compared
   * @returns Whether the 
   */
    private sortRelations(name1: string, name2: string) {
      console.log("sortRelations: ", name1, name2)
      name1 = name1.toUpperCase();
      name2 = name2.toUpperCase();
      return (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
    }


  constructor(private route: ActivatedRoute, private queryService: QueryService) {
    this.route.queryParams.subscribe(params => {
        this.node_name = params['id'];
        this.full_node_id = this.getFullNodePath(this.node_name);
    });

    this.queryService.getOutboundPredicates(this.full_node_id).subscribe({
      next: response => {
        let parsedResponse = this.queryService.getResults(response);
        parsedResponse.forEach(predicate => {
          if (this.hide_list.includes(predicate.predicate.value)) {
            return
          }
          // Loop over each predicate and get the first 100 relations
          let outbounds: Array<{name: string, link: string, isPredicate: boolean, localURI: string, dataType: string}> = []
          this.queryService.getOutboundObjects(this.full_node_id, predicate.predicate.value).subscribe({
            next: response => {
              let parsedObjects = this.queryService.getResults(response);
              parsedObjects.forEach(obj => {
                // The shortened path of http://localhost:4200/browse?id=<object here>
                let localURI = ''
                // If the response doesn't have a label-but is a literal, use the literal as the label
                if (obj.label == undefined) {
                  if (obj.object.type == 'literal') {
                    outbounds.push(
                      {
                        'name': obj.object.value, 
                        'link': '', 
                        'isPredicate': true, 
                        'localURI': localURI, 
                        'dataType': obj.data_type.value
                      }
                      )
                  } else {
                    // Otherwise use the shortened URI
                    outbounds.push(
                      {
                        'name': this.getExternalPrefix(obj.object.value),
                        'link': obj.object.value, 'isPredicate': false,
                        'localURI': this.getExternalKWGPath(obj.object.value),
                        'dataType': ''
                      }
                      )
                  }
                  console.warn("No label for ", obj)
                } else {
                // Otherwise use the given 'label' predicate
                let found = outbounds.findIndex((outbound_record) => { return outbound_record.link == obj.object.value });
                if(found < 0) {
                  localURI = this.getExternalKWGPath(obj.object.value)
                  outbounds.push(
                    {
                      'name': obj.label.value, 
                      'link': obj.object.value, 
                      'isPredicate': false, 
                      'localURI': localURI,
                      'dataType': ''
                    }

                      )
                }
                }
                this.rows.push({'predicate': predicate.predicate.value, 'object': obj})
              });
            }
          });
          let name = this.getPredicateName(predicate.predicate)
          let label = undefined;
          if (predicate.label) {
            label = predicate.label.value;
          }
          // Check that this URI doesn't already exist
          let found = this.outbound_relations.findIndex((outbound_record) => { return outbound_record.predicate_link == predicate.predicate.value });
          if (found < 0) {
            this.outbound_relations.push(
              {
                'predicate_name': name,
                'predicate_label': label,
                'predicate_link': predicate.predicate.value,
                'predicate_kwg_link': this.getExternalKWGPath(predicate.predicate.value),
                'objects': outbounds
              }
            )
          }
        });
            //this.outbound_relations.sort((a,b) => this.sortRelations(a.predicate_name,b.predicate_name));
      }
    });
  };

  /**
   * ...
   * 
   * @param predicate 
   * @returns 
   */
  private getPredicateName(predicate) {
    if ('label' in predicate) {
      return predicate.label.value;
    } else {
      return this.getExternalPrefix(predicate.value)
    }
  }

  /**
   * Gets the full path of a prefixed URI
   * 
   * @param uri 
   * @returns 
   */
  private getFullNodePath(uri: string) {
    let prefix = uri.split(":")[0];
    let val = this.queryService.prefixes[prefix];
    return uri.replace(prefix.concat(":"), val);
  }

  getExternalKWGPath(uri: string) {

    return "https://stko-kwg.geog.ucsb.edu/browse?id=".concat(this.getExternalPrefix(uri))
  }

  /**
   * Given a uri of an externally defined word, attempt to add a prefix to it.
   * @param uri The URI of the word
   * @returns 
   */
  private getExternalPrefix(uri: string) {
    let prefixes = this.queryService.prefixes
    for (const key of Object.keys(this.queryService.prefixes)) {
      if (uri.includes(prefixes[key])) {
        return uri.replace(prefixes[key], key.concat(":"));
      }
    }
    return uri;
  }

  ngOnInit(): void {}

}

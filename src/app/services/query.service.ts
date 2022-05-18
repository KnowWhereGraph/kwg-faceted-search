import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QueryService {
  // SPARQL Endpoint
  private endpoint="https://stko-kwg.geog.ucsb.edu/sparql";
  // The SPARQL query prefixes
  private prefixes = {
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
    'xsd': 'http://www.w3.org/2001/XMLSchema#',
    'owl': 'http://www.w3.org/2002/07/owl#',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'dcterms': 'http://purl.org/dc/terms/',
    'foaf': 'http://xmlns.com/foaf/0.1/',
    'kwgr': 'http://stko-kwg.geog.ucsb.edu/lod/resource/',
    'kwg-ont': 'http://stko-kwg.geog.ucsb.edu/lod/ontology/',
    'geo': 'http://www.opengis.net/ont/geosparql#',
    'time': 'http://www.w3.org/2006/time#',
    'ago': 'http://awesemantic-geo.link/ontology/',
    'sosa': 'http://www.w3.org/ns/sosa/',
    'elastic': 'http://www.ontotext.com/connectors/elasticsearch#',
    'elastic-index': 'http://www.ontotext.com/connectors/elasticsearch/instance#',
    'iospress': 'http://ld.iospress.nl/rdf/ontology/',
  };
  // A string representation of the prefixes
  prefixesCombined: string = '';

  // Service constructor. It's responsible for creating a string representation of the
  // prefixes and creating the HttpClient object used to send queries
  constructor(private http: HttpClient) {
    for (let [si_prefix, p_prefix_iri] of Object.entries(this.prefixes)) {
      this.prefixesCombined += `PREFIX ${si_prefix}: <${p_prefix_iri}>\n`;
    }
  }

  // Takes a query string without the prefixes and returns the fully crafted query
  getRequestBody(query: string, reason: boolean=true) {
    let fullQuery = this.prefixesCombined+query;
    let httpParams = new URLSearchParams();
    httpParams.set('query', fullQuery);
    httpParams.set('infer', String(reason));
    return httpParams;
  }

  // Returns the request headers for each sparql query
  getRequestHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", 'application/x-www-form-urlencoded')
    headers = headers.set('Accept', 'application/sparql-results+json')
    return {
      headers: headers
    };
  }

  // Returns the body of the query meant to get all of the relevant (to the facets) hazards.
  // This is used to populate the data table and to count the number of results.
  getHazardsQueryBody() {
    let query = `?entity rdf:type ?type;
    rdfs:label ?label;
    kwg-ont:hasImpact|sosa:isFeatureOfInterestOf ?observationCollection.
    ?type rdfs:subClassOf ?superClass;
      rdfs:label ?typeLabel.
    values ?superClass {kwg-ont:Hazard kwg-ont:Fire}
  `
    return query;
  }

  /**
   * Gets all of the hazards in the database.
   * @param limit The maximum number of results to retrieve
   * @param offset The number of results to skip
   * @returns An observable that the caller can watch
   */
  getAllHazards(limit: number=20, offset=0) {
    let query = `
    SELECT * WHERE {`+this.getHazardsQueryBody()+`} LIMIT `+limit.toString()+`OFFSET`+offset.toString();
    let headers = this.getRequestHeaders();
    let body = this.getRequestBody(query);
    return this.http.post(this.endpoint, body, headers);
  }

  // Gets the total number of hazards, relevant to the selected facets
  getHazardCount() {
    let query=`SELECT (COUNT(*) as ?COUNT) { ` + this.getHazardsQueryBody() + `}`;
    let headers = this.getRequestHeaders();
    let body = this.getRequestBody(query);
    return this.http.post(this.endpoint, body, headers);
  }

  /**
   * Given a list of properties about a hazard, query the database for information about
   *
   * @param entities: An array of entity URI's
   **/
  getHazardProperties(entities: Array<string>) {
    let query = `SELECT ?entity ?place ?placeLabel ?time ?startTimeLabel ?endTimeLabel ?wkt where {
      values ?entity {${entities.join(' ')}}
      optional
      {
          ?entity kwg-ont:locatedIn ?place.
          ?place rdfs:label ?placeLabel;
                 geo:hasGeometry/geo:asWKT ?placeWkt.
      }
      optional
      {
          ?entity kwg-ont:hasImpact|sosa:isFeatureOfInterestOf ?observationCollection.
          ?observationCollection sosa:phenomenonTime ?time.
          ?time time:hasBeginning/time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                time:hasEnd/time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
      }
      optional
      {
          ?entity geo:hasGeometry/geo:asWKT ?wkt.
      }
    }`
  let headers = this.getRequestHeaders();
  let body = this.getRequestBody(query);
  return this.http.post(this.endpoint, body, headers);
  }


  /**
   * Gets the minimum amount of query for finding places.
   *
   * @returns A string of SPARQL without the SELECT predicate
   */
  getPlacesQueryBody() {
    let query = `?entity a ?type; rdfs:label|kwg-ont:hasZipCode ?label; geo:hasGeometry ?geo.
      values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3 kwg-ont:ZipCodeArea kwg-ont:USClimateDivision kwg-ont:NWZone}
      ?type rdfs:label ?typeLabel`
    return query;
  }

  /**
   * Gets all of the places in the database.
   *
   * @param limit The maximum number of results to retrieve
   * @param offset The number of results to skip
   * @returns An observable that the caller can watch
   */
     getAllPlaces(limit: number=20, offset=0) {
      let query = `
      SELECT * WHERE {`+this.getPlacesQueryBody()+`} LIMIT `+limit.toString()+`OFFSET`+offset.toString();
      let headers = this.getRequestHeaders();
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Gets the total number of places matching a facet selection
     */
    getPlacesCount() {
      let query=`SELECT (COUNT(*) as ?COUNT) { ` + this.getPlacesQueryBody() + `}`;
      let headers = this.getRequestHeaders();
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

  /**
   * Gets the minimum amount of query for finding people.
   *
   * @returns A string of SPARQL without the SELECT predicate
   */
   getPeopleQueryBody() {
    let query = `select distinct ?label ?entity ?affiliation ?affiliationLabel ?wkt
    (group_concat(distinct ?expert; separator = ", ") as ?expertise)
    (group_concat(distinct ?expertLabel; separator = ", ") as ?expertiseLabel)
    where {
        ?entity rdf:type iospress:Contributor.
        ?entity rdfs:label ?label.
        ?entity kwg-ont:hasExpertise ?expert.

        ?expert rdfs:label ?expertLabel.
        optional
        {
            ?entity iospress:contributorAffiliation ?affiliation.
            ?affiliation rdfs:label ?affiliationLabel.
            ?affiliation geo:hasGeometry/geo:asWKT ?wkt.
        }

    } GROUP BY ?label ?entity ?affiliation ?affiliationLabel ?wkt`
    return query;
  }

  /**
   * Gets all of the people in the database.
   *
   * @param limit The maximum number of results to retrieve
   * @param offset The number of results to skip
   * @returns An observable that the caller can watch
   */
       getAllPeople(limit: number=20, offset=0) {
        let query = `SELECT * WHERE {`+this.getPeopleQueryBody()+`} LIMIT `+limit.toString()+`OFFSET`+offset.toString();
        let headers = this.getRequestHeaders();
        let body = this.getRequestBody(query);
        return this.http.post(this.endpoint, body, headers);
      }

    /**
     * Gets the total number of people matching a facet selection
     */
     getPeopleCount() {
      let query=`SELECT (COUNT(*) as ?COUNT) { ` + this.getPeopleQueryBody() + `}`;
      let headers = this.getRequestHeaders();
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    // Given a sparql query response, return an array of values
    getResults(response: any) {
      return response['results']['bindings'];
    }

    /**
     * Returns all of the administrative regions in the United States
     */
     getAdministrativeRegions() {
      return this.http.get('../assets/data/us_admin_regions.json');
    }

    /**
     * Gets the highest level administrative region, the United States
     */
    getTopLevelAdministrativeRegions() {
      let query = `select ?country ?country_label where {
        values ?country {kwgr:Earth.North_America.United_States.USA}
        ?country rdfs:label ?country_label .
      }`
      let headers = this.getRequestHeaders();
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Gets the highest level administrative region,
     */
     getStateAdministrativeRegions() {
      let query = `SELECT DISTINCT ?state ?state_label where {
        ?state kwg-ont:sfWithin kwgr:Earth.North_America.United_States.USA .
    	?state a kwg-ont:AdministrativeRegion_2 .
        ?state rdfs:label ?state_label .
    } ORDER BY ?state_label`
      let headers = this.getRequestHeaders();
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Gets the counties in an administrative region
     * @param {String} stateURI The URI of the state whose counties are being queried
     */
     getCountyAdministrativeRegions(stateURI) {
      let query = `SELECT DISTINCT ?county_label where {
        ?county kwg-ont:sfWithin <`+stateURI+`> .
    	  ?county a kwg-ont:AdministrativeRegion_3 .
        ?county rdfs:label ?county_label .
        } ORDER BY ?state_label`
      let headers = this.getRequestHeaders();
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Returns all of the climate divisions in the United States
     */
    getClimateDivisions() {
      return this.http.get('../assets/data/us_climate_divisions.json');
    }

    /**
     * Gets the top level hazard classes.
     */
    getTopLevelHazards() {
      let query = `SELECT DISTINCT ?hazard ?hazard_label where {
        ?hazard rdfs:subClassOf kwg-ont:Hazard .
        ?hazard rdfs:label ?hazard_label .
        } ORDER BY ?hazard_label`
      let headers = this.getRequestHeaders();
      // Disable reasoning so that we only get the top level hazards
      let body = this.getRequestBody(query, false);
      return this.http.post(this.endpoint, body, headers);
    }

    getHazardChildren(hazardURI) {
      let query = `SELECT DISTINCT ?hazard ?hazard_label (count(distinct ?hazard) as ?count) where {
        ?hazard rdfs:subClassOf <`+hazardURI+`> .
        ?hazard rdfs:label ?hazard_label .
        } GROUP BY ?hazard ?hazard_label ORDER BY ?hazard_label`
      let headers = this.getRequestHeaders();
      // Disable reasoning so that we only get the top level hazards
      let body = this.getRequestBody(query, false);
      return this.http.post(this.endpoint, body, headers);
    }
}

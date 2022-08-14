import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  // SPARQL Endpoint
  private endpoint=environment['graphEndpoint'];
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
    'usgs': 'http://gnis-ld.org/lod/usgs/ontology/'
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

  /**
   *
   * @param id The query identifier
   * @returns A set of headers that are used in a SPARQL query
   */
  getRequestHeaders(id: string) {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", 'application/x-www-form-urlencoded');
    headers = headers.set('Accept', 'application/sparql-results+json');
    headers = headers.set('X-Request-Id', id);
    return { headers: headers };
  }

  // Returns the body of the query meant to get all of the relevant (to the facets) hazards.
  // This is used to populate the data table
  getHazardsQueryBody() {
    console.log(environment)
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
   *
   * @param limit The maximum number of results to retrieve
   * @param offset The number of results to skip
   * @returns An observable that the caller can watch
   */
  getAllHazards(limit: number=20, offset=0) {
    let query = `
    SELECT DISTINCT * WHERE {`+this.getHazardsQueryBody()+`} LIMIT `+limit.toString()+` OFFSET `+offset.toString();
    let headers = this.getRequestHeaders('KE_01');
    let body = this.getRequestBody(query);
    return this.http.post(this.endpoint, body, headers);
  }

  /**
   * Counts the number of results for a hazard query
   *
   * @param limit The highest number to count to
   * @param offset The offset to start counting from
   * @returns
   */
  getHazardCount(limit: number=20, offset=0) {
    let query=`SELECT (COUNT(*) as ?COUNT) { SELECT DISTINCT ?entity {` + this.getHazardsQueryBody()+`} LIMIT `+limit.toString()+` OFFSET `+offset.toString()+'}';
    let headers = this.getRequestHeaders('KE_02');
    let body = this.getRequestBody(query);
    return this.http.post(this.endpoint, body, headers);
  }

  /**
   * Given a list of properties about a hazard, query the database for information about
   *
   * @param entities: An array of entity URI's
   **/
  getHazardProperties(entities: Array<string>) {
    let query = `SELECT DISTINCT ?entity ?place ?placeLabel ?placeQuantName ?time ?startTimeLabel ?endTimeLabel ?wkt (group_concat(distinct ?type; separator = ",") as ?type) (group_concat(distinct ?typeLabel; separator = ",") as ?typeLabel) {
      values ?entity {${entities.join(' ')}}
      ?entity a ?type .
      ?type rdfs:label ?typeLabel .
      OPTIONAL
      {
          ?entity kwg-ont:sfWithin ?place.
          ?place rdf:type kwg-ont:AdministrativeRegion .
          ?place rdfs:label ?placeLabel;
                 geo:hasGeometry/geo:asWKT ?placeWkt.
                 OPTIONAL { ?place kwg-ont:quantifiedName ?placeQuantName .}
      }
      OPTIONAL
      {
          ?entity kwg-ont:hasImpact|sosa:isFeatureOfInterestOf ?observationCollection.
          ?observationCollection sosa:phenomenonTime ?time.
          ?time time:hasBeginning/time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                time:hasEnd/time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
      }
      OPTIONAL
      {
          ?entity geo:hasGeometry/geo:asWKT ?wkt.
      }
    } GROUP BY ?entity ?place ?placeLabel ?placeQuantName ?time ?startTimeLabel ?endTimeLabel ?wkt`
  let headers = this.getRequestHeaders('KE_03');
  let body = this.getRequestBody(query);
  return this.http.post(this.endpoint, body, headers);
  }

  /**
   * Retrieves all of the zip codes that are in the graph.
   */
  getZipCodes() {
    return this.http.get('../assets/data/zipcode_cache.csv', {responseType: 'text'});
  }

  /**
   * Retrieves all of the zip codes that are in the graph.
   */
   getFIPSCodes() {
    return this.http.get('../assets/data/fips_cache.csv', {responseType: 'text'});
  }

  /**
   * Retrieves all of the National Weather Zones that are in the graph.
   */
    getNWZones() {
      return this.http.get('../assets/data/nwz_cache.csv', {responseType: 'text'});
    }

   /**
     * Returns all of the administrative regions in the United States
     */
    getAdministrativeRegions() {
      return this.http.get('../assets/data/admin_region_cache.csv', {responseType: 'text'});
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
      let headers = this.getRequestHeaders('KE_04');
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Gets the total number of places matching a facet selection
     *
     * @param limit The maximum number of results to retrieve
     * @param offset The number of results to skip
    */
    getPlacesCount(limit: number=20, offset=0) {
      let query=`SELECT (COUNT(*) as ?COUNT) { SELECT DISTINCT ?entity {` + this.getPlacesQueryBody()+`} LIMIT `+limit.toString()+` OFFSET `+offset.toString()+'}';
      let headers = this.getRequestHeaders('KE_05');
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

  /**
   * Gets the minimum amount of query for finding people.
   *
   * @returns A string of SPARQL without the SELECT predicate
   */
   getPeopleQueryBody() {
    let query = `SELECT distinct ?label ?entity ?affiliation ?affiliationLabel ?wkt ?affiliationLoc ?affiliationQuantName
    (group_concat(distinct ?expert; separator = ", ") as ?expertise)
    (group_concat(distinct ?expertLabel; separator = ", ") as ?expertiseLabel)
    WHERE {
        ?entity rdf:type iospress:Contributor.
        ?entity rdfs:label ?label.
        ?entity kwg-ont:hasExpertise ?expert.
        ?expert rdfs:label ?expertLabel.
        OPTIONAL
        {
            ?entity iospress:contributorAffiliation ?affiliation.
            ?affiliation rdfs:label ?affiliationLabel.
            OPTIONAL {
              ?affiliation geo:hasGeometry/geo:asWKT ?wkt.
            }
            OPTIONAL {
              ?affiliation kwg-ont:sfWithin ?affiliationLoc .
              ?affiliationLoc rdf:type kwg-ont:AdministrativeRegion_3 .
              ?affiliationLoc rdfs:label ?affiliationLoc_label.
              ?affiliationLoc kwg-ont:quantifiedName ?affiliationQuantName
            }
        }

    } GROUP BY ?label ?entity ?affiliation ?affiliationLabel ?wkt ?affiliationLoc ?affiliationQuantName`
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
      let headers = this.getRequestHeaders('KE_06');
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Gets the total number of people matching a facet selection
     *
     * @param limit The maximum number of results to retrieve
     * @param offset The number of results to skip
     */
     getPeopleCount(limit: number=20, offset=0) {
      let query=`SELECT (COUNT(*) as ?COUNT)  { SELECT DISTINCT ?entity {` + this.getPeopleQueryBody() + `} LIMIT `+limit.toString()+` OFFSET `+offset.toString()+'}';
      let headers = this.getRequestHeaders('KE_07');
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    // Given a sparql query response, return an array of values
    getResults(response: any) {
      return response['results']['bindings'];
    }

    /**
     * Gets the highest level administrative region, the United States
     */
    getTopLevelAdministrativeRegions() {
      let query = `select ?country ?country_label where {
        values ?country {kwgr:Earth.North_America.United_States.USA}
        ?country rdfs:label ?country_label .
      }`
      let headers = this.getRequestHeaders('KE_08');
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
      let headers = this.getRequestHeaders('KE_09');
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Gets the counties in an administrative region
     *
     * @param {String} stateURI The URI of the state whose counties are being queried
     */
     getCountyAdministrativeRegions(stateURI: string) {
      let query = `SELECT DISTINCT ?county_label where {
        ?county kwg-ont:sfWithin <`+stateURI+`> .
    	  ?county a kwg-ont:AdministrativeRegion_3 .
        ?county rdfs:label ?county_label .
        } ORDER BY ?state_label`
      let headers = this.getRequestHeaders('KE_10');
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Returns all of the climate divisions in the United States
     */
    getClimateDivisions() {
      return this.http.get('../assets/data/climate_division_cache.csv', {responseType: 'text'});
    }

    /**
     * Gets the top level hazard classes.
     */
    getTopLevelHazards() {
      let query = `SELECT DISTINCT ?hazard ?hazard_label (COUNT(DISTINCT ?child) as ?count) where {
        ?hazard rdfs:subClassOf kwg-ont:Hazard .
        ?hazard rdfs:label ?hazard_label .
        OPTIONAL {
          ?child rdfs:subClassOf ?hazard .
          FILTER (!isBlank(?child))
        }
        } GROUP BY ?hazard ?hazard_label ORDER BY ?hazard_label`
      let headers = this.getRequestHeaders('KE_11');
      // Disable reasoning so that we only get the top level hazards
      let body = this.getRequestBody(query, false);
      return this.http.post(this.endpoint, body, headers);
    }

    getHazardChildren(hazardURI: string) {
      let query = `SELECT DISTINCT ?hazard ?hazard_label (count(distinct ?child) as ?count) where {
        ?hazard rdfs:subClassOf <`+hazardURI+`> .
        ?hazard rdfs:label ?hazard_label .
        OPTIONAL {
          ?child rdfs:subClassOf ?hazard .
        }
      } GROUP BY ?hazard ?hazard_label ORDER BY ?hazard_label`
      let headers = this.getRequestHeaders('KE_12');
      // Disable reasoning so that we only get the top level hazards
      let body = this.getRequestBody(query, false);
      return this.http.post(this.endpoint, body, headers);
    }

    getGNISClasses() {
      let query = `SELECT DISTINCT ?place ?place_label {
        ?place rdfs:label ?place_label .
        values ?place {usgs:BuiltUpArea usgs:SurfaceWater usgs:Terrain}
      } ORDER BY ASC(?place_label)`
      let headers = this.getRequestHeaders('KE_13');
      // Disable reasoning so that we only get the top level hazards
      let body = this.getRequestBody(query, false);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Gets all of the subclasses of a GNIS type
     *
     * @param gnisURI The URI of the subject whose children are in question
     */
    getGNISChildren(gnisURI: string) {
      let query = `SELECT DISTINCT ?place ?gnis_label (count(distinct ?gnis) as ?count) where {
        ?place rdfs:subClassOf <`+gnisURI+`> .
        ?place rdfs:label ?gnis_label .
        } GROUP BY ?place ?gnis_label ORDER BY ?gnis_label`
      let headers = this.getRequestHeaders('KE_14');
      // Disable reasoning so that we only get the top level hazards
      let body = this.getRequestBody(query, false);
      return this.http.post(this.endpoint, body, headers);
    }

  /**
   * Gets all of the expert topics that aren't the child of any other (top level)
   *
   * @returns The SPARQL ResultsSet from the endpoint
   */
  getTopLevelExperts() {
    let query = `SELECT DISTINCT ?topic ?name (COUNT(DISTINCT ?child) as ?count) where {
      ?topic a kwg-ont:ExpertiseTopic .
        ?topic rdfs:label ?name .
        FILTER NOT EXISTS {?supertopic kwg-ont:hasSubTopic ?topic}
      OPTIONAL {
          ?topic kwg-ont:hasSubTopic ?child .
      }
    } GROUP BY ?topic ?name ORDER BY ASC(?name)`
    let headers = this.getRequestHeaders('KE_15');
    // Disable reasoning so that we only get the top level hazards
    let body = this.getRequestBody(query, false);
    return this.http.post(this.endpoint, body, headers);
  }

  /**
   * Retrieves the sub-topics for a particular node
   *
   * @param parent The URI of the parent whose children are being obtained
   * @returns The SPARQL ResultsSet from the endpoint
   */
  getExpertChildren(parent: string) {
    let query = `SELECT DISTINCT ?name ?sub_topic (COUNT(DISTINCT ?child) as ?count) where {
      <`+parent+`> kwg-ont:hasSubTopic ?sub_topic .
      ?sub_topic rdfs:label ?name .
      OPTIONAL {
        ?sub_topic kwg-ont:hasSubTopic ?child .
      }
  } GROUP BY ?name ?sub_topic ORDER BY ASC(?name)`
    let headers = this.getRequestHeaders('KE_16');
    // Disable reasoning so that we only get the top level hazards
    let body = this.getRequestBody(query, false);
    return this.http.post(this.endpoint, body, headers);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

/**
 * Service for making SPARQL queries. This class contains helpers for sending requests to
 * GraphDB and processing the results.
 */
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

  /**
   * Service constructor. It's responsible for creating a string representation of the
   * prefixes and creating the HttpClient object used to send queries
   * @param http The HTTP client to perform requests
   */
  constructor(private http: HttpClient) {
    for (let [si_prefix, p_prefix_iri] of Object.entries(this.prefixes)) {
      this.prefixesCombined += `PREFIX ${si_prefix}: <${p_prefix_iri}>\n`;
    }
  }

/**
 * Performs a SPARQL query
 *
 * @param {string} query The query that is being performed
 * @returns
 */
 async query(query) {
  let d_form = new FormData();
  d_form.append('query', this.prefixes + query);
  let d_res:any = await fetch(this.endpoint, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/sparql-results+json',
        },
        body: this.getRequestBody(query),
    }).catch((error) => {
      console.error("There was an error while running a query: ", error);
    });
  return await d_res.json();
}

  /**
   * Takes a query string without the prefixes and returns the fully crafted query
   * @param query The SPARQL query being prepared
   * @param reason Flag whether reasoning is enabled
   * @returns The request body for a valid SPARQL query against GraphDB
   */
  getRequestBody(query: string, reason: boolean=true) {
    let fullQuery = this.prefixesCombined+query;
    let httpParams = new URLSearchParams();
    httpParams.set('query', fullQuery);
    httpParams.set('infer', String(reason));
    return httpParams;
  }

  /**
   * Creates the headers for a SPARQL query
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

  /**
   * Returns the body of the query meant to get all of the relevant (to the facets) hazards.
   * This is used to populate the data table
   *
   * @returns A portion of a SPARQL query
   */
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
   * @returns The number of hazards found
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
   * @return The properties of a hazard
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
   * @return An array of zip codes
   */
  getZipCodes() {
    return this.http.get('../assets/data/zipcode_cache.csv', {responseType: 'text'});
  }

  /**
   * Retrieves all of the FIPS codes that are in the graph.
   * @return An array of FIPS codes
   */
   getFIPSCodes() {
    return this.http.get('../assets/data/fips_cache.csv', {responseType: 'text'});
  }

  /**
   * Retrieves all of the National Weather Zones that are in the graph.
   *
   * @return An array of national weather zones
   */
    getNWZones() {
      return this.http.get('../assets/data/nwz_cache.csv', {responseType: 'text'});
    }

   /**
     * Returns all of the administrative regions in the United States
     *
     * @return An array of administrative regions
     */
    getAdministrativeRegions() {
      return this.http.get('../assets/data/admin_region_cache.csv', {responseType: 'text'});
    }

  /**
   * Gets the minimum amount of query for finding places.
   *
   * @param placesFacets The facets selected
   * @param limit The maximum number of results to fetch
   * @param offset The results offset
   * @returns A string of SPARQL without the SELECT predicate
   */
  async getPlaces(placesFacets, limit, offset) {
    let formattedResults: Array<any> = [];
    let placeQuery = `SELECT DISTINCT ?entity ?label ?quantifiedName ?type ?typeLabel where {`;

    if (placesFacets["keyword"] && placesFacets["keyword"] != "") {
      placeQuery += `
      ?search a elastic-index:kwg_fs_index;
      elastic:query "${placesFacets["keyword"]}";
      elastic:entities ?entity.
      ?entity elastic:score ?score.
      `;
    }

    let enteredAdminRegion: boolean = placesFacets["adminRegion"] && placesFacets["adminRegion"] != '';
    let enteredFips: boolean = placesFacets["fipsCode"] && placesFacets["fipsCode"] != '';
    let enteredZip: boolean = placesFacets["zipCode"] && placesFacets["zipCode"] != '';
    let enteredCD: boolean = placesFacets["climateDivision"] && placesFacets["climateDivision"] != '';
    let enteredNationalWeatherZone: boolean = placesFacets["nationalWeatherZone"] && placesFacets["nationalWeatherZone"] != '';
    let enteredGNIS: boolean = placesFacets['gnisType'] && placesFacets['gnisType'].length;
    if (enteredGNIS) {
      // Add brackets around each URI for the query
      let queryURIS = placesFacets['gnisType'].map((uri) => `<${uri}>`).join(" ");
      placeQuery += `
        ?entity a ?type; rdfs:label ?label.
        ?type rdfs:label ?typeLabel.
        values ?type { ${queryURIS} }
        `;
      if (enteredAdminRegion || enteredCD || enteredNationalWeatherZone || enteredZip || enteredFips) {
        placeQuery += `
          ?entity kwg-ont:sfWithin ?s2cell.
          ?s2cell rdf:type kwg-ont:KWGCellLevel13;
            kwg-ont:spatialRelation ?placesConnectedToS2.
          ?placesConnectedToS2 kwg-ont:sfWithin ?superPlacesConnectedToS2.
          `;
        let placesConnectedToS2: Array<string> = [];
        if (enteredAdminRegion) {
          placesConnectedToS2.push(`<${placesFacets['adminRegion']}>`);
        }
        if (enteredZip) {
          placesConnectedToS2.push(`<${placesFacets['zipCode']}>`);
        }
        if (enteredFips) {
          placesConnectedToS2.push(`<${placesFacets['fipsCode']}>`);
        }
        if (enteredCD) {
          placesConnectedToS2.push(`<${placesFacets['climateDivision']}>`);
        }
        if (enteredNationalWeatherZone) {
          placesConnectedToS2.push(`<${placesFacets['nationalWeatherZone']}>`);
        }
        placeQuery += `filter (?placesConnectedToS2 in (${placesConnectedToS2.join(', ')}) || ?superPlacesConnectedToS2 in (${placesConnectedToS2.join(', ')}))`;
      }
    }
    else {
      if (enteredAdminRegion || enteredCD || enteredNationalWeatherZone || enteredZip || enteredFips) {
        let typeQueries: Array<string> = [];
        if (enteredAdminRegion) {
          typeQueries.push(`{
            ?entity rdf:type ?type; rdfs:label ?label.
            values ?entity { <` + placesFacets["adminRegion"] + `> }
            ?type rdfs:label ?typeLabel.
            values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3}
          }`);
        }
        if (enteredZip) {
          typeQueries.push(`
          {
            ?entity rdf:type ?type; rdfs:label ?label.
            values ?entity { <` + placesFacets["zipCode"] + `> }
            ?type rdfs:label ?typeLabel.
            values ?type {kwg-ont:ZipCodeArea}
          }`);
        }
        if (enteredFips) {
          typeQueries.push(`
          {
            ?entity rdf:type ?type; kwg-ont:hasFIPS|kwg-ont:climateDivisionFIPS ?label.
            values ?entity { <` + placesFacets["fipsCode"] + `> }
            ?type rdfs:label ?typeLabel.
            values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3 kwg-ont:USClimateDivision}
          }`);
        }
        if (enteredCD) {
          typeQueries.push(`
          {
            ?entity rdf:type ?type; rdfs:label ?label.
            values ?entity { <` + placesFacets["climateDivision"] + `> }
            values ?type {kwg-ont:USClimateDivision}
            ?type rdfs:label ?typeLabel
          }`);
        }
        if (enteredNationalWeatherZone) {
          typeQueries.push(`
          {
            ?entity rdf:type ?type; rdfs:label ?label.
            values ?entity { <` + placesFacets["nationalWeatherZone"] + `> }
            ?type rdfs:label ?typeLabel.
            values ?type {kwg-ont:NWZone}
          }`);
        }
        // Combine the queries with a union
        placeQuery += typeQueries.join(' UNION ');
      }
      else {
        // Otherwise no facets have been changed, so use the default query
        placeQuery += `
        {
          ?entity rdf:type ?type; rdfs:label ?label.
          OPTIONAL
          {
            ?entity kwg-ont:quantifiedName ?quantifiedName.
          }
          values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3 kwg-ont:ZipCodeArea kwg-ont:USClimateDivision kwg-ont:NWZone}
          ?type rdfs:label ?typeLabel
        }`;
      }
    }


    if (typeof placesFacets["spatialSearchWkt"] != 'undefined') {
      placeQuery += `
          ?entity geo:sfWithin '${placesFacets["spatialSearchWkt"]}'^^geo:wktLiteral.
      `;
    }

    // Close the main query
    placeQuery += `}`;

    // If the user included a keyword search, sort them by the most relevant string results from ES
    if (placesFacets["keyword"] && placesFacets["keyword"] != "") {
      placeQuery += ` order by desc(?score)`;
    }

    let queryResults: Response = await this.query(placeQuery + ` LIMIT ` + limit + ` OFFSET ` + offset);
    let entityRawValues: Array<any> = [];

    queryResults['results']['bindings'].forEach(row => {
      entityRawValues.push(row.entity.value);
      formattedResults.push({
        'place': row.entity.value,
        'place_name': (typeof row.quantifiedName === 'undefined') ? row.label.value : row.quantifiedName.value,
        'place_type': row.type.value,
        'place_type_name': row.typeLabel.value,
      })
    });
    if (entityRawValues.length == 0) {
      return { 'count': 0, 'record': {} };
    }

    let wktQuery = await this.query(`select ?entity ?wkt where { ?entity geo:hasGeometry/geo:asWKT ?wkt. values ?entity {<${entityRawValues.join('> <')}>} }`);
    let wktResults = {};
    for (let row of wktQuery['results']['bindings']) {
      wktResults[row.entity.value] = (typeof row.wkt === 'undefined') ? '' : row.wkt.value.replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>', '');
    }

    for (let i = 0; i < formattedResults.length; i++) {
      formattedResults[i]['wkt'] = wktResults[formattedResults[i]['place']];
    }

    let countResults = await this.query(`select (count(*) as ?count) { ` + placeQuery + ` LIMIT ` + limit + `}`);
    return { 'count': countResults.results.bindings[0].count.value, 'records': formattedResults };
  }

  /**
   *
   * @param hazardFacets
   * @param pageNum
   * @param recordNum
   */
  async getHazardSearchResults(hazardFacets, pageNum, recordNum) {
    let formattedResults: any = [];

    let hazardQuery = `select distinct ?entity ?label ?wkt {`;

    //Keyword search
    if (hazardFacets["keyword"] && hazardFacets["keyword"] != "") {
      hazardQuery += `
        ?search a elastic-index:kwg_fs_index;
        elastic:query "${hazardFacets["keyword"]}";
        elastic:entities ?entity.
        ?entity elastic:score ?score.
        `;
    }
    let typeQuery = ``;
    if (hazardFacets["hazardTypes"] && hazardFacets["hazardTypes"].length > 0) {
      // Put brackets around each URI
      let typeURIS = hazardFacets["hazardTypes"].map((uri) => `<${uri}>`).join(" ");
      typeQuery += `filter (?type in (${typeURIS})`;
    }

    //These filters handle search by place type (regions, zipcode, fips, nwz, uscd)
    let placeEntities: Array<string> = new Array();
    if (hazardFacets["adminRegion"] && hazardFacets["adminRegion"].length > 0) {
      placeEntities = hazardFacets["facetRegions"];
    }
    if (hazardFacets['zipCode'] && hazardFacets['zipCode'] != "") {
      placeEntities.push(hazardFacets['zipCode']);
    }
    if (hazardFacets['fipsCode'] && hazardFacets['fipsCode'] != "") {
      placeEntities.push(hazardFacets['zipCode']);
    }
    if (hazardFacets["climateDivision"] && hazardFacets["climateDivision"] != "") {
      placeEntities.push();
    }
    if (hazardFacets["nationalWeatherZone"] && hazardFacets["nationalWeatherZone"] != "") {
      placeEntities.push(hazardFacets['nationalWeatherZone']);
    }
    // return 0 result if no places satisfy the inputs
    if (Array.from(new Set(placeEntities))[0] == `` && Array.from(new Set(placeEntities)).length == 1) {
      return { 'count': 0, 'record': {} };
    }

    let placeSearchQuery = ``;
    if (hazardFacets["gnisType"] && hazardFacets["gnisType"].length > 0) {
      let gnisTypeArray = hazardFacets['gnisType'].map((uri) => `<${uri}>`).join(" ");

      placeSearchQuery += `
            ?entity kwg-ont:sfWithin ?s2Cell .
            ?s2Cell rdf:type kwg-ont:KWGCellLevel13;
                    kwg-ont:spatialRelation ?gnisEntity.
            ?gnisEntity kwg-ont:sfWithin ?s2cellGNIS;
                        rdf:type ?gnisPlaceType.
            values ?gnisPlaceType {${gnisTypeArray}}
        `;
      if (placeEntities.length > 0) {
        placeSearchQuery += `
                ?s2cellGNIS rdf:type kwg-ont:KWGCellLevel13 .
                values ?placesConnectedToS2 {kwgr:` + placeEntities.join(' kwgr:') + `}
                ?s2cellGNIS kwg-ont:spatialRelation ?placesConnectedToS2.
            `;
      }
    }
    else if (placeEntities.length > 0) {
      placeSearchQuery += `
            ?entity kwg-ont:spatialRelation ?s2Cell .
            ?s2Cell rdf:type kwg-ont:KWGCellLevel13 .
            values ?placesConnectedToS2 {kwgr:` + placeEntities.join(' kwgr:') + `}
            ?s2Cell kwg-ont:spatialRelation ?placesConnectedToS2.
        `;
    }

    //Filter by the date hazard occurred
    let dateQuery = '';
    if ((hazardFacets["hazardStart"] && hazardFacets["hazardStart"] != "") || (hazardFacets["hazardEnd"] && hazardFacets["hazardEnd"] != "")) {
      let dateArr: Array<string> = new Array();
      if (hazardFacets["hazardStart"] != "") {
        dateArr.push(`(?startTimeLabel > "` + hazardFacets["hazardStart"] + `T00:00:00+00:00"^^xsd:dateTime || ?startTimeLabel > "` + hazardFacets["hazardStart"] + `"^^xsd:date)`);
        dateArr.push(`(?endTimeLabel > "` + hazardFacets["hazardStart"] + `T00:00:00+00:00"^^xsd:dateTime || ?endTimeLabel > "` + hazardFacets["hazardStart"] + `"^^xsd:date)`);
      }
      if (hazardFacets["hazardEnd"] && hazardFacets["hazardEnd"] != "") {
        dateArr.push(`("` + hazardFacets["hazardEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?startTimeLabel || "` + hazardFacets["hazardEnd"] + `"^^xsd:date > ?startTimeLabel)`);
        dateArr.push(`("` + hazardFacets["hazardEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?endTimeLabel || "` + hazardFacets["hazardEnd"] + `"^^xsd:date > ?endTimeLabel)`);
      }
      dateQuery = `
            ?observationCollection sosa:phenomenonTime ?time.
            ?time time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                  time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
            FILTER (` + dateArr.join(' && ') + `)`;
    }

    //Filter by a circle on the map
    let spatialSearchQuery = '';
    if (typeof hazardFacets["spatialSearchWkt"] != 'undefined') {
      spatialSearchQuery += `
            ?entity geo:sfWithin '${hazardFacets["spatialSearchWkt"]}'^^geo:wktLiteral.
        `;
    }

    //Build the full query
    hazardQuery += `
        ?entity rdf:type ?type;
                rdfs:label ?label;
                kwg-ont:hasTemporalScope|sosa:isFeatureOfInterestOf/sosa:phenomenonTime ?time.
        optional
        {
            ?entity geo:hasGeometry/geo:asWKT ?wkt.
        }
        ?type rdfs:subClassOf kwg-ont:Hazard.
        ?entity kwg-ont:sfWithin ?place.
        ?time time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
              time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
        ${typeQuery}
        ${placeSearchQuery}
        ${dateQuery}

        ${spatialSearchQuery}
    }`;
    //${this.getHazardSearchResults(hazardFacets, pageNum, recordNum)}

    // If the user is searching for a hazard by keyword, sort them by the most relevant first
    if (hazardFacets["keyword"] != "") {
      hazardQuery += ` ORDER BY desc(?score)`;
    }

    let queryResults: Response = await this.query(hazardQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);
    let entityQueryStr: string = '';
    let hazardEntites: Array<string> = new Array();
    for (let row of queryResults['results'].bindings) {
      formattedResults.push({
        'hazard': row.entity.value,
        'hazard_name': row.label.value,
        'hazard_type': '',
        'hazard_type_name': '',
        'place': '',
        'place_name': '',
        'start_date': '',
        'start_date_name': '',
        'end_date': '',
        'end_date_name': '',
        'wkt': (typeof row.wkt === 'undefined') ? '' : row.wkt.value.replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>', '')
      });
      hazardEntites.push(row.entity.value);
      // URIS that can be placed in the query (they have the <> brackets)
      entityQueryStr = hazardEntites.map((uri) => `<${uri}>`).join(" ");
    }

    let hazardAttributesQuery = `select distinct ?entity (group_concat(distinct ?placeQuantName; separator = "||") as ?placeQuantName) (group_concat(distinct ?placeLabel; separator = "||") as ?placeLabel) (group_concat(distinct ?type; separator = "||") as ?type) (group_concat(distinct ?typeLabel; separator = "||") as ?typeLabel) (group_concat(distinct ?place; separator = "||") as ?place) (group_concat(distinct ?time; separator = "||") as ?time) (group_concat(distinct ?startTimeLabel; separator = "||") as ?startTimeLabel) (group_concat(distinct ?endTimeLabel; separator = "||") as ?endTimeLabel)
    {
        ?entity rdf:type ?type;
                kwg-ont:hasTemporalScope|sosa:isFeatureOfInterestOf/sosa:phenomenonTime ?time.

        ?type rdfs:label ?typeLabel.
        OPTIONAL
        {
            ?entity kwg-ont:sfWithin ?place.
            ?place rdf:type kwg-ont:AdministrativeRegion;
                   rdfs:label ?placeLabel.
            OPTIONAL { ?place kwg-ont:quantifiedName ?placeQuantName .}
        }
        ?time time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
              time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
        VALUES ?entity {${entityQueryStr}}
    } GROUP BY ?entity` ;

    console.log("Sending Query: ", hazardAttributesQuery);
    queryResults = await this.query(hazardAttributesQuery);
    queryResults['results']['bindings'].forEach(function (row, counterRow) {
      // If there isn't a quantified name use the regular label
      if (typeof row.placeQuantName === 'undefined') {
        // If there isn't a place name, use ''
        if (typeof row.placeLabel === 'undefined') {
          formattedResults[counterRow]['place_name'] = '';
        } else {
          formattedResults[counterRow]['place_name'] = row.placeLabel.value.split('||')[0];
        }
      } else {
        formattedResults[counterRow]['place_name'] = row.placeQuantName.value.split('||')[0];
      }
      formattedResults[counterRow]['hazard_type'] = row.type.value.split('||');
      formattedResults[counterRow]['hazard_type_name'] = row.typeLabel.value.split('||');
      formattedResults[counterRow]['place'] = (typeof row.place === 'undefined') ? '' : row.place.value.split('||')[0];
      formattedResults[counterRow]['start_date'] = row.time.value.split('||')[0];
      formattedResults[counterRow]['start_date_name'] = row.startTimeLabel.value.split('||')[0];
      formattedResults[counterRow]['end_date'] = row.time.value.split('||')[0];
      formattedResults[counterRow]['end_date_name'] = row.endTimeLabel.value.split('||')[0];
    })

    let countResults = await this.query(`select (count(*) as ?count) { ` + hazardQuery + ` LIMIT ` + recordNum * 10 + `}`);
    return { 'count': countResults['results']['bindings'][0].count.value, 'record': formattedResults };
  }

  /**
   * Gets the minimum amount of query for finding people.
   * @param keyword Any keywords the user searched for
   * @param expertiseTopics The strings of the expert topics
   * @returns A string of SPARQL without the SELECT predicate
   */
   getPeopleQueryBody(expertiseTopics, keyword="") {
    let expertiseTopicQuery = '';
    if (typeof expertiseTopics !== "undefined") {
      if (expertiseTopics.length > 0) {
        expertiseTopicQuery = `values ?expertise {<` + expertiseTopics.join('> <') + `>}`;
      }
    }
    let keyword_query = ``;
    if (keyword != "") {
      keyword_query =`?search a elastic-index:kwg_fs_index;
      elastic:query "${keyword}";
      elastic:entities ?entity.
      ?entity elastic:score ?score.`;
  }

    let query = `select distinct ?label ?entity ?affiliation ?affiliationLabel ?affiliationLoc ?affiliationQuantName ?affiliationLoc_label ?wkt
    (group_concat(distinct ?expertise; separator = ", ") as ?expertise)
    (group_concat(distinct ?expertiseLabel; separator = ", ") as ?expertiseLabel)
    where {
      ${keyword_query}
        ?entity rdf:type iospress:Contributor.
        ?entity rdfs:label ?label.
        ?entity kwg-ont:hasExpertise ?expertise.
        ${expertiseTopicQuery}
        ?expertise rdfs:label ?expertiseLabel.
        ?entity iospress:contributorAffiliation ?affiliation.
        ?affiliation rdfs:label ?affiliationLabel;
                      kwg-ont:sfWithin ?affiliationLoc;
        			        geo:hasGeometry/geo:asWKT ?wkt.
    	  ?affiliationLoc rdf:type ?affiliationLoc_type;
                     	  rdfs:label ?affiliationLoc_label.
    	  values ?affiliationLoc_type {kwg-ont:AdministrativeRegion_3}
        optional { ?affiliationLoc kwg-ont:quantifiedName ?affiliationQuantName }
    } group by ?label ?entity ?affiliation ?affiliationQuantName ?affiliationLabel ?affiliationLoc ?affiliationLoc_label ?wkt`
    return query;
  }

  /**
   * Gets all of the people in the database.
   *
   * @param expertiseTopics The URIs of the expert topics
   * @param keywords Any keywords the user searched for
   * @param limit The maximum number of results to retrieve
   * @param offset The number of results to skip
   * @returns An observable that the caller can watch
   */
    getAllPeople(expertiseTopics: Array<string>, keywords="", limit: number=20, offset=0) {
      let query = `SELECT * WHERE {`+this.getPeopleQueryBody(expertiseTopics, keywords)+`} LIMIT `+limit.toString()+`OFFSET`+offset.toString();
      let headers = this.getRequestHeaders('KE_06');
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Retrieves a list of all the sub-topics for a given list of topics.
     *
     * @param expertiseTopics An array of expert topics
     * @returns An observable with the query results
     */
    getSubTopics(expertiseTopics: Array<string>) {
      let query = `SELECT ?sub_topic WHERE {
        ?parent_topic kwg-ont:hasSubTopic ?sub_topic .
        values ?parent_topic {<` + expertiseTopics.join('> <') + `>}
      }`
      let headers = this.getRequestHeaders('KE_16');
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Gets the total number of people matching a facet selection
     *
     * @param expertiseTopics The expert topics that people might be experts in
     * @param keywords Any keywords the user searched for
     * @param limit The maximum number of results to retrieve
     * @param offset The number of results to skip
     * @return The number of results
     */
     getPeopleCount(expertiseTopics: Array<string> | undefined, keywords="", limit: number=20, offset: number=0) {
      let query=`SELECT (COUNT(*) as ?COUNT)  { SELECT DISTINCT ?entity {` + this.getPeopleQueryBody(expertiseTopics, keywords) + `} LIMIT `+limit.toString()+` OFFSET `+offset.toString()+'}';
      let headers = this.getRequestHeaders('KE_07');
      let body = this.getRequestBody(query);
      return this.http.post(this.endpoint, body, headers);
    }

    /**
     * Given a sparql query response, return an array of values
     *
     * @param response The HTTP web response
     * @returns The results as an array in the bindings
     */
    getResults(response: any) {
      return response['results']['bindings'];
    }

    /**
     * Gets the highest level administrative region, the United States
     *
     * @return Information about the US
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
     * Gets the highest level administrative region
     *
     * @return The topmost administrative regions in the US
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
     * @return All of the region's counties
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
     *
     * @returns An array of climate divisions
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

    /**
     * Gets all of the children of a particular hazard.
     *
     * @param hazardURI The parent hazard
     * @returns All of the parent hazard's children
     */
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

    /**
     * Retrieves all of the GNIS subclasses
     *
     * @returns The subclasses of the major GNIS classes
     */
    getGNISClasses() {
      let query = `SELECT DISTINCT ?place ?place_label {
        ?place rdfs:label ?place_label .
        values ?place { usgs:BuiltUpArea usgs:SurfaceWater usgs:Terrain }
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

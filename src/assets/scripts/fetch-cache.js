// Downloads and processes the cache files
// Used for network communication
const axios = require('axios').default;
// Used to write the cache to files
const fs = require('fs');
let baseAddress = process.argv.slice(2)[0];
let endpoint = `${process.argv.slice(2)[1]}/graphdb/repositories/KWG`;

/**
 * Sends a SPARQL request
 * @param {string} query: The SPARQL query string
 * @returns A promise
 */
sparqlRequest = async function(query) {
  var bodyFormData = new URLSearchParams();
  bodyFormData.append('query', query);
  return axios.post(endpoint, bodyFormData,
  {
    headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/sparql-results+json"
    }
  });
}

/**
 * Recursively downloads all of the records for a given SPARQL query.
 *
 * It follows a non-optimistic approach, where an extra query will be sent for result
 * sets less than the maximum size set by the graph database. eg if 300 results are
 * returned, a second query at offset 300 is sent which will return 0-thus terminating the
 * recursion.
 *
 * @param {*} query The SPARQL query to fetch the data.
 * @param {*} fileName The name of the file where the data is saved
 * @param {*} data An array of arrays, where the inner array contains [subject ,value], which come from the query
 */
async function fetchCache(query, fileName, data=[]) {
  // Determine how many records there are for an OFFSET
  let count = data.length;
  // Add an OFFSET to the query. This is how further results are obtained
  let offset_query = query+` OFFSET ${count}`;
  try {
  let results = await sparqlRequest(offset_query);
    results.data.results.bindings.forEach((res)=>{
    data.push([res.subject.value, res.value.value]);
  })


  // If there are a non-zero number of records, ask for more
  if (results.data.results.bindings.length) {
    // Wait for fetchCache to complete, otherwise a promise will be pushed
    try {
      data.push(await fetchCache(query, fileName, data));
    } catch(err) {
      console.error("Error fetching more cache results!", err)
    }
  } else {
    let file = fs.createWriteStream(fileName);
    file.on('error', (err) => { console.error("Failed writing to disk", err) });
    data.forEach((record) => { file.write(record.join(',') + '\n'); });
    file.end();
  }} catch(err) {
    console.error(err)
  };
}

// Download the FIPS codes cache
let fipsQuery = `PREFIX kwg-ont: <${baseAddress}/lod/ontology/>
SELECT DISTINCT ?subject ?value WHERE {
?subject kwg-ont:hasFIPS ?value .
} ORDER BY ASC(?value)`;
console.log("Getting FIPS")
fetchCache(fipsQuery, 'src/assets/data/fips_cache.csv')

// Download the ZIP codes cache
let zipCodeQuery = `PREFIX kwg-ont: <${baseAddress}/lod/ontology/>
SELECT DISTINCT ?subject ?value WHERE {
  ?subject a kwg-ont:ZipCodeArea.
  ?subject rdfs:label ?label .
  BIND(REPLACE(STR(?label),"zip code ","") AS ?value)
} ORDER BY ASC(?value)`;
console.log("Getting ZIP Code")
fetchCache(zipCodeQuery, 'src/assets/data/zipcode_cache.csv')

// Download the nwz cache
let nwzQuery = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <${baseAddress}/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?subject ?value where {
        ?subject rdf:type kwg-ont:NWZone;
                rdfs:label ?value.
} ORDER BY ASC(?value)`;
console.log("Getting NWZ")
fetchCache(nwzQuery, 'src/assets/data/nwz_cache.csv')

// Download the US Climate Division cache
let climateDivisionQuery = `PREFIX kwg-ont: <http://stko-kwg.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?subject ?value {
	?subject rdf:type kwg-ont:USClimateDivision;
	rdfs:label ?label.
  BIND(REPLACE(STR(?label),"US Climate Division with ID ","") AS ?value) .
}`;
fetchCache(climateDivisionQuery, 'src/assets/data/climate_division_cache.csv')

// Download the Administrative Region cache
let adminRegionQuery = `PREFIX kwg-ont: <http://stko-kwg.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?subject ?value {
	?subject rdf:type kwg-ont:USClimateDivision;
	rdfs:label ?label.
  BIND(REPLACE(STR(?label),"US Climate Division with ID ","") AS ?value) .
}`;
//fetchCache(adminRegionQuery, 'src/assets/data/admin_region_cache.csv')

// query.js contains the javascript codes that query data from KnowWhereGraph.
// Right now the endpoint is set to be KnowWhereGraph-v1 from stko-roy.

// store expertise super topics, place types and hazard types
const h_superTopics = {};
const h_placeTypes = {};
const h_hazardTypes = {};

// Prefixes
const H_PREFIXES = {
	rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
	xsd: 'http://www.w3.org/2001/XMLSchema#',
	owl: 'http://www.w3.org/2002/07/owl#',
	dc: 'http://purl.org/dc/elements/1.1/',
	dcterms: 'http://purl.org/dc/terms/',
	foaf: 'http://xmlns.com/foaf/0.1/',
	kwgr: 'http://stko-roy.geog.ucsb.edu/lod/resource/',
	'kwg-ont':'http://stko-roy.geog.ucsb.edu/lod/ontology/',
	geo: 'http://www.opengis.net/ont/geosparql#',
	ago: 'http://awesemantic-geo.link/ontology/',
    elastic: 'http://www.ontotext.com/connectors/elasticsearch#',
    'elastic-index': 'http://www.ontotext.com/connectors/elasticsearch/instance#'
};

let S_PREFIXES = '';
for(let [si_prefix, p_prefix_iri] of Object.entries(H_PREFIXES)) {
	S_PREFIXES += `prefix ${si_prefix}: <${p_prefix_iri}>\n`;
}

// SPARQL endpoint
const P_ENDPOINT = 'http://stko-roy.geog.ucsb.edu:7202/repositories/KnowWhereGraph-V1';

async function query(srq_query) {
	let d_form = new FormData();
	d_form.append('query',  S_PREFIXES+srq_query);
    let username = 'admin';
    let password = 'kwg2021-roy';

	let d_res = await fetch(P_ENDPOINT, {
		method: 'POST',
		mode: 'cors',
		headers: {
			Accept: 'application/sparql-results+json',
			'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(username + ":" + password),
		},
		body: new URLSearchParams([
			...(d_form),
		]),
	});

	return (await d_res.json()).results.bindings;
}

// query expertise super topics, place types and hazard types
(async() => {
    let a_superTopics = await query(/* syntax: sparql */ `
        select distinct ?super_topic ?super_topic_label where { 
            ?topic rdf:type kwg-ont:Topic;
                rdfs:label ?topic_label;
                kwg-ont:hasSuperTopic ?super_topic.
            ?super_topic rdfs:label ?super_topic_label.
        }
    `);

    for (let row of a_superTopics) {
        h_superTopics[row.super_topic.value] = row.super_topic_label.value;
    }

    let a_placeTypes = await query(/* syntax: sparql */ `
        select ?place_type ?place_type_label where { 
            ?place_type rdfs:subClassOf kwg-ont:Place;
                rdfs:label ?place_type_label.
        }
    `);

    for (let row of a_placeTypes) {
        h_placeTypes[row.place_type.value] = row.place_type_label.value;
    }

    let a_hazardTypes = await query(/* syntax: sparql */ `
        select ?hazard_type ?hazard_type_label where { 
            ?hazard_type rdfs:subClassOf kwg-ont:Hazard;
                rdfs:label ?hazard_type_label.
        }
    `);

    for (let row of a_hazardTypes) {
        h_hazardTypes[row.hazard_type.value] = row.hazard_type_label.value;
    }

})();

// functions that respond to onclick events
// query expertise subtopics
async function getSuperTopic(super_topic_iri) {
    //let h_topics = {};
    let a_topics = await query(/* syntax: sparql */ `
        select ?topic ?topic_label where { 
            ?topic rdf:type kwg-ont:Topic;
                rdfs:label ?topic_label;
                kwg-ont:hasSuperTopic ?super_topic.
            values ?super_topic {<${super_topic_iri}>}.
        }
    `);
    // for (let row of a_topics) {
    //     h_topics[row.topic.value] = row.topic_label.value;
    // }
    return a_topics;
}

// query place instances of a chosen place type
async function getPlaceType(place_type_iri) {
    // let h_places = {};
    let a_places = await query(/* syntax: sparql */ `
        select ?place ?place_label where { 
            ?place rdf:type ?place_type;
                rdfs:label ?place_label.
            values ?place_type {<${place_type_iri}>}.
        }
    `);
    // for (let row of a_places) {
    //     h_places[row.place.value] = row.place_label.value;
    // }
    return a_places;
}

// query expert table record
async function getExpertTableRecord(expertise_iri_list, location_iri_list) {
    let expert_table_record = [];
    let a_tablerecord = await query(/* syntax: sparql */ `
        select ?affiliation ?affiliation_name ?department ?department_name ?expertise ?expertise_name ?firstname ?lastname ?tablename ?webpage
        {
            ?expert kwg-ont:affiliation ?affiliation;
                    kwg-ont:department ?department;
                    kwg-ont:firstName ?firstname;
                    kwg-ont:lastName ?lastname;
                    kwg-ont:tableName ?tablename;
                    kwg-ont:personalPage ?webpage;
                    kwg-ont:hasExpertise ?expertise.
            ?type rdfs:label ?type_name.
            ?expertise rdfs:label ?expertise_name.
            ?department rdfs:label ?department_name.
            ?affiliation kwg-ont:locatedAt ?affiliation_loc;
                        rdfs:label ?affiliation_name.
            FILTER (?expertise in (${expertise_iri_list.map((expertise) => `<${expertise}>`).join(',')}))
            FILTER (?affiliation_loc in (${location_iri_list.map((location) => `<${location}>`).join(',')}))
        } 
    `);
    return a_tablerecord;
}

// query hazard table records
async function getHazardTableRecord(place_iri_list, date_iri_list, hazard_iri_list) {
    let hazard_table_record = [];
    let a_tablerecord = await query(/* syntax: sparql */ `
        select ?hazard ?hazard_name ?place ?place_name ?date ?date_name
        {
            ?hazard kwg-ont:locatedAt ?place;
                sosa:phenomenonTime ?date;
                rdf:type ?hazard_type;
                rdfs:label ?hazard_name.
            ?date rdfs:label ?date_name.
            ?place rdfs:label ?place_name.
            filter (?place in (${place_iri_list.map((place) => `<${place}>`).join(',')}))
            filter (?date in (${date_iri_list.map((date) => `<${date}>`).join(',')}))
            filter (?hazard_type in (${hazard_iri_list.map((hazard) => `<${hazard}>`).join(',')}))
        }
    `);
    return a_tablerecord;
}

// query place table records
async function getPlaceTableRecord(place_iri_list) {
    let place_table_record = [];
    let a_tablerecord = await query(/* syntax: sparql */ `
        select ?place ?place_name ?geometry ?geometry_wkt
        {
            ?place rdfs:label ?place_name;
                geo:hasGeometry ?geometry.
            ?geometry geo:asWKT ?geometry_wkt
            filter (?place in (${place_iri_list.map((place) => `<${place}>`).join(',')}))
        }
    `);
    return a_tablerecord;
}
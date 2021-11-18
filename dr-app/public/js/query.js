// query.js contains the javascript codes that query data from KnowWhereGraph.
// Right now the endpoint is set to be KnowWhereGraph-V1 from stko-roy.

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
    'kwg-ont': 'http://stko-roy.geog.ucsb.edu/lod/ontology/',
    geo: 'http://www.opengis.net/ont/geosparql#',
    time: 'http://www.w3.org/2006/time#',
    ago: 'http://awesemantic-geo.link/ontology/',
    sosa: 'http://www.w3.org/ns/sosa/',
    elastic: 'http://www.ontotext.com/connectors/elasticsearch#',
    'elastic-index': 'http://www.ontotext.com/connectors/elasticsearch/instance#'
};

let S_PREFIXES = '';
for (let [si_prefix, p_prefix_iri] of Object.entries(H_PREFIXES)) {
    S_PREFIXES += `prefix ${si_prefix}: <${p_prefix_iri}>\n`;
}

// SPARQL endpoint
const P_ENDPOINT = 'http://stko-roy.geog.ucsb.edu:7202/repositories/KnowWhereGraph-V1';

async function query(srq_query) {
    let d_form = new FormData();
    d_form.append('query', S_PREFIXES + srq_query);

    let d_res = await fetch(P_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/sparql-results+json',
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Authorization': 'Basic ' + btoa(username + ":" + password),
        },
        body: new URLSearchParams([
            ...(d_form),
        ]),
    });

    return (await d_res.json()).results.bindings;
}

// query expertise super topics, place types and hazard types
async function getFilters() {
    // store expertise super topics, place types and hazard types
    let h_superTopics = {};
    let h_placeTypes = {};
    let h_hazardTypes = {};

    let a_superTopics = await query( /* syntax: sparql */ `
        select ?super_topic ?super_topic_label where { 
            ?super_topic rdf:type kwg-ont:ExpertiseTopic;
                rdfs:label ?super_topic_label.
        }
    `);

    for (let row of a_superTopics) {
        h_superTopics[row.super_topic.value] = row.super_topic_label.value;
    }

    let a_placeTypes = await query( /* syntax: sparql */ `
        select ?place_type ?place_type_label where { 
            ?place_type rdfs:subClassOf kwg-ont:Place;
                rdfs:label ?place_type_label.
        }
    `);

    for (let row of a_placeTypes) {
        h_placeTypes[row.place_type.value] = row.place_type_label.value;
    }

    let a_hazardTypes = await query( /* syntax: sparql */ `
        select ?hazard_type ?hazard_type_label where { 
            ?hazard_type rdfs:subClassOf kwg-ont:Hazard;
                rdfs:label ?hazard_type_label.
        }
    `);

    for (let row of a_hazardTypes) {
        h_hazardTypes[row.hazard_type.value] = row.hazard_type_label.value;
    }

    return {'Expertise':h_superTopics, 'Place':h_placeTypes, 'Hazard':h_hazardTypes};

    // test data
    // let expertises_iri_selected = ['http://stko-roy.geog.ucsb.edu/lod/resource/topic.data_science','http://stko-roy.geog.ucsb.edu/lod/resource/topic.covid19'];
    // let place_type_iri_list_selected = ['http://stko-roy.geog.ucsb.edu/lod/ontology/City','http://stko-roy.geog.ucsb.edu/lod/ontology/County','http://stko-roy.geog.ucsb.edu/lod/ontology/NWSZone'];
    // let hazards_type_iri_selected =['http://stko-roy.geog.ucsb.edu/lod/ontology/Wildfire', 'http://stko-roy.geog.ucsb.edu/lod/ontology/ThunderstormWind'];
    // let keyword = "California";
    // let start_year = '1990';
    // let start_month = '01';
    // let start_date = '01';
    // let end_year = '2021';
    // let end_month = '12';
    // let end_date = '31';
    // let search_result = getFullTextSearchResult(keyword, expertises_iri_selected, place_type_iri_list_selected, hazards_type_iri_selected, start_year, start_month, start_date, end_year, end_month, end_date);
    // console.log(search_result);

};

// functions that respond to onclick events
// query expertise subtopics
async function getSubTopic(super_topic_iri) {
    let h_subTopics = [];
    let a_topics = await query( /* syntax: sparql */ `
        select ?topic ?topic_label where { 
            ?super_topic kwg-ont:subTopic ?topic.
            ?topic rdfs:label ?topic_label.
            values ?super_topic {<${super_topic_iri}>}.
        }
    `);

    for (let row of a_topics) {
        h_subTopics.push({ 'topic': row.topic.value, 'topic_label': row.topic_label.value });
    }
    return h_subTopics;
}

// query place instances of a chosen place type
async function getPlaceInstance(place_type_iri) {
    let h_places = [];
    let a_places = await query( /* syntax: sparql */ `
        select ?place ?place_label where { 
            ?place rdf:type ?place_type;
                rdfs:label ?place_label.
            values ?place_type {<${place_type_iri}>}.
        }
    `);
    for (let row of a_places) {
        h_places.push({ 'place': row.place.value, 'place_label': row.place_label.value });
    }
    return h_places;
}

// query expert location geometry
async function getExpertLocationGeometry(expert_iri_list) {
    let h_geometry = [];
    let a_geometry = await query( /* syntax: sparql */ `
        select ?expert ?expert_location ?expert_location_geometry ?expert_location_geometry_wkt
        {
            ?expert kwg-ont:affiliation ?affiliation.
            ?affiliation kwg-ont:locatedAt ?expert_location.
            ?expert_location geo:hasGeometry ?expert_location_geometry.
            ?expert_location_geometry geo:asWKT ?expert_location_geometry_wkt.
            filter (?expert in (${expert_iri_list.map((expert) => `<${expert}>`).join(',')}))
        }
    `);
    for (let row of a_geometry)
    {
        h_geometry.push({
            'expert':row.expert.value, 
            'expert_location':row.expert_location.value,
            'expert_location_geometry':row.expert_location_geometry.value,
            'expert_location_geometry_wkt':row.expert_location_geometry_wkt.value
        });
    }
    return h_geometry;
}

// query place geometry
async function getPlaceGeometry(place_iri_list)
{
    let h_geometry = [];
    let a_geometry = await query(/* syntax: sparql */ `
        select ?place ?place_geometry ?place_geometry_wkt ?place_name
        {
            ?place rdfs:label ?place_name;
                   geo:hasGeometry ?place_geometry.
            ?place_geometry geo:asWKT ?place_geometry_wkt.
            filter (?place in (${place_iri_list.map((place) => `<${place}>`).join(',')}))
        }
    `);
    for (let row of a_geometry)
    {
        h_geometry.push({
            'place':row.place.value, 
            'place_geometry':row.place_geometry.value,
            'place_geometry_wkt':row.place_geometry_wkt.value,
            'place_name': row.place_name.value
        });
    }
    return h_geometry;
}

// query hazard location geometry
async function getHazardLocationGeometry(hazard_iri_list)
{
    let h_geometry = [];
    let a_geometry = await query(/* syntax: sparql */ `
        select ?hazard ?hazard_location ?hazard_location_geometry ?hazard_location_geometry_wkt
        {
            ?hazard kwg-ont:locatedAt ?hazard_location.
            ?hazard_location geo:hasGeometry ?hazard_location_geometry.
            ?hazard_location_geometry geo:asWKT ?hazard_location_geometry_wkt.
            filter (?hazard in (${hazard_iri_list.map((hazard) => `<${hazard}>`).join(',')}))
        }
    `);
    for (let row of a_geometry)
    {
        h_geometry.push({
            'hazard':row.hazard.value, 
            'hazard_location':row.hazard_location.value,
            'hazard_location_geometry':row.hazard_location_geometry.value,
            'hazard_location_geometry_wkt':row.hazard_location_geometry_wkt.value
        });
    }
    return h_geometry;
}

// query expert table record
async function getExpertTableRecord(expert_query_string, place_query_string) {
    let h_expertTable = [];
    let query_string = expert_query_string.slice(0, -1) + `{ select ?place {` + place_query_string + `}}}`;
    let a_expertTable = await query(query_string);
    for (let row of a_expertTable)
    {
        h_expertTable.push({
            'expert':row.expert.value,
            'expert_name':row.expert_name.value,
            'affiliation':row.affiliation.value,
            'affiliation_name':row.affiliation_name.value,
            'department':row.department.value,
            'department_name':row.department_name.value,
            'expertise':row.expertise.value,
            'expertise_name':row.expertise_name.value,
            'place':row.place.value,
            'place_name':row.place_name.value,
            'webpage':row.webpage.value
        });
    }
    return h_expertTable;
}

// query hazard table records
async function getHazardTableRecord(hazard_query_string, place_query_string) {
    let h_hazardTable = [];
    let query_string = hazard_query_string.slice(0, -1) + `{ select ?place {` + place_query_string + `}}}`;
    let a_hazardTable = await query(query_string);
    for (let row of a_hazardTable)
    {
        h_hazardTable.push({
            'hazard':row.hazard.value,
            'hazard_name':row.hazard_name.value,
            'hazard_type':row.hazard_type.value,
            'hazard_type_name':row.hazard_type_name.value,
            'place':row.place.value,
            'place_name':row.place_name.value,
            'date':row.date.value,
            'date_name':row.date_name.value,
            'hazard_location_geometry':(typeof row.hazard_location_geometry  === 'undefined') ? '' : row.hazard_location_geometry.value,
            'hazard_location_geometry_wkt':(typeof row.hazard_location_geometry_wkt  === 'undefined') ? '' : row.hazard_location_geometry_wkt.value
        });
    }
    return h_hazardTable;
}

// query place table records
async function getPlaceTableRecord(place_query_string, expert_query_string, hazard_query_string) {
    let h_placeTable = [];
    let query_string = `
        select distinct ?place ?place_name ?place_type ?place_type_name ?place_geometry ?place_geometry_wkt
        {
    `;
    query_string += `{` + expert_query_string + `} union {` + hazard_query_string + `}}`;
    let a_placeTable = await query(query_string);
    for (let row of a_placeTable)
    {
        h_placeTable.push({
            'place':row.place.value,
            'place_name':row.place_name.value,
            'place_type':row.place_type.value,
            'place_type_name':row.place_type_name.value,
            'place_geometry':(typeof row.place_geometry  === 'undefined') ? '' : row.place_geometry.value,
            'place_geometry_wkt':(typeof row.place_geometry_wkt  === 'undefined') ? '' : row.place_geometry_wkt.value
        });
    }
    return h_placeTable;
}

// full-text search
async function getFullTextSearchResult(keyword, expertises_iri_selected, place_type_iri_list_selected, hazards_type_iri_selected, start_year, start_month, start_date, end_year, end_month, end_date)
{
    let place_query_string = `
        select *
        {
    `;
    let expert_query_string = `
        select *
        {
    `;
    let hazard_query_string = `
        select *
        {
    `;

    if (keyword != "")
    {
        place_query_string += `
            ?search a elastic-index:dr_index_new;
            elastic:query "${keyword}";
            elastic:entities ?place.
        `;
        expert_query_string += `
            ?search a elastic-index:dr_index_new;
            elastic:query "${keyword}";
            elastic:entities ?expert.
        `;
        hazard_query_string += `
            ?search a elastic-index:dr_index_new;
            elastic:query "${keyword}";
            elastic:entities ?hazard.
        `;
    }

    place_query_string += `
        ?place rdfs:label ?place_name;
               rdf:type ?place_type.
        optional
        {
            ?place geo:hasGeometry ?place_geometry.
            ?place_geometry geo:asWKT ?place_geometry_wkt.
        }
        ?place_type rdfs:subClassOf kwg-ont:Place;
                    rdfs:label ?place_type_name.
    `;
    if (place_type_iri_list_selected.length != 0)
    {
        place_query_string += `filter (?place_type in (${place_type_iri_list_selected.map((place_type) => `<${place_type}>`).join(',')}))`;
    }

    expert_query_string += `
        ?expert rdf:type kwg-ont:Expert;
                kwg-ont:affiliation ?affiliation;
                kwg-ont:department ?department;
                kwg-ont:personalPage ?webpage;
                kwg-ont:hasExpertise ?expertise;
                rdfs:label ?expert_name .
        ?expertise rdfs:label ?expertise_name.
        ?department rdfs:label ?department_name.
        ?affiliation rdfs:label ?affiliation_name;
                        kwg-ont:locatedAt ?place.
        ?place rdf:type ?place_type;
               rdfs:label ?place_name.
        ?place_type rdfs:subClassOf kwg-ont:Place;
                    rdfs:label ?place_type_name.
        optional
        {
            ?place geo:hasGeometry ?place_geometry .
            ?place_geometry geo:asWKT ?place_geometry_wkt .
        }
    `; 
    if (expertises_iri_selected.length != 0)
    {
        expert_query_string += `filter (?expertise in (${expertises_iri_selected.map((expertise) => `<${expertise}>`).join(',')}))`;
    }

    hazard_query_string += `
        ?hazard kwg-ont:locatedAt ?place;
                sosa:phenomenonTime ?date;
                rdf:type ?hazard_type;
                rdfs:label ?hazard_name;
                rdf:type ?hazard_type.
        ?hazard_type rdfs:subClassOf kwg-ont:Hazard.
        ?date rdfs:label ?date_name;
              time:hasBeginning ?start_date;
              time:hasEnd ?end_date.
        ?start_date rdfs:label ?start_date_label.
        ?end_date rdfs:label ?end_date_label.
        ?place rdfs:label ?place_name;
               rdf:type ?place_type.
        ?place_type rdfs:subClassOf kwg-ont:Place;
                    rdfs:label ?place_type_name.
        optional
        {
            ?place geo:hasGeometry ?place_geometry.
            ?place_geometry geo:asWKT ?place_geometry_wkt. 
        } 
        ?hazard_type rdfs:label ?hazard_type_name.
    `;
    if ((start_year != '') && (start_month != '') && (start_date != ''))
    {
        hazard_query_string += `filter (?start_date_label >= '${start_year+'-'+start_month+'-'+start_date+'-0000 EST'}')`;
    }
    if ((end_year != '') && (end_month != '') && (end_date != ''))
    {
        hazard_query_string += `filter (?end_date_label <= '${end_year+'-'+end_month+'-'+end_date+'-2400 EST'}')`;
    }
    if (hazards_type_iri_selected.length != 0)
    {
        hazard_query_string += `filter (?hazard_type in (${hazards_type_iri_selected.map((hazard_type) => `<${hazard_type}>`).join(',')}))`;
    }

    place_query_string += `}`;
    expert_query_string += `}`;
    hazard_query_string += `}`;

    let search_result = {
        "Place":getPlaceTableRecord(place_query_string, expert_query_string, hazard_query_string),
        "Expert":getExpertTableRecord(expert_query_string, place_query_string),
        "Hazard":getHazardTableRecord(hazard_query_string, place_query_string)
    }
    console.log(search_result);
    return search_result;
}
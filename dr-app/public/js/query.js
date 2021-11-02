// query.js contains the javascript codes that query data from KnowWhereGraph.
// Right now the endpoint is set to be KnowWhereGraph-V1 from stko-roy.

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
    time: 'http://www.w3.org/2006/time#',
	ago: 'http://awesemantic-geo.link/ontology/',
    sosa: 'http://www.w3.org/ns/sosa/',
    elastic: 'http://www.ontotext.com/connectors/elasticsearch#',
    'elastic-index': 'http://www.ontotext.com/connectors/elasticsearch/instance#'
};

let S_PREFIXES = '';
for(let [si_prefix, p_prefix_iri] of Object.entries(H_PREFIXES)) {
	S_PREFIXES += `prefix ${si_prefix}: <${p_prefix_iri}>\n`;
}

// SPARQL endpoint
const P_ENDPOINT = 'http://stko-roy.geog.ucsb.edu:7202/repositories/KnowWhereGraph-V1';

// define the configuration for full-text search
const full_text_config = {
    "description":"configuration for full-text search on the KnowWhereGraph-v1 repository on stko-roy",
    "info": [
        {
            "class":"Place",
            "subclasses":
            [
                "City",
                "State",
                "NWSZone",
                "Marine",
                "County"
            ]
        },
        {
            "class":"Expert"
        },
        {
            "class":"Hazard",
            "subclasses":
            [
                "Hail",
                "ThunderstormWind",
                "Tornado",
                "HeavySnow",
                "HeavyRain",
                "ExtremeColdWindChill",
                "Waterspout",
                "FunnelCloud",
                "RipCurrent",
                "Avalanche",
                "HighWind",
                "IceStorm",
                "Blizzard",
                "HighSurf",
                "Flood",
                "Wildfire",
                "Drought",
                "WinterStorm",
                "WinterWeather",
                "DenseFog",
                "FlashFlood",
                "StormSurgeTide",
                "DustStorm",
                "StrongWind",
                "ExcessiveHeat",
                "Lightning",
                "DebrisFlow",
                "FrostFreeze",
                "Sleet",
                "Lake-EffectSnow",
                "ColdWindChill",
                "Heat",
                "DustDevil",
                "TropicalStorm",
                "MarineThunderstormWind",
                "FreezingFog",
                "MarineHail",
                "CoastalFlood",
                "MarineHighWind",
                "AstronomicalLowTide",
                "MarineStrongWind",
                "Sneakerwave",
                "LakeshoreFlood",
                "TropicalDepression",
                "MarineTropicalStorm",
                "DenseSmoke",
                "MarineHurricaneTyphoon",
                "MarineTropicalDepression",
                "Hurricane"
            ]
        }
    ]
};

async function query(srq_query) {
	let d_form = new FormData();
	d_form.append('query',  S_PREFIXES+srq_query);

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
(async() => {
    let a_superTopics = await query(/* syntax: sparql */ `
        select ?super_topic ?super_topic_label where { 
            ?super_topic rdf:type kwg-ont:ExpertiseTopic;
                rdfs:label ?super_topic_label.
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


    //let expertises_iri_selected = ['http://stko-roy.geog.ucsb.edu/lod/resource/topic.data_science','http://stko-roy.geog.ucsb.edu/lod/resource/topic.covid19'];
    //let place_iri_list_selected = ['http://stko-roy.geog.ucsb.edu/lod/resource/city.Boston','http://stko-roy.geog.ucsb.edu/lod/resource/city.Seattle'];
    //let place_iri_list_selected = ['http://stko-roy.geog.ucsb.edu/lod/resource/c.01019','http://stko-roy.geog.ucsb.edu/lod/resource/c.01021'];
    //let hazards_type_iri_selected =['http://stko-roy.geog.ucsb.edu/lod/ontology/Hail', 'http://stko-roy.geog.ucsb.edu/lod/ontology/ThunderstormWind'];
    // let expertises_iri_selected = [];
    // let place_iri_list_selected = [];
    // let hazards_type_iri_selected = [];
    // let keyword = "Boston";
    // let start_year = 1990;
    // let end_year = 2021;
    // let search_result = {
    //     "Place":getPlaceTableRecord(keyword, place_iri_list_selected),
    //     "Expert":getExpertTableRecord(keyword,expertises_iri_selected, place_iri_list_selected),
    //     "Hazard":getHazardTableRecord(keyword, hazards_type_iri_selected, place_iri_list_selected, start_year, end_year)
    // }
    // console.log(search_result);

})();

// functions that respond to onclick events
// query expertise subtopics
async function getSubTopic(super_topic_iri) {
    let h_subTopics = [];
    let a_topics = await query(/* syntax: sparql */ `
        select ?topic ?topic_label where { 
            ?super_topic kwg-ont:subTopic ?topic.
            ?topic rdfs:label ?topic_label.
            values ?super_topic {<${super_topic_iri}>}.
        }
    `);
    
    for (let row of a_topics) 
    {
        h_subTopics.push({'topic':row.topic.value, 'topic_label':row.topic_label.value});
    }
    return h_subTopics;
}

// query place instances of a chosen place type
async function getPlaceInstance(place_type_iri) {
    let h_places = [];
    let a_places = await query(/* syntax: sparql */ `
        select ?place ?place_label where { 
            ?place rdf:type ?place_type;
                rdfs:label ?place_label.
            values ?place_type {<${place_type_iri}>}.
        }
    `);
    for (let row of a_places)
    {
        h_places.push({'place':row.place.value, 'place_label':row.place_label.value});
    }
    return h_places;
}

// query expert table record
async function getExpertTableRecord(keyword, expertise_iri_list, place_iri_list) {
    let h_expertTable = [];
    let query_string = `
        select ?expert ?expert_name ?affiliation_name ?department_name (group_concat(?expertise_name; separator="\\n") as ?expertise_list) ?webpage
        {
    `;
    if (keyword != "")
    {
        query_string += `
            ?search a elastic-index:dr_index_new;
            elastic:query "${keyword}";
            elastic:entities ?expert.
        `;
    }
    query_string += `
            ?expert kwg-ont:affiliation ?affiliation;
                    kwg-ont:department ?department;
                    kwg-ont:personalPage ?webpage;
                    kwg-ont:hasExpertise ?expertise;
                    rdfs:label ?expert_name .
            ?expertise rdfs:label ?expertise_name.
            ?department rdfs:label ?department_name.
            ?affiliation rdfs:label ?affiliation_name;
                         kwg-ont:locatedAt ?affiliation_loc.
    `;
    if (expertise_iri_list.length != 0)
    {
        query_string += `filter (?expertise in (${expertise_iri_list.map((expertise) => `<${expertise}>`).join(',')}))`;
    }
    if (place_iri_list.length != 0)
    {
        query_string += `filter (?affiliation_loc in (${place_iri_list.map((location) => `<${location}>`).join(',')}))`;
    }
    query_string += `
        }
        group by ?expert ?expert_name ?affiliation_name ?department_name ?webpage
    `;

    let a_expertTable = await query(query_string);
    for (let row of a_expertTable)
    {
        h_expertTable.push({
            'expert':row.expert.value,
            'expert_name':row.expert_name.value,
            'affiliation_name':row.affiliation_name.value,
            'department_name':row.department_name.value,
            'expertise_list':row.expertise_list.value,
            'webpage':row.webpage.value
        });
    }
    return h_expertTable;
}

// query hazard table records
async function getHazardTableRecord(keyword, hazard_type_iri_list, place_iri_list, start_year, end_year) {
    let h_hazardTable = [];
    let query_string = `
        select ?hazard ?hazard_name ?hazard_type_name ?place_name ?date_name
        {
    `;
    if (keyword != "")
    {
        query_string += `
            ?search a elastic-index:dr_index_new;
            elastic:query "${keyword}";
            elastic:entities ?hazard.
        `;
    }
    query_string += `
            ?hazard kwg-ont:locatedAt ?place;
                sosa:phenomenonTime ?date;
                rdf:type ?hazard_type;
                rdfs:label ?hazard_name.
            ?date rdfs:label ?date_name;
                time:hasBeginning ?start_date;
                time:hasEnd ?end_date.
            ?start_date rdfs:label ?start_date_label.
            ?end_date rdfs:label ?end_date_label.
            ?place rdfs:label ?place_name.
            ?hazard_type rdfs:label ?hazard_type_name.
    `;
    if (place_iri_list.length != 0)
    {
        query_string += `filter (?place in (${place_iri_list.map((place) => `<${place}>`).join(',')}))`;
    }
    if (start_year != '')
    {
        query_string += `filter (?start_date_label >= '${start_year+'-01-01-0000 EST'}')`;
    }
    if (end_year != '')
    {
        query_string += `filter (?end_date_label <= '${end_year+'-12-31-2400 EST'}')`;
    }
    if (hazard_type_iri_list.length != 0)
    {
        query_string += `filter (?hazard_type in (${hazard_type_iri_list.map((hazard_type) => `<${hazard_type}>`).join(',')}))`;
    }

    query_string += `}`;
    let a_hazardTable = await query(query_string);
    for (let row of a_hazardTable)
    {
        h_hazardTable.push({
            'hazard':row.hazard.value,
            'hazard_name':row.hazard_name.value,
            'hazard_type_name':row.hazard_type_name.value,
            'place_name':row.place_name.value,
            'date_name':row.date_name.value
        });
    }
    return h_hazardTable;
}

// query place table records
async function getPlaceTableRecord(keyword, place_iri_list) {
    let h_placeTable = [];
    let query_string = `
        select ?place ?place_name
        {
    `;
    if (keyword != "")
    {
        query_string += `
            ?search a elastic-index:dr_index_new;
            elastic:query "${keyword}";
            elastic:entities ?place.
        `;
    }
    query_string += `
        ?place rdfs:label ?place_name;
               rdf:type ?place_type.
        ?place_type rdfs:subClassOf kwg-ont:Place.
    `;
    if (place_iri_list.length != 0)
    {
        query_string += `filter (?place in (${place_iri_list.map((place) => `<${place}>`).join(',')}))`;
    }
    query_string += `}`;
    console.log(query_string);
    let a_placeTable = await query(query_string);
    for (let row of a_placeTable)
    {
        h_placeTable.push({
            'place':row.place.value,
            'place_name':row.place_name.value
        });
    }
    return h_placeTable;
}

// full-text search
async function getFullTextSearchResult(keyword, expertises_iri_selected, place_iri_list_selected, hazards_type_iri_selected, start_year, end_year)
{
    let search_result = {
        "Place":getPlaceTableRecord(keyword, place_iri_list_selected),
        "Expert":getExpertTableRecord(keyword,expertises_iri_selected, place_iri_list_selected),
        "Hazard":getHazardTableRecord(keyword, hazards_type_iri_selected, place_iri_list_selected, start_year, end_year)
    }
    console.log(search_result);
}
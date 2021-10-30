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
async function getSubTopic(super_topic_iri) {
    let a_topics = await query(/* syntax: sparql */ `
        select ?topic ?topic_label where { 
            ?topic rdf:type kwg-ont:Topic;
                rdfs:label ?topic_label;
                kwg-ont:hasSuperTopic ?super_topic.
            values ?super_topic {<${super_topic_iri}>}.
        }
    `);
    return a_topics;
}

// query place instances of a chosen place type
async function getPlaceInstance(place_type_iri) {
    let a_places = await query(/* syntax: sparql */ `
        select ?place ?place_label where { 
            ?place rdf:type ?place_type;
                rdfs:label ?place_label.
            values ?place_type {<${place_type_iri}>}.
        }
    `);
    return a_places;
}

// query expert table record
async function getExpertTableRecord(expert_iri_list, expertise_iri_list, place_iri_list) {
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
            filter (?expertise in (${expertise_iri_list.map((expertise) => `<${expertise}>`).join(',')}))
            filter (?affiliation_loc in (${place_iri_list.map((location) => `<${location}>`).join(',')}))
            filter (?expert in (${expert_iri_list.map((expert) => `<${expert}>`).join(',')}))
        } 
    `);
    return a_tablerecord;
}

// query hazard table records
async function getHazardTableRecord(hazard_iri_list, hazard_type_iri_list, place_iri_list, start_year, end_year) {
    let hazard_table_record = [];
    let a_tablerecord = await query(/* syntax: sparql */ `
        select ?hazard ?hazard_name ?hazard_type ?place ?place_name ?date ?date_name
        {
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
            filter (?place in (${place_iri_list.map((place) => `<${place}>`).join(',')}))
            filter (?start_date_label >= ${start_year+'-01-01-0000 EST'})
            filter (?end_date_label <= ${end_year+'-12-31-2400 EST'})
            filter (?hazard_type in (${hazard_type_iri_list.map((hazard_type) => `<${hazard_type}>`).join(',')}))
            filter (?hazard in (${hazard_iri_list.map((hazard) => `<${hazard}>`).join(',')}))
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

// full-text search
// place_iri_list_selected is an Array consisting of places selected by users as facets
// we need to filter those selected places from places acquired from full-text search
async function getFullTextSearchResult(keyword, expertises_iri_selected, place_iri_list_selected, hazards_type_iri_selected, start_year, end_year)
{
    let instance2class_list = {"Place":[],"Expert":[],"Hazard":[]};

    let a_fulltext = await query(/* syntax: sparql */ `
        select ?entity ?type ?label {
            ?search a elastic-index:dr_index_new;
            elastic:query "${keyword}";
            elastic:entities ?entity .
            ?entity rdfs:label ?label;
			        rdf:type ?type.
        }
    `);

    for (let i = 0; i < a_fulltext.length; i++)
    {
        let instance_type = a_fulltext[i].type.value;
        let instance_iri = a_fulltext[i].entity.value;

        for(let [si_prefix, p_prefix_iri] of Object.entries(H_PREFIXES)) {
            instance_type = instance_type.replace(p_prefix_iri,'');
        }

        let isfound_class = false;
        for (let j = 0; j < full_text_config.info.length; j++)
        {
            if (instance_type == full_text_config.info[j].class)
            {
                instance2class_list[full_text_config.info[j].class].push(instance_iri);
                break;
            }
            if (full_text_config.info[j].subclasses)
            {
                for (let k = 0; k < full_text_config.info[j].subclasses.length; k++)
                {
                    if (instance_type  == full_text_config.info[j].subclasses[k])
                    {
                        instance2class_list[full_text_config.info[j].class].push(instance_iri);
                        isfound_class = true;
                        break;
                    }
                }
 
            }
            if (isfound_class)
            {
                break;
            }
        }
    }
    const experts_iri_fulltext = Array.from(new Set(instance2class_list['Expert']));
    const places_iri_fulltext = Array.from(new Set(instance2class_list['Place']));
    const places_iri_filtered = places_iri_fulltext.filter(x => place_iri_list_selected.indexOf(x) != -1); // filter places
    const hazards_iri_fulltext = Array.from(new Set(instance2class_list['Hazard']));

    let search_result = {
        "Place":getPlaceTableRecord(places_iri_filtered),
        "Expert":getExpertTableRecord(experts_iri_fulltext,expertises_iri_selected, places_iri_filtered),
        "Hazard":getHazardTableRecord(hazards_iri_fulltext, hazards_type_iri_selected, places_iri_filtered, start_year, end_year)
    }
    return search_result;
}
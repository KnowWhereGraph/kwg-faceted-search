// query.js contains the javascript codes that query data from KnowWhereGraph.
// Right now the endpoint is set to be KnowWhereGraph-V2 from stko-kwg.

// Prefixes
const H_PREFIXES = {
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    owl: 'http://www.w3.org/2002/07/owl#',
    dc: 'http://purl.org/dc/elements/1.1/',
    dcterms: 'http://purl.org/dc/terms/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    kwgr: 'http://stko-kwg.geog.ucsb.edu/lod/resource/',
    'kwg-ont': 'http://stko-kwg.geog.ucsb.edu/lod/ontology/',
    geo: 'http://www.opengis.net/ont/geosparql#',
    time: 'http://www.w3.org/2006/time#',
    ago: 'http://awesemantic-geo.link/ontology/',
    sosa: 'http://www.w3.org/ns/sosa/',
    elastic: 'http://www.ontotext.com/connectors/elasticsearch#',
    'elastic-index': 'http://www.ontotext.com/connectors/elasticsearch/instance#',
    'iospress': 'http://ld.iospress.nl/rdf/ontology/',
};

let S_PREFIXES = '';
for (let [si_prefix, p_prefix_iri] of Object.entries(H_PREFIXES)) {
    S_PREFIXES += `prefix ${si_prefix}: <${p_prefix_iri}>\n`;
}

// SPARQL endpoint
const P_ENDPOINT = 'http://stko-kwg.geog.ucsb.edu:7200/repositories/KWG-V2';

// query
async function query(srq_query) {
    let d_form = new FormData();
    d_form.append('query', S_PREFIXES + srq_query);

    let d_res = await fetch(P_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        //credentials: 'include',
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

//New search function for place in stko-kwg
async function getPlaceSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let placeQuery = `select ?label ?type ?typeLabel ?entity where {`;

    if(parameters["keyword"]!="") {
        placeQuery +=`
        ?search a elastic-index:kwg_index_v2_updated;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.`;
    }

    if(parameters["placeFacetsRegion"]!="" | parameters["placeFacetsUSCD"]!="" | parameters["placeFacetsNWZ"]!="" | parameters["placeFacetsZip"]!="") {
        let typeQueries = [];

        if(parameters["placeFacetsRegion"]!="") {
            typeQueries.push(`
            {
                ?search a elastic-index:kwg_index_v2_updated;
                elastic:query "${parameters["placeFacetsRegion"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:AdministrativeRegion.
                ?entity rdf:type ?type
                FILTER(?type IN (kwg-ont:AdministrativeRegion_0,kwg-ont:AdministrativeRegion_1,kwg-ont:AdministrativeRegion_2,kwg-ont:AdministrativeRegion_3,kwg-ont:AdministrativeRegion_4)).
                ?entity rdfs:label ?label.
                ?type rdfs:label ?typeLabel
            }`);
        }
        if(parameters["placeFacetsZip"]!="") {
            typeQueries.push(`
            {
                ?search a elastic-index:kwg_index_v2_updated;
                elastic:query "${parameters["placeFacetsZip"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:ZipCodeArea.
                ?entity rdf:type ?type
                FILTER(?type=kwg-ont:ZipCodeArea).
                ?entity rdfs:label ?label.
                ?type rdfs:label ?typeLabel
            }`);
        }
        if(parameters["placeFacetsUSCD"]!="") {
            typeQueries.push(`
            {
                ?search a elastic-index:kwg_index_v2_updated;
                elastic:query "${parameters["placeFacetsUSCD"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:USClimateDivision.
                ?entity rdf:type ?type
                FILTER(?type=kwg-ont:USClimateDivision).
                ?entity rdfs:label ?label
            }`);
        }
        if(parameters["placeFacetsNWZ"]!="") {
            typeQueries.push(`
            {
                ?search a elastic-index:kwg_index_v2_updated;
                elastic:query "${parameters["placeFacetsNWZ"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:NWZone.
                ?entity rdf:type ?type
                FILTER(?type=kwg-ont:NWZone).
                ?entity rdfs:label ?label
            }`);
        }
        placeQuery += typeQueries.join(' union ');
    } else {
        placeQuery +=
        `
        {
            ?entity a kwg-ont:AdministrativeRegion.
            ?entity rdf:type ?type
            FILTER(?type IN (kwg-ont:AdministrativeRegion_0,kwg-ont:AdministrativeRegion_1,kwg-ont:AdministrativeRegion_2,kwg-ont:AdministrativeRegion_3,kwg-ont:AdministrativeRegion_4)).
            ?entity rdfs:label ?label.
            ?type rdfs:label ?typeLabel
        }
        union
        {
            ?entity a kwg-ont:ZipCodeArea.
            ?entity rdf:type ?type
            FILTER(?type=kwg-ont:ZipCodeArea).
            ?entity rdfs:label ?label.
            ?type rdfs:label ?typeLabel
        }
        union
        {
            ?entity a kwg-ont:USClimateDivision.
            ?entity rdf:type ?type
            FILTER(?type=kwg-ont:USClimateDivision).
            ?entity rdfs:label ?label
        }
        union
        {
            ?entity a kwg-ont:NWZone.
            ?entity rdf:type ?type
            FILTER(?type=kwg-ont:NWZone).
            ?entity rdfs:label ?label
        }`;
    }

    placeQuery += `} ORDER BY ASC(?label)`;

    let queryResults = await query(placeQuery + ` LIMIT` + recordNum + ` OFFSET ` + (pageNum-1)*recordNum);
    for (let row of queryResults) {
        let placeLabel = (typeof row.typeLabel  === 'undefined') ? row.type.value : row.typeLabel.value;
        formattedResults.push({
            'place':row.entity.value,
            'place_name':row.label.value,
            'place_type':row.type.value,
            'place_type_name':placeLabel,
            //'place_geometry':(typeof row.place_geometry  === 'undefined') ? '' : row.place_geometry.value,
            //'place_geometry_wkt':(typeof row.place_geometry_wkt  === 'undefined') ? '' : row.place_geometry_wkt.value
        });
    }

    let countResults = await query(`select (count(*) as ?count) { ` + placeQuery + `}`);
    return {'count':countResults[0].count.value,'record':formattedResults};
}

//New search function for hazard in stko-kwg
async function getHazardSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let hazardQuery = `select ?label ?type ?typeLabel ?entity ?place ?placeLabel ?time ?timeLabel where {`;
    if(parameters["keyword"]!="") {
        hazardQuery +=
        `
        ?search a elastic-index:kwg_index_v2_updated;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        `;
    }

    let typeQuery = '';
    if(parameters["hazardTypes"].length > 0) {
        typeQuery = ` FILTER(?type IN (kwg-ont:` + parameters["hazardTypes"].join(',kwg-ont:') + `))`;
    }

    let dateQuery = '';
    if(parameters["hazardFacetDateStart"]!="" || parameters["hazardFacetDateEnd"]!="") {
        letDateArr = [];
        if(parameters["hazardFacetDateStart"]!="")
            letDateArr.push(`?timeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime`);
        if(parameters["hazardFacetDateEnd"]!="")
            letDateArr.push(`"` + parameters["hazardFacetDateEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?timeLabel`);
        dateQuery = ` FILTER (` + letDateArr.join(' && ') + `)`;
    }

    let placeQuery = '';
    if(parameters["hazardFacetPlace"]!="") {
        placeQuery = `
            ?search a elastic-index:kwg_index_v2_updated;
            elastic:query "${parameters["hazardFacetPlace"]}";
            elastic:entities ?place.`
    }

    hazardQuery += `
        {
            ?entity rdf:type ?type${typeQuery}.
            ?type rdfs:subClassOf kwg-ont:HazardEvent.
            ?entity rdfs:label ?label.
            {
                ${placeQuery}
                
                ?entity kwg-ont:locatedIn ?place.
                ?place rdfs:label ?placeLabel.
            }
            ?entity sosa:phenomenonTime ?time.
            ?time time:inXSDDate ?timeLabel${dateQuery}
        }
        union
        {
            ?entity rdf:type ?type${typeQuery}.
            ?type rdfs:subClassOf kwg-ont:Fire.
            ?entity rdfs:label ?label.
            {
                ${placeQuery}
                
                ?entity kwg-ont:locatedIn ?place.
                ?place rdfs:label ?placeLabel.
            }
            ?entity sosa:isFeatureOfInterestOf ?observationCollection.
            ?observationCollection sosa:phenomenonTime ?time.
            ?time time:inXSDDate ?timeLabel${dateQuery}
        }
    } ORDER BY ASC(?label)`;

    let queryResults = await query(hazardQuery + ` LIMIT` + recordNum + ` OFFSET ` + (pageNum-1)*recordNum);
    for (let row of queryResults) {
        let hazardLabelArray = row.type.value.split("/");
        formattedResults.push({
            'hazard':row.entity.value,
            'hazard_name':row.label.value,
            'hazard_type':row.type.value,
            'hazard_type_name':hazardLabelArray[hazardLabelArray.length - 1],
            'place':row.place.value,
            'place_name':row.placeLabel.value,
            //'place_geometry':(typeof row.place_geometry  === 'undefined') ? '' : row.place_geometry.value,
            //'place_geometry_wkt':(typeof row.place_geometry_wkt  === 'undefined') ? '' : row.place_geometry_wkt.value,
            'date':row.time.value,
            'date_name':row.timeLabel.value,
        });
    }

    let countResults = await query(`select (count(*) as ?count) { ` + hazardQuery + `}`);
    return {'count':countResults[0].count.value,'record':formattedResults};
}

async function getHazardClasses() {
    let formattedResults = [];
    let fireResults = [];

    let hazardQuery = `
    select distinct ?type where {
        ?entity rdf:type ?type.
        ?type rdfs:subClassOf kwg-ont:HazardEvent.
    } ORDER BY ASC(?label)`;

    //Special case for fires
    let fireQuery = `
    select distinct ?type where {
        ?entity rdf:type ?type.
        ?type rdfs:subClassOf kwg-ont:Fire.
    } ORDER BY ASC(?label)`;

    let queryResults = await query(hazardQuery);
    for (let row of queryResults) {
        let hazardLabelArray = row.type.value.split("/");
        formattedResults.push({
            'hazard_type':row.type.value,
            'hazard_type_name':hazardLabelArray[hazardLabelArray.length - 1]
        });
    }

    let queryResultsFire = await query(fireQuery);
    for (let row of queryResultsFire) {
        let hazardLabelArray = row.type.value.split("/");
        fireResults.push({
            'hazard_type':row.type.value,
            'hazard_type_name':hazardLabelArray[hazardLabelArray.length - 1]
        });
    }

    return {'hazards':formattedResults, 'fires':fireResults};
}

//New search function for expert in stko-kwg
async function getExpertSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = {};

    let topicQuery = '';
    if(parameters["expertTopics"].length > 0) {
        topicQuery = ` FILTER(?expert IN (kwgr:` + parameters["expertTopics"].join(',kwgr:') + `))`;
    }

    let placeQuery = `select distinct ?label ?entity ?expert ?expertLabel ?affiliation ?affiliationLabel where {`;
    if(parameters["keyword"]!="") {
        placeQuery +=
            `
        ?search a elastic-index:kwg_index_v2_updated;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        `;
    }

    placeQuery +=
        `
        ?entity rdf:type iospress:Contributor.
        ?entity rdfs:label ?label.
        ?entity kwg-ont:hasExpertise ?expert${topicQuery}.
        ?expert rdfs:label ?expertLabel.
        ?entity iospress:contributorAffiliation ?affiliation.
        ?affiliation rdfs:label ?affiliationLabel
    } ORDER BY ASC(?label)`;

    let queryResults = await query(placeQuery + ` LIMIT` + recordNum + ` OFFSET ` + (pageNum-1)*recordNum);
    for (let row of queryResults) {
        if(row.entity.value in formattedResults) {
            //We already have this user, which means we need to grab their expertise
            formattedResults[row.entity.value]['expertise'].push(row.expert.value);
            formattedResults[row.entity.value]['expertise_name'].push(row.expertLabel.value);
        } else {
            //New user, so add them
            formattedResults[row.entity.value] = {
                'expert': row.entity.value,
                'expert_name': row.label.value,
                'affiliation': row.affiliation.value,
                'affiliation_name': row.affiliationLabel.value,
                'expertise': [row.expert.value],
                'expertise_name': [row.expertLabel.value],
                'place': "Insert Place Here",
                'place_name': "Insert Place Here",
                // 'place_geometry':(typeof row.place_geometry  === 'undefined') ? '' : row.place_geometry.value,
                // 'place_geometry_wkt':(typeof row.place_geometry_wkt  === 'undefined') ? '' : row.place_geometry_wkt.value,
                // 'webpage':row.webpage.value
            };
        }
    }

    let countResults = await query(`select (count(*) as ?count) { ` + placeQuery + `}`);
    return {'count':countResults[0].count.value,'record':Object.values(formattedResults)};
}

async function getExpertTopics() {
    let formattedResults = [];

    let hazardQuery = `
    select distinct ?topic ?label ?subtopic ?sublabel where {
        ?topic rdfs:subClassOf kwg-ont:ExpertiseTopic.
        ?topic rdfs:label ?label.
        ?subtopic rdf:type ?topic.
        ?subtopic rdfs:label ?sublabel.
    } ORDER BY ASC(?label)`;

    let queryResults = await query(hazardQuery);
    for (let row of queryResults) {
        let topicShortArray = row.topic.value.split("/");
        let topicShort = topicShortArray[topicShortArray.length - 1];
        let subTopicShortArray = row.subtopic.value.split("/");
        let subTopicShort = subTopicShortArray[subTopicShortArray.length - 1];
        if(topicShort in formattedResults) {
            //We already have this user, which means we need to grab their expertise
            formattedResults[topicShort]['expert_subtopic'].push(subTopicShort);
            formattedResults[topicShort]['expert_sublabel'].push(row.sublabel.value);
        } else {
            //New user, so add them
            formattedResults[topicShort] = {
                'expert_topic': topicShort,
                'expert_label': row.label.value,
                'expert_subtopic': [subTopicShort],
                'expert_sublabel': [row.sublabel.value],
            };
        }
    }

    return {'topics':Object.values(formattedResults)};
}
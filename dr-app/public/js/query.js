// query.js contains the javascript codes that query data from KnowWhereGraph.
// Right now the endpoint is set to be KWG-V2 from stko-kwg.

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

async function getAdministrativeRegion() {
    let formattedResults = {};

    let regionQuery = `
    select ?a3 ?a3Label ?a2 ?a2Label ?a1 ?a1Label ?a0 ?a0Label where {
        ?a3 rdf:type kwg-ont:AdministrativeRegion_3 .
        ?a3 kwg-ont:locatedIn ?a2 .
        ?a2 kwg-ont:locatedIn ?a1 .
        ?a1 kwg-ont:locatedIn ?a0 .
        ?a3 rdfs:label ?a3Label .
        ?a2 rdfs:label ?a2Label .
        ?a1 rdfs:label ?a1Label .
        ?a0 rdfs:label ?a0Label .
    }`;

    let queryResults = await query(regionQuery);
    for (let row of queryResults) {
        let a0Array = row.a0.value.split("/");
        let a0 = a0Array[a0Array.length - 1];
        let a0Label = row.a0Label.value;

        if(!(a0 in formattedResults))
            formattedResults[a0] = {'label': a0Label, 'sub_admin_regions': {}}

        let a1Array = row.a1.value.split("/");
        let a1 = a1Array[a1Array.length - 1];
        let a1Label = row.a1Label.value;

        if(!(a1 in formattedResults[a0]["sub_admin_regions"]))
            formattedResults[a0]["sub_admin_regions"][a1] = {'label': a1Label, 'sub_admin_regions': {}};

        let a2Array = row.a2.value.split("/");
        let a2 = a2Array[a2Array.length - 1];
        let a2Label = row.a2Label.value;

        if(!(a2 in formattedResults[a0]["sub_admin_regions"][a1]["sub_admin_regions"]))
            formattedResults[a0]["sub_admin_regions"][a1]["sub_admin_regions"][a2] = {'label': a2Label, 'sub_admin_regions': {}};

        let a3Array = row.a3.value.split("/");
        let a3 = a3Array[a3Array.length - 1];
        let a3Label = row.a3Label.value;

        formattedResults[a0]["sub_admin_regions"][a1]["sub_admin_regions"][a2]["sub_admin_regions"][a3]  = {'label': a3Label};
    }

    return {'regions':formattedResults};
}

//New search function for place in stko-kwg
async function getPlaceSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let placeQuery = `select ?label ?type ?typeLabel ?entity ?wkt where {`;

    if(parameters["keyword"]!="") {
        placeQuery +=`
        ?search a elastic-index:kwg_index_v2;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.`;
    }

    if(parameters["placeFacetsRegion"]!="" | parameters["placeFacetsUSCD"]!="" | parameters["placeFacetsNWZ"]!="" | parameters["placeFacetsZip"]!="") {
        let typeQueries = [];

        if(parameters["placeFacetsRegion"]!="") {
            typeQueries.push(`
            {
                ?search a elastic-index:kwg_index_v2;
                elastic:query "${parameters["placeFacetsRegion"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:AdministrativeRegion.
                ?entity rdf:type ?type
                FILTER(?type IN (kwg-ont:AdministrativeRegion_0,kwg-ont:AdministrativeRegion_1,kwg-ont:AdministrativeRegion_2,kwg-ont:AdministrativeRegion_3,kwg-ont:AdministrativeRegion_4)).
                ?entity rdfs:label ?label.
                ?type rdfs:label ?typeLabel.
                ?entity geo:hasGeometry/geo:asWKT ?wkt.
            }`);
        }
        if(parameters["placeFacetsZip"]!="") {
            typeQueries.push(`
            {
                ?search a elastic-index:kwg_index_v2;
                elastic:query "${parameters["placeFacetsZip"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:ZipCodeArea.
                ?entity rdf:type ?type
                FILTER(?type=kwg-ont:ZipCodeArea).
                ?entity rdfs:label ?label.
                ?type rdfs:label ?typeLabel.
                ?entity geo:hasGeometry/geo:asWKT ?wkt.
            }`);
        }
        if(parameters["placeFacetsUSCD"]!="") {
            typeQueries.push(`
            {
                ?search a elastic-index:kwg_index_v2;
                elastic:query "${parameters["placeFacetsUSCD"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:USClimateDivision.
                ?entity rdf:type ?type
                FILTER(?type=kwg-ont:USClimateDivision).
                ?entity rdfs:label ?label.
                ?entity geo:hasGeometry/geo:asWKT ?wkt.
            }`);
        }
        if(parameters["placeFacetsNWZ"]!="") {
            typeQueries.push(`
            {
                ?search a elastic-index:kwg_index_v2;
                elastic:query "${parameters["placeFacetsNWZ"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:NWZone.
                ?entity rdf:type ?type
                FILTER(?type=kwg-ont:NWZone).
                ?entity rdfs:label ?label.
                ?entity geo:hasGeometry/geo:asWKT ?wkt.
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
            ?type rdfs:label ?typeLabel.
            ?entity geo:hasGeometry/geo:asWKT ?wkt.
        }
        union
        {
            ?entity a kwg-ont:ZipCodeArea.
            ?entity rdf:type ?type
            FILTER(?type=kwg-ont:ZipCodeArea).
            ?entity rdfs:label ?label.
            ?type rdfs:label ?typeLabel.
            ?entity geo:hasGeometry/geo:asWKT ?wkt.
        }
        union
        {
            ?entity a kwg-ont:USClimateDivision.
            ?entity rdf:type ?type
            FILTER(?type=kwg-ont:USClimateDivision).
            ?entity rdfs:label ?label.
            ?entity geo:hasGeometry/geo:asWKT ?wkt.
        }
        union
        {
            ?entity a kwg-ont:NWZone.
            ?entity rdf:type ?type
            FILTER(?type=kwg-ont:NWZone).
            ?entity rdfs:label ?label.
            ?entity geo:hasGeometry/geo:asWKT ?wkt.
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
            'wkt':row.wkt.value,
        });
    }

    let countResults = await query(`select (count(*) as ?count) { ` + placeQuery + `}`);
    return {'count':countResults[0].count.value,'record':formattedResults};
}

//New search function for hazard in stko-kwg
async function getHazardSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let hazardQuery = `select distinct ?label ?type ?entity ?place ?placeLabel ?startTime ?startTimeLabel ?endTime ?endTimeLabel ?wkt where {`;
    if(parameters["keyword"]!="") {
        hazardQuery +=
        `
        ?search a elastic-index:kwg_index_v2;
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
        let dateArr = [];
        if(parameters["hazardFacetDateStart"]!="")
        {
            dateArr.push(`?startTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime`);
            dateArr.push(`?endTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime`);
        }
        if(parameters["hazardFacetDateEnd"]!="")
        {
            dateArr.push(`"` + parameters["hazardFacetDateEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?startTimeLabel`);
            dateArr.push(`"` + parameters["hazardFacetDateEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?endTimeLabel`);
        }
        dateQuery = ` FILTER (` + dateArr.join(' && ') + `)`;
    }

    let placeQuery = '';
    if(parameters["hazardFacetPlace"]!="") {
        placeQuery = ` FILTER(contains(?placeLabel, '${parameters["hazardFacetPlace"]}'))`;
    }

    let magnitudeQuery = '';
    if(parameters["hazardFacetMagnitudeMin"]!="" || parameters["hazardFacetMagnitudeMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetMagnitudeMin"]!="")
            facetArr.push(`xsd:decimal(STR(?magnitude)) > ` + parameters["hazardFacetMagnitudeMin"]);
        if(parameters["hazardFacetMagnitudeMax"]!="")
            facetArr.push(parameters["hazardFacetMagnitudeMax"] + ` > xsd:decimal(STR(?magnitude))`);
        magnitudeQuery = ` FILTER (` + facetArr.join(' && ') + `)`;
    }

    let quakeDepthQuery = '';
    if(parameters["hazardQuakeDepthMin"]!="" || parameters["hazardQuakeDepthMax"]!="") {
        let facetArr = [];
        if(parameters["hazardQuakeDepthMin"]!="")
            facetArr.push(`xsd:decimal(STR(?quakeDepth)) > ` + parameters["hazardQuakeDepthMin"]);
        if(parameters["hazardQuakeDepthMax"]!="")
            facetArr.push(parameters["hazardQuakeDepthMax"] + ` > xsd:decimal(STR(?quakeDepth))`);
        quakeDepthQuery = ` FILTER (` + facetArr.join(' && ') + `)`;
    }

    let acresBurnedQuery = '';
    if(parameters["hazardFacetAcresBurnedMin"]!="" || parameters["hazardFacetAcresBurnedMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetAcresBurnedMin"]!="")
            facetArr.push(`?numAcresBurned > ` + parameters["hazardFacetAcresBurnedMin"]);
        if(parameters["hazardFacetAcresBurnedMax"]!="")
            facetArr.push(parameters["hazardFacetAcresBurnedMax"] + ` > ?numAcresBurned`);
        acresBurnedQuery = ` FILTER (` + facetArr.join(' && ') + `)`;
    }

    let meanDnbrQuery = '';
    if(parameters["hazardFacetMeanDnbrMin"]!="" || parameters["hazardFacetMeanDnbrMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetMeanDnbrMin"]!="")
            facetArr.push(`?meanVal > ` + parameters["hazardFacetMeanDnbrMin"]);
        if(parameters["hazardFacetMeanDnbrMax"]!="")
            facetArr.push(parameters["hazardFacetMeanDnbrMax"] + ` > ?meanVal`);
        meanDnbrQuery = ` FILTER (` + facetArr.join(' && ') + `)`;
    }

    let SDMeanDnbrQuery = '';
    if(parameters["hazardFacetSDMeanDnbrMin"]!="" || parameters["hazardFacetSDMeanDnbrMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetSDMeanDnbrMin"]!="")
            facetArr.push(`?stanDevMeanVal > ` + parameters["hazardFacetSDMeanDnbrMin"]);
        if(parameters["hazardFacetSDMeanDnbrMax"]!="")
            facetArr.push(parameters["hazardFacetSDMeanDnbrMax"] + ` > ?stanDevMeanVal`);
        SDMeanDnbrQuery = ` FILTER (` + facetArr.join(' && ') + `)`;
    }

    hazardQuery += `
        {
            ?entity rdf:type ?type${typeQuery}.
            ?type rdfs:subClassOf kwg-ont:HazardEvent.
            ?entity rdfs:label ?label.
            ?entity kwg-ont:locatedIn ?place.
            ?place rdfs:label ?placeLabel${placeQuery}.
            ?entity sosa:phenomenonTime ?startTime.
            ?entity sosa:phenomenonTime ?endTime.
            ?startTime time:inXSDDate ?startTimeLabel.
            ?endTime time:inXSDDate ?endTimeLabel.${dateQuery}
            ?entity sosa:isFeatureOfInterestOf ?observationCollection.
            ?entity geo:hasGeometry/geo:asWKT ?wkt_raw.
        	BIND(REPLACE(?wkt_raw, "<http://www.opengis.net/def/crs/OGC/1.3/CRS84>", "", "i") AS ?wkt)
        
            ?observationCollection sosa:hasMember ?magnitudeObj.
            ?magnitudeObj sosa:observedProperty kwgr:earthquakeObservableProperty.mag.
            ?magnitudeObj sosa:hasSimpleResult ?magnitude${magnitudeQuery}.
            
            ?observationCollection sosa:hasMember ?quakeDepthObj.
            ?quakeDepthObj sosa:observedProperty kwgr:earthquakeObservableProperty.depth.
            ?quakeDepthObj sosa:hasSimpleResult ?quakeDepth${quakeDepthQuery}.
        }
        union
        {
            ?entity rdf:type ?type${typeQuery}.
            ?type rdfs:subClassOf kwg-ont:Fire.
            ?entity rdfs:label ?label.
            ?entity kwg-ont:locatedIn ?place.
            ?place rdfs:label ?placeLabel${placeQuery}.
            ?entity sosa:isFeatureOfInterestOf ?observationCollection.
            ?observationCollection sosa:phenomenonTime ?startTime.
            ?observationCollection sosa:phenomenonTime ?endTime.
            ?startTime time:inXSDDate ?startTimeLabel.
            ?endTime time:inXSDDate ?endTimeLabel.${dateQuery}
            ?entity geo:hasGeometry/geo:asWKT ?wkt.
            
            ?observationCollection sosa:hasMember ?numAcresBurnedObj.
            ?numAcresBurnedObj rdfs:label ?numAcresBurnedObjLabel
            FILTER(contains(?numAcresBurnedObjLabel, 'Observation of Number Of Acres Burned')).
            ?numAcresBurnedObj sosa:hasSimpleResult ?numAcresBurned${acresBurnedQuery}.
        
            ?observationCollection sosa:hasMember ?meanValObj.
            ?meanValObj rdfs:label ?meanValObjLabel
            FILTER(contains(?meanValObjLabel, 'Observation of Mean dNBR Value')).
            ?meanValObj sosa:hasSimpleResult ?meanVal${meanDnbrQuery}.
            
            ?observationCollection sosa:hasMember ?stanDevMeanValObj.
            ?stanDevMeanValObj rdfs:label ?stanDevMeanValObjLabel
            FILTER(contains(?stanDevMeanValObjLabel, 'Observation of Standard Deviation of Mean dNBR Value')).
            ?stanDevMeanValObj sosa:hasSimpleResult ?stanDevMeanVal${SDMeanDnbrQuery}.
        }
        union
        {
            ?entity rdf:type ?type${typeQuery}.
            ?type kwg-ont:fallsUnderTopic kwg-ont:Topic.hurricane.
            ?entity rdfs:label ?label.
            ?entity kwg-ont:locatedIn ?place.
            optional
            {
                ?place rdfs:label ?placeLabel.
            }
            ${placeQuery}
            ?entity kwg-ont:hasImpact ?observationCollection.
            ?observationCollection sosa:phenomenonTime ?time.
            ?time time:hasBeginning ?startTime.
            ?time time:hasEnd ?endTime.
            ?startTime time:inXSDDateTime ?startTimeLabel.
            ?endTime time:inXSDDateTime ?endTimeLabel.${dateQuery}
            optional
            {
                ?entity geo:hasGeometry/geo:asWKT ?wkt.
            }
            
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
            'place_name':(typeof row.placeLabel  === 'undefined') ? '' : row.placeLabel.value,
            'start_date':row.startTime.value,
            'start_date_name':row.startTimeLabel.value,
            'end_date':row.endTime.value,
            'end_date_name':row.endTimeLabel.value,
            'wkt':(typeof row.wkt  === 'undefined') ? '' : row.wkt.value,
        });
    }

    let countResults = await query(`select (count(*) as ?count) { ` + hazardQuery + `}`);
    return {'count':countResults[0].count.value,'record':formattedResults};
}

async function getHazardClasses() {
    let formattedResults = [];
    let fireResults = [];
    let hurricaneResults = [];

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

    //Special case for hurricanes
    let hurricaneQuery = `
    select distinct ?type where {
        ?entity rdf:type ?type.
        ?type kwg-ont:fallsUnderTopic kwg-ont:Topic.hurricane.
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

    let queryResultsHurricane = await query(hurricaneQuery);
    for (let row of queryResultsHurricane) {
        let hazardLabelArray = row.type.value.split("/");
        hurricaneResults.push({
            'hazard_type':row.type.value,
            'hazard_type_name':hazardLabelArray[hazardLabelArray.length - 1]
        });
    }

    return {'hazards':formattedResults, 'fires':fireResults, 'hurricanes':hurricaneResults};
}

//New search function for expert in stko-kwg
async function getExpertSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let topicQuery = '';
    if(parameters["expertTopics"].length > 0) {
        topicQuery = ` FILTER(?expert IN (kwgr:` + parameters["expertTopics"].join(',kwgr:') + `))`;
    }

    let expertQuery = `select distinct ?label ?entity ?affiliation ?affiliationLabel ?wkt
    (group_concat(distinct ?expert; separator = "||") as ?expertise)
    (group_concat(distinct ?expertLabel; separator = "||") as ?expertiseLabel)
    where {`;

    if(parameters["keyword"]!="") {
        expertQuery +=
            `
        ?search a elastic-index:kwg_index_v2;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        `;
    }

    expertQuery +=
        `
        ?entity rdf:type iospress:Contributor.
        ?entity rdfs:label ?label.
        ?entity kwg-ont:hasExpertise ?expert${topicQuery}.
        ?expert rdfs:label ?expertLabel.
        ?entity iospress:contributorAffiliation ?affiliation.
        ?affiliation rdfs:label ?affiliationLabel.
        ?affiliation geo:hasGeometry/geo:asWKT ?wkt.
    } GROUP BY ?label ?entity ?affiliation ?affiliationLabel ?wkt ORDER BY ASC(?label)`;

    let queryResults = await query(expertQuery + ` LIMIT` + recordNum + ` OFFSET ` + (pageNum-1)*recordNum);
    for (let row of queryResults) {
        formattedResults.push({
            'expert': row.entity.value,
            'expert_name': row.label.value,
            'affiliation': row.affiliation.value,
            'affiliation_name': row.affiliationLabel.value,
            'expertise': row.expertise.value.split('||'),
            'expertise_name': row.expertiseLabel.value.split('||'),
            'place': "Insert Place Here",
            'place_name': "Insert Place Here",
            'wkt':row.wkt.value,
        });
    }

    let countResults = await query(`select (count(*) as ?count) { ` + expertQuery + `}`);
    return {'count':countResults[0].count.value,'record':formattedResults};
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
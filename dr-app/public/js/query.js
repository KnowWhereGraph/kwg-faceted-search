// query.js contains the javascript codes that query data from KnowWhereGraph.

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
const P_ENDPOINT = 'http://stko-kwg.geog.ucsb.edu/sparql';

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
    select ?a3 ?a3Label ?a2 ?a2Label ?a1 ?a1Label where {
        ?a3 rdf:type kwg-ont:AdministrativeRegion_3 .
        ?a3 kwg-ont:locatedIn ?a2 .
        ?a2 kwg-ont:locatedIn ?a1.
        values ?a1 {kwgr:Earth.North_America.United_States.USA}
        ?a3 rdfs:label ?a3Label .
        ?a2 rdfs:label ?a2Label .
        ?a1 rdfs:label ?a1Label .
    } ORDER BY ?a1Label ?a2Label ?a3Label`;

    let queryResults = await query(regionQuery);
    for (let row of queryResults) {
        let a1Array = row.a1.value.split("/");
        let a1 = a1Array[a1Array.length - 1];
        let a1Label = row.a1Label.value;

        if(!(a1 in formattedResults))
            formattedResults[a1] = {'label': a1Label, 'sub_admin_regions': {}}

        let a2Array = row.a2.value.split("/");
        let a2 = a2Array[a2Array.length - 1];
        let a2Label = row.a2Label.value;

        if(!(a2 in formattedResults[a1]["sub_admin_regions"]))
            formattedResults[a1]["sub_admin_regions"][a2] = {'label': a2Label, 'sub_admin_regions': {}};

        let a3Array = row.a3.value.split("/");
        let a3 = a3Array[a3Array.length - 1];
        let a3Label = row.a3Label.value;

        formattedResults[a1]["sub_admin_regions"][a2]["sub_admin_regions"][a3]  = {'label': a3Label};
    }

    return {'regions':formattedResults};
}

async function getZipCodeArea() {
    let formattedResults = [];

    let zipcodeQuery = `
    select distinct ?zipcode ?zipcodeArea where {
        ?zipcodeArea rdf:type kwg-ont:ZipCodeArea;
                     kwg-ont:hasZipCode ?zipcode.
    } ORDER BY ASC(?zipcode)`;

    let queryResults = await query(zipcodeQuery);
    for (let row of queryResults) {
        let zipcode = row.zipcode.value;
        let zipcodeArea = row.zipcodeArea.value;
        formattedResults[zipcode] = zipcodeArea;
    }

    return {'zipcodes':formattedResults};
}

async function getUSClimateDivision() {
    let formattedResults = [];

    let divisionQuery = `
    select distinct ?division ?divison_label where {
        ?division rdf:type kwg-ont:USClimateDivision;
                  rdfs:label ?divison_label.
    } ORDER BY ASC(?divison_label)`;

    let queryResults = await query(divisionQuery);
    for (let row of queryResults) {
        let division = row.division.value;
        let divison_label = row.divison_label.value;
        formattedResults[divison_label] = division;
    }

    return {'divisions':formattedResults};
}


async function getNWZone() {
    let formattedResults = [];

    let nwzoneQuery = `
    select distinct ?nwzone ?nwzone_label where {
        ?nwzone rdf:type kwg-ont:NWZone;
                rdfs:label ?nwzone_label.
    } ORDER BY ASC(?nwzone_label)`;

    let queryResults = await query(nwzoneQuery);
    for (let row of queryResults) {
        let nwzone = row.nwzone.value;
        let nwzone_label = row.nwzone_label.value;
        formattedResults[nwzone_label] = nwzone;
    }

    return {'nwzones':formattedResults};
}

//New search function for place in stko-kwg
async function getPlaceSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let placeQuery = `select ?label ?type ?typeLabel ?entity ?wkt where {`;

    if(parameters["keyword"]!="") {
        placeQuery +=`
        ?search a elastic-index:kwg_es_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.`;
    }

    if(parameters["placeFacetsRegion"]!="" | parameters["placeFacetsUSCD"]!="" | parameters["placeFacetsNWZ"]!="" | parameters["placeFacetsZip"]!="") {
        let typeQueries = [];

        if(parameters["placeFacetsRegion"]!="") {
            typeQueries.push(`
            {
                ?search a elastic-index:kwg_es_index;
                elastic:query "${parameters["placeFacetsRegion"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:AdministrativeRegion_2; rdf:type ?type; rdfs:label ?label; geo:hasGeometry/geo:asWKT ?wkt.
                ?entity kwg-ont:locatedIn kwgr:Earth.North_America.United_States.USA.
                ?type rdfs:label ?typeLabel
            }
            union
            {
                ?search a elastic-index:kwg_es_index;
                elastic:query "${parameters["placeFacetsRegion"]}";
                elastic:entities ?entity.
                
                ?entity a kwg-ont:AdministrativeRegion_3; rdf:type ?type; rdfs:label ?label; geo:hasGeometry/geo:asWKT ?wkt.
                ?entity kwg-ont:locatedIn ?a2.
                ?a2 kwg-ont:locatedIn kwgr:Earth.North_America.United_States.USA.
                ?type rdfs:label ?typeLabel
            }`);
        }
        if(parameters["placeFacetsZip"]!="") {
            entityAll = await getZipCodeArea();
            entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
            entity = entityArray[entityArray.length - 1];
            typeQueries.push(`
            {
                ?entity rdf:type ?type; kwg-ont:hasZipCode ?label; geo:hasGeometry/geo:asWKT ?wkt.
                values ?entity {kwgr:` + entity + `}
                ?type rdfs:label ?typeLabel
            }`);
        }
        if(parameters["placeFacetsUSCD"]!="") {
            entityAll = await getUSClimateDivision();
            entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
            entity = entityArray[entityArray.length - 1];
            typeQueries.push(`
            {
                ?entity rdf:type ?type; rdfs:label ?label; geo:hasGeometry/geo:asWKT ?wkt.
                values ?entity {kwgr:` + entity + `}
                values ?type {kwg-ont:USClimateDivision}
                ?type rdfs:label ?typeLabel
            }`);
        }
        if(parameters["placeFacetsNWZ"]!="") {
            entityAll = await getNWZone();
            entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
            entity = entityArray[entityArray.length - 1];
            typeQueries.push(`
            {
                ?entity rdf:type ?type; rdfs:label ?label; geo:hasGeometry/geo:asWKT ?wkt.
                values ?entity {kwgr:` + entity + `}
                values ?type {kwg-ont:NWZone}
            }`);
        }
        placeQuery += typeQueries.join(' union ');
    } else {
        placeQuery += `
        {
            ?entity a kwg-ont:AdministrativeRegion_2; rdf:type ?type; rdfs:label ?label; geo:hasGeometry/geo:asWKT ?wkt.
            ?entity kwg-ont:locatedIn kwgr:Earth.North_America.United_States.USA.
            ?type rdfs:label ?typeLabel
        }
        union
        {
            ?entity a kwg-ont:AdministrativeRegion_3; rdf:type ?type; rdfs:label ?label; geo:hasGeometry/geo:asWKT ?wkt.
            ?entity kwg-ont:locatedIn ?a2.
            ?a2 kwg-ont:locatedIn kwgr:Earth.North_America.United_States.USA.
            ?type rdfs:label ?typeLabel
        }
        union
        {
            ?entity a kwg-ont:ZipCodeArea; rdf:type ?type; kwg-ont:hasZipCode ?label; geo:hasGeometry/geo:asWKT ?wkt.
            ?type rdfs:label ?typeLabel
        }
        union
        {
            ?entity rdf:type ?type; rdfs:label ?label; geo:hasGeometry/geo:asWKT ?wkt.
            values ?type {kwg-ont:USClimateDivision}
            ?type rdfs:label ?typeLabel
        }
        union
        {
            ?entity rdf:type ?type; rdfs:label ?label; geo:hasGeometry/geo:asWKT ?wkt.
            values ?type {kwg-ont:NWZone}
        }`;
    }

    placeQuery += `}`;

    let queryResults = await query(placeQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum-1)*recordNum);
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
        ?search a elastic-index:kwg_es_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        `;
    }

    let typeQuery = '';
    let fireTypeQuery = ` FILTER(?type != kwg-ont:Fire)`;
    let hurricaneTypeQuery = ` FILTER(?type = kwg-ont:Hurricane)`;
    if(parameters["hazardTypes"].length > 0) {
        typeQuery = fireTypeQuery = hurricaneTypeQuery = `values ?type {kwg-ont:` + parameters["hazardTypes"].join(' kwg-ont:') + `}`;
    }

    let regionTestQuery = hurricaneRegionQuery = '';
    if(parameters["facetRegions"].length > 0) {
        regionTestQuery = `
        { 
             select distinct ?entity where {
                 ?entity geo:sfOverlaps|geo:sfWithin ?hazardCell .
                 ?hazardCell rdf:type kwg-ont:KWGCellLevel13 .
                 values ?region {kwgr:` + parameters["facetRegions"].join(' kwgr:') + `}
                 ?hazardCell geo:sfWithin* ?region .
             }
         }`;
        hurricaneRegionQuery = `
        { 
             select distinct ?entity where {
                 ?entity kwg-ont:locatedIn ?hazardZone .
                 ?hazardZone geo:sfConatins ?hazardCell .
                 ?hazardCell rdf:type kwg-ont:KWGCellLevel13 .
                 values ?region {kwgr:` + parameters["facetRegions"].join(' kwgr:') + `}
                 ?hazardCell geo:sfWithin* ?region .
             }
         }`;
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

    let magnitudeQuery = '';
    if(parameters["hazardFacetMagnitudeMin"]!="" || parameters["hazardFacetMagnitudeMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetMagnitudeMin"]!="")
            facetArr.push(`xsd:decimal(STR(?magnitude)) > ` + parameters["hazardFacetMagnitudeMin"]);
        if(parameters["hazardFacetMagnitudeMax"]!="")
            facetArr.push(parameters["hazardFacetMagnitudeMax"] + ` > xsd:decimal(STR(?magnitude))`);
        magnitudeQuery = `
            ?observationCollection sosa:hasMember ?magnitudeObj.
            ?magnitudeObj sosa:observedProperty kwgr:earthquakeObservableProperty.mag.
            ?magnitudeObj sosa:hasSimpleResult ?magnitude FILTER (` + facetArr.join(' && ') + `).`;
    }

    let quakeDepthQuery = '';
    if(parameters["hazardQuakeDepthMin"]!="" || parameters["hazardQuakeDepthMax"]!="") {
        let facetArr = [];
        if(parameters["hazardQuakeDepthMin"]!="")
            facetArr.push(`xsd:decimal(STR(?quakeDepth)) > ` + parameters["hazardQuakeDepthMin"]);
        if(parameters["hazardQuakeDepthMax"]!="")
            facetArr.push(parameters["hazardQuakeDepthMax"] + ` > xsd:decimal(STR(?quakeDepth))`);
        quakeDepthQuery = `
            ?observationCollection sosa:hasMember ?quakeDepthObj.
            ?quakeDepthObj sosa:observedProperty kwgr:earthquakeObservableProperty.depth.
            ?quakeDepthObj sosa:hasSimpleResult ?quakeDepth FILTER (` + facetArr.join(' && ') + `).`;
    }

    let acresBurnedQuery = '';
    if(parameters["hazardFacetAcresBurnedMin"]!="" || parameters["hazardFacetAcresBurnedMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetAcresBurnedMin"]!="")
            facetArr.push(`?numAcresBurned > ` + parameters["hazardFacetAcresBurnedMin"]);
        if(parameters["hazardFacetAcresBurnedMax"]!="")
            facetArr.push(parameters["hazardFacetAcresBurnedMax"] + ` > ?numAcresBurned`);
        acresBurnedQuery = `
            ?observationCollection sosa:hasMember ?numAcresBurnedObj.
            ?numAcresBurnedObj rdfs:label ?numAcresBurnedObjLabel
            FILTER(contains(?numAcresBurnedObjLabel, 'Observation of Number Of Acres Burned')).
            ?numAcresBurnedObj sosa:hasSimpleResult ?numAcresBurned FILTER (` + facetArr.join(' && ') + `).`;
    }

    let meanDnbrQuery = '';
    if(parameters["hazardFacetMeanDnbrMin"]!="" || parameters["hazardFacetMeanDnbrMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetMeanDnbrMin"]!="")
            facetArr.push(`?meanVal > ` + parameters["hazardFacetMeanDnbrMin"]);
        if(parameters["hazardFacetMeanDnbrMax"]!="")
            facetArr.push(parameters["hazardFacetMeanDnbrMax"] + ` > ?meanVal`);
        meanDnbrQuery = `
            ?observationCollection sosa:hasMember ?meanValObj.
            ?meanValObj rdfs:label ?meanValObjLabel
            FILTER(contains(?meanValObjLabel, 'Observation of Mean dNBR Value')).
            ?meanValObj sosa:hasSimpleResult ?meanVal FILTER (` + facetArr.join(' && ') + `).`;
    }

    let SDMeanDnbrQuery = '';
    if(parameters["hazardFacetSDMeanDnbrMin"]!="" || parameters["hazardFacetSDMeanDnbrMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetSDMeanDnbrMin"]!="")
            facetArr.push(`?stanDevMeanVal > ` + parameters["hazardFacetSDMeanDnbrMin"]);
        if(parameters["hazardFacetSDMeanDnbrMax"]!="")
            facetArr.push(parameters["hazardFacetSDMeanDnbrMax"] + ` > ?stanDevMeanVal`);
        SDMeanDnbrQuery = `
            ?observationCollection sosa:hasMember ?stanDevMeanValObj.
            ?stanDevMeanValObj rdfs:label ?stanDevMeanValObjLabel
            FILTER(contains(?stanDevMeanValObjLabel, 'Observation of Standard Deviation of Mean dNBR Value')).
            ?stanDevMeanValObj sosa:hasSimpleResult ?stanDevMeanVal FILTER (` + facetArr.join(' && ') + `).`;
    }

    hazardQuery += `
        {
            ?entity rdf:type ?type; 
                    rdfs:label ?label; 
                    kwg-ont:locatedIn ?place; 
                    sosa:phenomenonTime ?startTime; 
                    sosa:phenomenonTime ?endTime; 
                    sosa:isFeatureOfInterestOf ?observationCollection; 
                    geo:hasGeometry/geo:asWKT ?wkt_raw.
            
            ${typeQuery}
            ?type rdfs:subClassOf kwg-ont:HazardEvent.
            ${regionTestQuery}
            ?place rdfs:label ?placeLabel.
            ?startTime time:inXSDDate ?startTimeLabel.
            ?endTime time:inXSDDate ?endTimeLabel.${dateQuery}
            BIND(REPLACE(STR(?wkt_raw), "<http://www.opengis.net/def/crs/OGC/1.3/CRS84>", "") AS ?wkt)
        
            ${magnitudeQuery}
            ${quakeDepthQuery}
        }
        union
        {
            ?entity rdf:type ?type; 
                    rdfs:label ?label; 
                    kwg-ont:locatedIn ?place; 
                    sosa:isFeatureOfInterestOf ?observationCollection; 
                    geo:hasGeometry/geo:asWKT ?wkt.
            ${fireTypeQuery}
            ?type rdfs:subClassOf kwg-ont:Fire.
            ${regionTestQuery}
            ?place rdfs:label ?placeLabel.
            ?observationCollection sosa:phenomenonTime ?startTime; 
                                   sosa:phenomenonTime ?endTime.${dateQuery}
            ?startTime time:inXSDDate ?startTimeLabel.
            ?endTime time:inXSDDate ?endTimeLabel.
            
            ${acresBurnedQuery}
            ${meanDnbrQuery}
            ${SDMeanDnbrQuery}
        }
        union
        {
            ?entity rdf:type ?type; 
                    rdfs:label ?label; 
                    kwg-ont:locatedIn ?place; 
                    kwg-ont:hasImpact ?observationCollection.
            ${hurricaneTypeQuery}
            ${hurricaneRegionQuery}
            optional
            {
                ?place rdfs:label ?placeLabel.
            }
            ?observationCollection sosa:phenomenonTime ?time.
            ?time time:hasBeginning ?startTime; 
                  time:hasEnd ?endTime.${dateQuery}
            ?startTime time:inXSDDateTime ?startTimeLabel.
            ?endTime time:inXSDDateTime ?endTimeLabel.
            optional
            {
                ?entity geo:hasGeometry/geo:asWKT ?wkt.
            }
        }
    }`;

    let queryResults = await query(hazardQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum-1)*recordNum);
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
    }`;

    //Special case for fires
    let fireQuery = `
    select distinct ?type where {
        ?entity rdf:type ?type.
        ?type rdfs:subClassOf kwg-ont:Fire
        FILTER(?type != kwg-ont:Fire).
    }`;

    let hurricaneQuery = `
    select distinct ?type where {
        ?entity rdf:type ?type.
        FILTER(?type = kwg-ont:Hurricane).
    }`;
    
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
        topicQuery = `values ?expert {kwgr:` + parameters["expertTopics"].join(' kwgr:') + `}`;
    }

    let expertQuery = `select distinct ?label ?entity ?affiliation ?affiliationLabel ?wkt
    (group_concat(distinct ?expert; separator = "||") as ?expertise)
    (group_concat(distinct ?expertLabel; separator = "||") as ?expertiseLabel)
    where {`;

    if(parameters["keyword"]!="") {
        expertQuery +=
            `
        ?search a elastic-index:kwg_es_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        `;
    }

    expertQuery +=
        `
        ?entity rdf:type iospress:Contributor.
        ?entity rdfs:label ?label.
        ?entity kwg-ont:hasExpertise ?expert.
        ${topicQuery}
        ?expert rdfs:label ?expertLabel.
        ?entity iospress:contributorAffiliation ?affiliation.
        ?affiliation rdfs:label ?affiliationLabel.
        ?affiliation geo:hasGeometry/geo:asWKT ?wkt.
    } GROUP BY ?label ?entity ?affiliation ?affiliationLabel ?wkt`;

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
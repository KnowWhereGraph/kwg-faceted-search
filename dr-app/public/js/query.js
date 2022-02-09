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
            //'Content-Type': 'application/x-www-form-urlencoded',
            //'Authorization': 'Basic ' + btoa(username + ":" + password),
        },
        body: new URLSearchParams([
            ...(d_form),
        ]),
    });

    return (await d_res.json()).results.bindings;
}

async function getRandomPlace() {
    let formattedResults = {};

    let randomPlaceQuery = `
    select distinct ?place ?place_label
    {
        {
            select distinct ?place ?place_label
            {
                ?place rdf:type ?place_type;
                    rdfs:label ?place_label.
                ?place_type rdfs:subClassOf kwg-ont:AdministrativeRegion.
            } ORDER BY RAND() LIMIT 1
        }
        UNION
        {
            select distinct ?place ?place_label
            {
                ?place rdf:type kwg-ont:ZipCodeArea;
                    kwg-ont:hasZipCode ?place_label.
            } ORDER BY RAND() LIMIT 1
        }
        UNION
        {
            select distinct ?place ?place_label
            {
                ?place rdf:type kwg-ont:USClimateDivision;
                    rdfs:label ?place_label.
            } ORDER BY RAND() LIMIT 1
        }
        UNION
        {
            select distinct ?place ?place_label
            {
                ?place rdf:type kwg-ont:NWZone;
                    rdfs:label ?place_label.
            } ORDER BY RAND() LIMIT 1
        }
    } ORDER BY RAND() LIMIT 1 `;

    let queryResults = await query(randomPlaceQuery);

    let row = queryResults[0];
    formattedResults[row.place_label.value] = row.place.value;

    return {'randomPlace':formattedResults};
}

async function getRandomHazard() {
    let formattedResults = {};

    let randomHazardQuery = `
    select distinct ?hazard ?hazard_label
    {
        {
            select distinct ?hazard ?hazard_label
            {
                ?hazard rdf:type kwg-ont:EarthquakeEvent;
                        rdfs:label ?hazard_label.
            } ORDER BY RAND() LIMIT 1
        }
        UNION
        {
            select distinct ?hazard ?hazard_label
            {
                ?hazard rdf:type kwg-ont:Fire;
                        rdfs:label ?hazard_label.
            } ORDER BY RAND() LIMIT 1
        }
        UNION
        {
            select distinct ?hazard ?hazard_label
            {
                ?hazard rdf:type kwg-ont:Hurricane;
                        rdfs:label ?hazard_label.
            } ORDER BY RAND() LIMIT 1
        }
    } ORDER BY RAND() LIMIT 1 `;

    let queryResults = await query(randomHazardQuery);

    let row = queryResults[0];
    formattedResults[row.hazard_label.value] = row.hazard.value;

    return {'randomHazard':formattedResults};
}

async function getRandomExpert() {
    let formattedResults = {};

    let randomExpertQuery = `
    select distinct ?expert ?expert_label
    {
        ?expert rdf:type iospress:Contributor;
                rdfs:label ?expert_label.
    } ORDER BY RAND() LIMIT 1`;

    let queryResults = await query(randomExpertQuery);

    let row = queryResults[0];
    if (typeof(row) == "undefined")
    {
        row = {
            'expert':
            {'value': 'http://stko-kwg.geog.ucsb.edu/lod/resource/expert.1750909092'},
            'expert_label':
            {'value':'Chenyang Cao'}
        };
    }

    formattedResults[row.expert_label.value] = row.expert.value;

    return {'randomExpert':formattedResults};
}

async function getRandomWildfire() {
    let formattedResults = {};

    let randomWildfireQuery = `
    select distinct ?wildfire ?wildfire_label
    {
        ?wildfire rdf:type kwg-ont:Wildfire;
                rdfs:label ?wildfire_label.
    } ORDER BY RAND() LIMIT 1`;

    let queryResults = await query(randomWildfireQuery);

    let row = queryResults[0];
    formattedResults[row.wildfire_label.value] = row.wildfire.value;

    return {'randomWildfire':formattedResults};
}

async function getRandomEarthquake() {
    let formattedResults = {};

    let randomEarthquakeQuery = `
    select distinct ?earthquake ?earthquake_label
    {
        ?earthquake rdf:type kwg-ont:EarthquakeEvent;
                    rdfs:label ?earthquake_label.
    } ORDER BY RAND() LIMIT 1`;

    let queryResults = await query(randomEarthquakeQuery);

    let row = queryResults[0];
    formattedResults[row.earthquake_label.value] = row.earthquake.value;

    return {'randomEarthquake':formattedResults};
}

async function getRandomExpertInjuryStorm() {
    let formattedResults = {};

    let randomExpertQuery = `
    select distinct ?expert ?expert_label
    {
        ?expert rdf:type iospress:Contributor;
                kwg-ont:hasExpertise kwgr:hazardtopic.storm.aspecttopic.injury;
                rdfs:label ?expert_label.
    } ORDER BY RAND() LIMIT 1`;

    let queryResults = await query(randomExpertQuery);

    let row = queryResults[0];
    if (typeof(row) == "undefined")
    {
        row = {
            'expert':
            {'value': 'http://stko-kwg.geog.ucsb.edu/lod/resource/expert.14838165'},
            'expert_label':
            {'value':'Zhonghua Mao'}
        };
    }

    formattedResults[row.expert_label.value] = row.expert.value;

    return {'randomExpert':formattedResults};
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
    select distinct ?division ?division_label where {
        ?division rdf:type kwg-ont:USClimateDivision;
                  rdfs:label ?division_label.
    } ORDER BY ASC(?division_label)`;

    let queryResults = await query(divisionQuery);
    for (let row of queryResults) {
        let division = row.division.value;
        let division_label = row.division_label.value;
        formattedResults[division_label] = division;
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

    let placeQuery = `select ?label ?type ?typeLabel ?entity where {`;

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
                
                ?entity a ?type; rdfs:label ?label; geo:hasGeometry ?geo.
                values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3}
                ?type rdfs:label ?typeLabel
            }`);
        }
        if(parameters["placeFacetsZip"]!="") {
            entityAll = await getZipCodeArea();
            entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
            entity = entityArray[entityArray.length - 1];
            typeQueries.push(`
            {
                ?entity rdf:type ?type; kwg-ont:hasZipCode ?label; geo:hasGeometry ?geo.
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
                ?entity rdf:type ?type; rdfs:label ?label; geo:hasGeometry ?geo.
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
                ?entity rdf:type ?type; rdfs:label ?label; geo:hasGeometry ?geo.
                values ?entity {kwgr:` + entity + `}
                values ?type {kwg-ont:NWZone}
            }`);
        }
        placeQuery += typeQueries.join(' union ');
    } else {
        placeQuery += `
        {
            ?entity a ?type; rdfs:label|kwg-ont:hasZipCode ?label; geo:hasGeometry ?geo.
            values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3 kwg-ont:ZipCodeArea kwg-ont:USClimateDivision kwg-ont:NWZone}
            ?type rdfs:label ?typeLabel
        }`;
    }

    if (typeof parameters["spatialSearchWkt"] != 'undefined')
    {
        placeQuery += `
            ?entity geo:sfWithin '${parameters["spatialSearchWkt"]}'^^geo:wktLiteral.
        `;
    }
    placeQuery += `}`;

    let queryResults = await query(placeQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum-1)*recordNum);
    let entityRawValues = [];
    for (let row of queryResults) {
        let entityArray = row.entity.value.split("/");
        entityRawValues.push('kwgr:'+entityArray[entityArray.length - 1]);
        formattedResults.push({
            'place':row.entity.value,
            'place_name':row.label.value,
            'place_type':row.type.value,
            'place_type_name':row.typeLabel.value,
        });
    }

    let wktQuery= await query(`select ?entity ?wkt where { ?entity geo:hasGeometry/geo:asWKT ?wkt. values ?entity {${entityRawValues.join(' ')}} }`);
    let wktResults = {};
    for(let row of wktQuery) {
        wktResults[row.entity.value] = (typeof row.wkt  === 'undefined') ? '' : row.wkt.value;
    }

    for(let i=0; i<formattedResults.length; i++) {
        formattedResults[i]['wkt'] = wktResults[formattedResults[i]['place']];
    }

    let countResults = await query(`select (count(*) as ?count) { ` + placeQuery + `}`);
    return {'count':countResults[0].count.value,'record':formattedResults};
}

//New search function for hazard in stko-kwg
async function getHazardSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let hazardQuery = `select distinct ?entity ?label ?type ?typeLabel where {`;

    //Keyword search
    if(parameters["keyword"]!="") {
        hazardQuery +=
            `
        ?search a elastic-index:kwg_es_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        `;
    }

    //Filters out the types of hazards
    let typeQuery = 'values ?type {kwg-ont:EarthquakeEvent kwg-ont:Hurricane kwg-ont:Wildfire kwg-ont:WildlandFireUse kwg-ont:PrescribedFire kwg-ont:UnknownFire} #Temporary limiter';
    if(parameters["hazardTypes"].length > 0)
        typeQuery = `values ?type {kwg-ont:` + parameters["hazardTypes"].join(' kwg-ont:') + `}`;

    //These filters handle search by place type (regions, zipcode, nwz, uscd)
    let placeSearchQuery = '';
    if(parameters["facetRegions"].length > 0) {
        placeSearchQuery += `
        { 
             select distinct ?entity where {
                 ?entity geo:sfOverlaps|geo:sfWithin|kwg-ont:locatedIn/geo:sfConatins ?hazardCell .
                 ?hazardCell rdf:type kwg-ont:KWGCellLevel13 .
                 values ?region {kwgr:` + parameters["facetRegions"].join(' kwgr:') + `}
                 ?hazardCell geo:sfWithin* ?region .
             }
         }`;
    }
    if(parameters["placeFacetsZip"]!="") {
        entityAll = await getZipCodeArea();
        entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
        entity = entityArray[entityArray.length - 1];
        placeSearchQuery += `
        { 
             select distinct ?entity where {
                 ?entity geo:sfOverlaps|geo:sfWithin|kwg-ont:locatedIn/geo:sfConatins ?hazardCell .
                 ?hazardCell rdf:type kwg-ont:KWGCellLevel13 .
                 values ?zipcode {kwgr:` + entity + `}
                 ?hazardCell geo:sfWithin|geo:sfOverlaps ?zipcode .
             }
         }`;
    }
    if(parameters["placeFacetsUSCD"]!="") {
        entityAll = await getUSClimateDivision();
        entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
        entity = entityArray[entityArray.length - 1];
        placeSearchQuery += `
        {
             select distinct ?entity where {
                 ?entity geo:sfOverlaps|geo:sfWithin|kwg-ont:locatedIn/geo:sfConatins ?hazardCell .
                 ?hazardCell rdf:type kwg-ont:KWGCellLevel13 .
                 values ?uscd {kwgr:` + entity + `}
                 ?uscd geo:sfIntersects ?hazardCell .
             }
         }`;
    }
    if(parameters["placeFacetsNWZ"]!="") {
        entityAll = await getNWZone();
        entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
        entity = entityArray[entityArray.length - 1];
        placeSearchQuery += `
        {
             select distinct ?entity where {
                 ?entity geo:sfOverlaps|geo:sfWithin|kwg-ont:locatedIn/geo:sfConatins ?hazardCell .
                 ?hazardCell rdf:type kwg-ont:KWGCellLevel13 .
                 values ?nwzone {kwgr:` + entity + `}
                 ?hazardCell geo:sfWithin ?nwzone .
             }
         }`;
    }

    //Filter by the date hazard occurred
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
        dateQuery = `
            ?observationCollection sosa:phenomenonTime ?time.
            ?time time:hasBeginning/time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                time:hasEnd/time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
            FILTER (` + dateArr.join(' && ') + `)`;
    }

    let spatialSearchQuery = '';
    if (typeof parameters["spatialSearchWkt"] != 'undefined')
    {
        spatialSearchQuery += `
            ?entity geo:sfWithin '${parameters["spatialSearchWkt"]}'^^geo:wktLiteral.
        `;
    }
    //Build the full query
    hazardQuery += `
        ?entity rdf:type ?type; 
            rdfs:label ?label;
            kwg-ont:hasImpact|sosa:isFeatureOfInterestOf ?observationCollection.
        ?type rdfs:subClassOf ?superClass;
            rdfs:label ?typeLabel.
        values ?superClass {kwg-ont:Hazard kwg-ont:Fire} #Temporary limiter
        ${typeQuery}
        ${placeSearchQuery}
        ${dateQuery}
        ${hazardTypeFacets(parameters)}
        ${spatialSearchQuery}
    }`;
    
    let queryResults = await query(hazardQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum-1)*recordNum);
    let entityRawValues = [];
    for (let row of queryResults) {
        let entityArray = row.entity.value.split("/");
        entityRawValues.push('kwgr:'+entityArray[entityArray.length - 1]);
        formattedResults.push({
            'hazard':row.entity.value,
            'hazard_name':row.label.value,
            'hazard_type':row.type.value,
            'hazard_type_name':row.typeLabel.value
        });
    }

    let propertyQuery= await query(`
        select ?entity ?place ?placeLabel ?time ?startTimeLabel ?endTimeLabel ?wkt where { 
            values ?entity {${entityRawValues.join(' ')}} 
            optional
            {
                ?entity kwg-ont:locatedIn ?place.
                ?place rdfs:label ?placeLabel.
            }
            optional
            {
                ?entity kwg-ont:hasImpact|sosa:isFeatureOfInterestOf ?observationCollection.
                ?observationCollection sosa:phenomenonTime ?time.
                ?time time:hasBeginning/time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                      time:hasEnd/time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
            }
            optional
            {
                ?entity geo:hasGeometry/geo:asWKT ?wkt.
            }
        }`
    );
    let propResults = {};
    for(let row of propertyQuery) {
        let place = (typeof row.place  === 'undefined') ? '' : row.place.value;
        let place_name = (typeof row.placeLabel  === 'undefined') ? '' : row.placeLabel.value;
        let start_date = (typeof row.time  === 'undefined') ? '' : row.time.value;
        let start_date_name = (typeof row.startTimeLabel  === 'undefined') ? '' : row.startTimeLabel.value;
        let end_date = (typeof row.time  === 'undefined') ? '' : row.time.value;
        let end_date_name = (typeof row.endTimeLabel  === 'undefined') ? '' : row.endTimeLabel.value;
        let wkt = (typeof row.wkt  === 'undefined') ? '' : row.wkt.value;
        propResults[row.entity.value] = {'place':place, 'place_name':place_name, 'start_date':start_date, 'start_date_name':start_date_name,
            'end_date':end_date, 'end_date_name':end_date_name, 'wkt':wkt}
    }

    for(let i=0; i<formattedResults.length; i++) {
        formattedResults[i]['place'] = propResults[formattedResults[i]['hazard']]['place'];
        formattedResults[i]['place_name'] = propResults[formattedResults[i]['hazard']]['place_name'];
        formattedResults[i]['start_date'] = propResults[formattedResults[i]['hazard']]['start_date'];
        formattedResults[i]['start_date_name'] = propResults[formattedResults[i]['hazard']]['start_date_name'];
        formattedResults[i]['end_date'] = propResults[formattedResults[i]['hazard']]['end_date'];
        formattedResults[i]['end_date_name'] = propResults[formattedResults[i]['hazard']]['end_date_name'];
        formattedResults[i]['wkt'] = propResults[formattedResults[i]['hazard']]['wkt'].replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>','');
    }

    let countResults = await query(`select (count(*) as ?count) { ` + hazardQuery + `}`);
    return {'count':countResults[0].count.value,'record':formattedResults};
}

//These are facet searches that are unique to a specific hazard type (fire, earthquake, etc)
function hazardTypeFacets(parameters) {
    let typedHazardQuery = '';

    if(parameters["hazardFacetMagnitudeMin"]!="" || parameters["hazardFacetMagnitudeMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetMagnitudeMin"]!="")
            facetArr.push(`xsd:decimal(STR(?magnitude)) > ` + parameters["hazardFacetMagnitudeMin"]);
        if(parameters["hazardFacetMagnitudeMax"]!="")
            facetArr.push(parameters["hazardFacetMagnitudeMax"] + ` > xsd:decimal(STR(?magnitude))`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?magnitudeObj.
            ?magnitudeObj sosa:observedProperty kwgr:earthquakeObservableProperty.mag.
            ?magnitudeObj sosa:hasSimpleResult ?magnitude FILTER (` + facetArr.join(' && ') + `).`;
    }

    if(parameters["hazardQuakeDepthMin"]!="" || parameters["hazardQuakeDepthMax"]!="") {
        let facetArr = [];
        if(parameters["hazardQuakeDepthMin"]!="")
            facetArr.push(`xsd:decimal(STR(?quakeDepth)) > ` + parameters["hazardQuakeDepthMin"]);
        if(parameters["hazardQuakeDepthMax"]!="")
            facetArr.push(parameters["hazardQuakeDepthMax"] + ` > xsd:decimal(STR(?quakeDepth))`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?quakeDepthObj.
            ?quakeDepthObj sosa:observedProperty kwgr:earthquakeObservableProperty.depth.
            ?quakeDepthObj sosa:hasSimpleResult ?quakeDepth FILTER (` + facetArr.join(' && ') + `).`;
    }

    if(parameters["hazardFacetAcresBurnedMin"]!="" || parameters["hazardFacetAcresBurnedMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetAcresBurnedMin"]!="")
            facetArr.push(`?numAcresBurned > ` + parameters["hazardFacetAcresBurnedMin"]);
        if(parameters["hazardFacetAcresBurnedMax"]!="")
            facetArr.push(parameters["hazardFacetAcresBurnedMax"] + ` > ?numAcresBurned`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?numAcresBurnedObj.
            ?numAcresBurnedObj rdfs:label ?numAcresBurnedObjLabel
            FILTER(contains(?numAcresBurnedObjLabel, 'Observation of Number Of Acres Burned')).
            ?numAcresBurnedObj sosa:hasSimpleResult ?numAcresBurned FILTER (` + facetArr.join(' && ') + `).`;
    }

    if(parameters["hazardFacetMeanDnbrMin"]!="" || parameters["hazardFacetMeanDnbrMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetMeanDnbrMin"]!="")
            facetArr.push(`?meanVal > ` + parameters["hazardFacetMeanDnbrMin"]);
        if(parameters["hazardFacetMeanDnbrMax"]!="")
            facetArr.push(parameters["hazardFacetMeanDnbrMax"] + ` > ?meanVal`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?meanValObj.
            ?meanValObj rdfs:label ?meanValObjLabel
            FILTER(contains(?meanValObjLabel, 'Observation of Mean dNBR Value')).
            ?meanValObj sosa:hasSimpleResult ?meanVal FILTER (` + facetArr.join(' && ') + `).`;
    }

    if(parameters["hazardFacetSDMeanDnbrMin"]!="" || parameters["hazardFacetSDMeanDnbrMax"]!="") {
        let facetArr = [];
        if(parameters["hazardFacetSDMeanDnbrMin"]!="")
            facetArr.push(`?stanDevMeanVal > ` + parameters["hazardFacetSDMeanDnbrMin"]);
        if(parameters["hazardFacetSDMeanDnbrMax"]!="")
            facetArr.push(parameters["hazardFacetSDMeanDnbrMax"] + ` > ?stanDevMeanVal`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?stanDevMeanValObj.
            ?stanDevMeanValObj rdfs:label ?stanDevMeanValObjLabel
            FILTER(contains(?stanDevMeanValObjLabel, 'Observation of Standard Deviation of Mean dNBR Value')).
            ?stanDevMeanValObj sosa:hasSimpleResult ?stanDevMeanVal FILTER (` + facetArr.join(' && ') + `).`;
    }

    return typedHazardQuery;
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

    // use ?affiliation instead of ?entity for expert spatial search
    let spatialSearchQuery = '';
    if (typeof parameters["spatialSearchWkt"] != 'undefined')
    {
        spatialSearchQuery += `
            ?affiliation geo:sfWithin '${parameters["spatialSearchWkt"]}'^^geo:wktLiteral.
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
        ${spatialSearchQuery}
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
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
    usgs:'http://gnis-ld.org/lod/usgs/ontology/',
    'elastic-index': 'http://www.ontotext.com/connectors/elasticsearch/instance#',
    'iospress': 'http://ld.iospress.nl/rdf/ontology/',
};

let S_PREFIXES = '';
for (let [si_prefix, p_prefix_iri] of Object.entries(H_PREFIXES)) {
    S_PREFIXES += `prefix ${si_prefix}: <${p_prefix_iri}>\n`;
}

// SPARQL endpoint
const P_ENDPOINT = 'https://stko-kwg.geog.ucsb.edu/graphdb/repositories/KWG';

/**
 * Performs a SPARQL query
 * 
 * @param {string} srq_query The query that is being performed
 * @param {boolean} infer Set to true when inference should be enabled
 * @returns 
 */
async function query(srq_query, infer=true) {
    let d_form = new FormData();
    d_form.append('query', S_PREFIXES + srq_query);
    if(!infer) {
      d_form.append('infer', infer);
    }
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
      }).catch((error) => {
        console.log("There was an error while running a query: ", error);
        $('#timeoutModal').modal('show');
        angular.element("#hazardTable-body #loading").remove();
        angular.element("#expertTable-body #loading").remove();
        angular.element("#placeTable-body #loading").remove();
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
                    rdfs:label ?place_label.
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

    return { 'randomPlace': formattedResults };
}

async function getRandomHazard() {
    let formattedResults = {};

    let randomHazardQuery = `
    select distinct ?hazard ?hazard_label
    {
        {
            select distinct ?hazard ?hazard_label
            {
                ?hazard rdf:type kwg-ont:Earthquake;
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
                ?hazard rdf:type kwg-ont:NOAAHurricane;
                        rdfs:label ?hazard_label.
            } ORDER BY RAND() LIMIT 1
        }
    } ORDER BY RAND() LIMIT 1 `;

    let queryResults = await query(randomHazardQuery);

    let row = queryResults[0];
    formattedResults[row.hazard_label.value] = row.hazard.value;

    return { 'randomHazard': formattedResults };
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

    formattedResults[row.expert_label.value] = row.expert.value;

    return { 'randomExpert': formattedResults };
}

async function getRandomWildfire() {
    let formattedResults = {};

    let randomWildfireQuery = `
    select distinct ?wildfire ?wildfire_label
    {
        ?wildfire rdf:type kwg-ont:MTBSWildfire;
                rdfs:label ?wildfire_label.
    } ORDER BY RAND() LIMIT 1`;

    let queryResults = await query(randomWildfireQuery);

    let row = queryResults[0];

    formattedResults[row.wildfire_label.value] = row.wildfire.value;

    return { 'randomWildfire': formattedResults };
}

async function getRandomEarthquake() {
    let formattedResults = {};

    let randomEarthquakeQuery = `
    select distinct ?earthquake ?earthquake_label
    {
        ?earthquake rdf:type kwg-ont:Earthquake;
                    rdfs:label ?earthquake_label.
    } ORDER BY RAND() LIMIT 1`;

    let queryResults = await query(randomEarthquakeQuery);

    let row = queryResults[0];
    formattedResults[row.earthquake_label.value] = row.earthquake.value;

    return { 'randomEarthquake': formattedResults };
}

async function getRandomExpertInjuryStorm() {
    let formattedResults = {};

    let randomExpertQuery = `
    select distinct ?expert ?expert_label
    {
        ?expert rdf:type iospress:Contributor;
                kwg-ont:hasExpertise kwgr:topic.covid19;
                rdfs:label ?expert_label.
    } ORDER BY RAND() LIMIT 1`;

    let queryResults = await query(randomExpertQuery);

    let row = queryResults[0];

    formattedResults[row.expert_label.value] = row.expert.value;

    return { 'randomExpert': formattedResults };
}

async function getAdministrativeRegion() {
    let formattedResults = {};

    let regionQuery = `
    select ?a3 ?a3Label ?a2 ?a2Label ?a1 ?a1Label where {
        ?a3 rdf:type kwg-ont:AdministrativeRegion_3 .
        ?a3 kwg-ont:sfWithin ?a2 .
        ?a2 kwg-ont:sfWithin ?a1.
        values ?a1 {kwgr:Earth.North_America.United_States.USA}
        ?a3 rdfs:label ?a3Label .
        ?a2 rdfs:label ?a2Label .
        ?a1 rdfs:label ?a1Label .
    } ORDER BY ?a1Label ?a2Label ?a3Label`;

    // use cached data for now
    // let queryResults = await query(regionQuery);
    us_admin_regions_json = await fetch("/cache/us_admin_regions.json");
    us_admin_regions_cached = await us_admin_regions_json.json();
    let queryResults = us_admin_regions_cached.results.bindings;

    for (let row of queryResults) {
        let a1Array = row.a1.value.split("/");
        let a1 = a1Array[a1Array.length - 1];
        let a1Label = row.a1Label.value;

        if (!(a1 in formattedResults))
            formattedResults[a1] = { 'label': a1Label, 'sub_admin_regions': {} }

        let a2Array = row.a2.value.split("/");
        let a2 = a2Array[a2Array.length - 1];
        let a2Label = row.a2Label.value;

        if (!(a2 in formattedResults[a1]["sub_admin_regions"]))
            formattedResults[a1]["sub_admin_regions"][a2] = { 'label': a2Label, 'sub_admin_regions': {} };

        let a3Array = row.a3.value.split("/");
        let a3 = a3Array[a3Array.length - 1];
        let a3Label = row.a3Label.value;

        formattedResults[a1]["sub_admin_regions"][a2]["sub_admin_regions"][a3] = { 'label': a3Label };
    }

    return { 'regions': formattedResults };
}

async function getNonHierarchicalAdministrativeRegion() {
    let formattedResults = [];

    let adminQuery = `
    select distinct ?admin ?admin_label
    {
        {
            ?admin rdf:type kwg-ont:AdministrativeRegion_2;
                   rdfs:label ?admin_label;
                   kwg-ont:sfWithin kwgr:Earth.North_America.United_States.USA.
        }
        UNION
        {
            ?admin rdf:type kwg-ont:AdministrativeRegion_3;
                   rdfs:label ?admin_label;
                   kwg-ont:sfWithin ?admin_upper_level.
            ?admin_upper_level kwg-ont:sfWithin kwgr:Earth.North_America.United_States.USA.
        }
    } ORDER BY ASC(?admin)`;

    // use cached data for now
    // let queryResults = await query(adminQuery);
    us_admin_regions_nonhierarchical_json = await fetch("/cache/us_admin_regions_nonhierarchical.json");
    us_admin_regions_nonhierarchical_cached = await us_admin_regions_nonhierarchical_json.json();
    let queryResults = us_admin_regions_nonhierarchical_cached.results.bindings;

    for (let row of queryResults) {
        let admin = row.admin.value;
        let admin_label = row.admin_label.value;
        formattedResults[admin_label] = admin;
    }

    return { 'regions': formattedResults };
}

async function getZipCodeArea() {
    let formattedResults = [];

    let zipcodeQuery = `
    select distinct ?zipcode ?zipcodeArea where {
        ?zipcodeArea rdf:type kwg-ont:ZipCodeArea;
                     rdfs:label ?zipcode.
    } ORDER BY ASC(?zipcode)`;

    // use cached data for now
    // let queryResults = await query(zipcodeQuery);
    zipcode_areas_json = await fetch("/cache/zipcode_areas.json");
    zipcode_areas_cached = await zipcode_areas_json.json();
    let queryResults = zipcode_areas_cached.results.bindings;

    for (let row of queryResults) {
        let zipcode = row.zipcode.value;
        zipcode = zipcode.substring(9);
        let zipcodeArea = row.zipcodeArea.value;
        formattedResults[zipcode] = zipcodeArea;
    }

    return { 'zipcodes': formattedResults };
}

async function getFIPS(){
    let formattedResults = [];

    let zipcodeQuery = `
    select distinct ?fips ?region
    {
        {
            ?region kwg-ont:hasFIPS ?fips.
        }
        UNION
        {
            ?region kwg-ont:climateDivisionFIPS ?fips.
        }
    } ORDER BY ?fips`;

    // use cached data for now
    // let queryResults = await query(zipcodeQuery);
    fips_json = await fetch("/cache/fips.json");
    fips_cached = await fips_json.json();
    let queryResults = fips_cached.results.bindings;

    for (let row of queryResults) {
        let fips = row.fips.value;
        let region = row.region.value;
        formattedResults[fips] = region;
    }

    return { 'fips': formattedResults };
}

async function getUSClimateDivision() {
    let formattedResults = [];

    let divisionQuery = `
    select distinct ?division ?division_label where {
        ?division rdf:type kwg-ont:USClimateDivision;
                  rdfs:label ?division_label.
    } ORDER BY ASC(?division_label)`;

    // use cached data for now
    // let queryResults = await query(divisionQuery);
    us_climate_divisions_json = await fetch("/cache/us_climate_divisions.json");
    us_climate_divisions_cached = await us_climate_divisions_json.json();
    let queryResults = us_climate_divisions_cached.results.bindings;

    for (let row of queryResults) {
        let division = row.division.value;
        let division_label = row.division_label.value;
        formattedResults[division_label] = division;
    }

    return { 'divisions': formattedResults };
}

async function getNWZone() {
    let formattedResults = [];

    let nwzoneQuery = `
    select distinct ?nwzone ?nwzone_label where {
        ?nwzone rdf:type kwg-ont:NWZone;
                rdfs:label ?nwzone_label.
    } ORDER BY ASC(?nwzone_label)`;

    // use cached data for now
    // let queryResults = await query(nwzoneQuery);    
    nwzones_json = await fetch("/cache/nwzones.json");
    nwzones_cached = await nwzones_json.json();
    let queryResults = nwzones_cached.results.bindings;
    
    for (let row of queryResults) {
        let nwzone = row.nwzone.value;
        let nwzone_label = row.nwzone_label.value;
        formattedResults[nwzone_label] = nwzone;
    }

    return { 'nwzones': formattedResults };
}

async function getGNISFeature() {
    let formattedResults = [];

    let gnisQuery = `
    select distinct ?gnisFeatureType ?gnisFeatureType_label ?gnisFeatureSuperType ?gnisFeatureSuperType_label
    {
        ?gnisFeatureType rdfs:subClassOf ?gnisFeatureSuperType;
                         rdfs:label ?gnisFeatureType_label.
        ?gnisFeatureSuperType rdfs:label ?gnisFeatureSuperType_label.
        values ?gnisFeatureSuperType {usgs:BuiltUpArea usgs:SurfaceWater usgs:Terrain}
    } ORDER BY ASC(?gnisFeature)`;

    let queryResults = await query(gnisQuery);

    formattedResults["Built Up Area"] = {};
    formattedResults["Surface Water"] = {};
    formattedResults["Terrain"] = {};

    for (let row of queryResults) {
        let gnisFeatureType = row.gnisFeatureType.value;
        let gnisFeatureType_label = row.gnisFeatureType_label.value;
        let gnisFeatureSuperType_label = row.gnisFeatureSuperType_label.value;
        formattedResults[gnisFeatureSuperType_label][gnisFeatureType_label] = gnisFeatureType;
    }

    return { 'gnisFeatureTypes': formattedResults };
}

//New search function for place in stko-kwg
async function getPlaceSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let placeQuery = `select distinct ?entity ?label ?type ?typeLabel where {`;

    if (parameters["keyword"] != "") {
        placeQuery += `
        ?search a elastic-index:kwg_staging_es_index-copy;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.`;
    }

    if (parameters["facetGNIS"].length > 0)
    {
            let gnisTypeArray = parameters["facetGNIS"];
            for (i = 0; i < gnisTypeArray.length; i++)
            {
                gnisTypeArray[i] = gnisTypeArray[i].replace(' ','');
            }
            placeQuery += `             
                ?entity a ?type; rdfs:label ?label.
                ?type rdfs:label ?typeLabel.
                values ?type {usgs:` + gnisTypeArray.join(' usgs:') + `}
            `;
            if (parameters["placeFacetsRegion"] != "" | parameters["placeFacetsUSCD"] != "" | parameters["placeFacetsNWZ"] != "" | parameters["placeFacetsZip"] != "")
            {
                placeQuery +=  `
                    ?entity kwg-ont:sfWithin ?s2cell.
                    ?s2cell rdf:type kwg-ont:KWGCellLevel13;
                            kwg-ont:sfWithin|kwg-ont:sfCrosses|kwg-ont:sfOverlaps|kwg-ont:sfContains ?placesConnectedToS2.
                `;
                let placesConnectedToS2 = [];
        
                if (parameters["placeFacetsRegion"] != "") {
                    entityAll = await query(`
                    select ?entity
                    {
                        ?search a elastic-index:kwg_staging_es_index-copy;
                        elastic:query "${parameters["placeFacetsRegion"]}";
                        elastic:entities ?entity.
                        
                        ?entity a ?type; rdfs:label ?label.
                        values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3}
                        ?type rdfs:label ?typeLabel
                    }`);
                    entityArray = entityAll[0].entity.value.split("/");
                    entity = entityArray[entityArray.length - 1];
                    placesConnectedToS2.push(`kwgr:` + entity);
                }
                if (parameters["placeFacetsZip"] != "") {
                    entityAll = await getZipCodeArea();
                    if (typeof entityAll['zipcodes'][parameters["placeFacetsZip"]] === 'undefined')
                    {
                        placesConnectedToS2.push(``);
                    }
                    else
                    {
                        entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
                        placesConnectedToS2.push(`kwgr:` + entityArray[entityArray.length - 1]);
                    }
                }
                if (parameters["placeFacetsFIPS"] != "") {
                    entityAll = await getFIPS();
                    if (typeof entityAll['fips'][parameters["placeFacetsFIPS"]] === 'undefined')
                    {
                        placesConnectedToS2.push(``);
                    }
                    else
                    {
                        entityArray = entityAll['fips'][parameters["placeFacetsFIPS"]].split("/");
                        placesConnectedToS2.push(`kwgr:` + entityArray[entityArray.length - 1]);
                    }
                }
                if (parameters["placeFacetsUSCD"] != "") {
                    entityAll = await getUSClimateDivision();
                    if (typeof entityAll['divisions'][parameters["placeFacetsUSCD"]] === 'undefined')
                    {
                        placesConnectedToS2.push(``);
                    }
                    else
                    {
                        entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
                        placesConnectedToS2.push(`kwgr:` + entityArray[entityArray.length - 1]);
                    }
                }
                if (parameters["placeFacetsNWZ"] != "") {
                    entityAll = await getNWZone();
                    if (typeof entityAll['nwzones'][parameters["placeFacetsNWZ"]] === 'undefined')
                    {
                        placesConnectedToS2.push(``);
                    }
                    else
                    {
                        entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
                        placesConnectedToS2.push(`kwgr:` + entityArray[entityArray.length - 1]);
                    }
                }
                placeQuery += `values ?placesConnectedToS2 {${placesConnectedToS2.join(' ')}}`;
            }
    }
    else
    {
        if (parameters["placeFacetsRegion"] != "" | parameters["placeFacetsUSCD"] != "" | parameters["placeFacetsNWZ"] != "" | parameters["placeFacetsZip"] != "")
        {
            let typeQueries = [];
    
            if (parameters["placeFacetsRegion"] != "") {
                typeQueries.push(`
                {
                    ?search a elastic-index:kwg_staging_es_index-copy;
                    elastic:query "${parameters["placeFacetsRegion"]}";
                    elastic:entities ?entity.
                    
                    ?entity a ?type; rdfs:label ?label.
                    values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3}
                    ?type rdfs:label ?typeLabel
                }`);
            }
            if (parameters["placeFacetsZip"] != "") {
                entityAll = await getZipCodeArea();
                entity = ``;
                if (typeof entityAll['zipcodes'][parameters["placeFacetsZip"]] === 'undefined')
                {
                    entity = ``;
                }
                else
                {
                    entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
                    entity = entityArray[entityArray.length - 1];
                }
                typeQueries.push(`
                {
                    ?entity rdf:type ?type; rdfs:label ?label.
                    values ?entity {kwgr:` + entity + `}
                    ?type rdfs:label ?typeLabel.
                    values ?type {kwg-ont:ZipCodeArea}
                }`);
            }
            if (parameters["placeFacetsFIPS"] != "") {
                entityAll = await getFIPS();
                entity = ``;
                if (typeof entityAll['fips'][parameters["placeFacetsFIPS"]] === 'undefined')
                {
                    entity = ``;
                }
                else
                {
                    entityArray = entityAll['fips'][parameters["placeFacetsFIPS"]].split("/");
                    entity = entityArray[entityArray.length - 1];
                }
                typeQueries.push(`
                {
                    ?entity rdf:type ?type; kwg-ont:hasFIPS|kwg-ont:climateDivisionFIPS ?label.
                    values ?entity {kwgr:` + entity + `}
                    ?type rdfs:label ?typeLabel.
                    values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3 kwg-ont:USClimateDivision}
                }`);
            }
            if (parameters["placeFacetsUSCD"] != "") {
                entityAll = await getUSClimateDivision();
                entity = ``;
                if (typeof entityAll['divisions'][parameters["placeFacetsUSCD"]] === 'undefined')
                {
                    entity = ``;
                }
                else
                {
                    entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
                    entity = entityArray[entityArray.length - 1];
                }
                typeQueries.push(`
                {
                    ?entity rdf:type ?type; rdfs:label ?label.
                    values ?entity {kwgr:` + entity + `}
                    values ?type {kwg-ont:USClimateDivision}
                    ?type rdfs:label ?typeLabel
                }`);
            }
            if (parameters["placeFacetsNWZ"] != "") {
                entityAll = await getNWZone();
                if (typeof entityAll['nwzones'][parameters["placeFacetsNWZ"]] === 'undefined')
                {
                    entity = ``;
                }
                else
                {
                    entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
                    entity = entityArray[entityArray.length - 1];
                }
                typeQueries.push(`
                {
                    ?entity rdf:type ?type; rdfs:label ?label.
                    values ?entity {kwgr:` + entity + `}
                    ?type rdfs:label ?typeLabel.
                    values ?type {kwg-ont:NWZone}
                }`);
            }
            placeQuery += typeQueries.join(' union ');
        }
        else
        {
            placeQuery += `
            {
                ?entity rdf:type ?type; rdfs:label ?label.
                values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3 kwg-ont:ZipCodeArea kwg-ont:USClimateDivision kwg-ont:NWZone}
                ?type rdfs:label ?typeLabel
            }`;
        }
    }


    if (typeof parameters["spatialSearchWkt"] != 'undefined') {
        placeQuery += `
            ?entity geo:sfWithin '${parameters["spatialSearchWkt"]}'^^geo:wktLiteral.
        `;
    }
    placeQuery += `}`;
    
    let queryResults = await query(placeQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);

    let entityRawValues = [];
    for (let row of queryResults) {
        //let entityArray = row.entity.value.split("/");
        //entityRawValues.push('kwgr:' + entityArray[entityArray.length - 1]);
        entityRawValues.push(row.entity.value);
        formattedResults.push({
            'place': row.entity.value,
            'place_name': row.label.value,
            'place_type': row.type.value,
            'place_type_name': row.typeLabel.value,
        });
    }

    if (entityRawValues.length == 0)
    {
        return { 'count': 0, 'record': {} };
    }

    let wktQuery = await query(`select ?entity ?wkt where { ?entity geo:hasGeometry/geo:asWKT ?wkt. values ?entity {<${entityRawValues.join('> <')}>} }`);

    let wktResults = {};
    for (let row of wktQuery) {
        wktResults[row.entity.value] = (typeof row.wkt === 'undefined') ? '' : row.wkt.value.replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>','');
    }

    for (let i = 0; i < formattedResults.length; i++) {
        formattedResults[i]['wkt'] = wktResults[formattedResults[i]['place']];
    }

    let countResults = await query(`select (count(*) as ?count) { ` + placeQuery + ` LIMIT ` + recordNum*10 + `}`);
    return { 'count': countResults[0].count.value, 'record': formattedResults };
}

//New search function for hazard in stko-kwg
async function getHazardSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];
    
    let hazardQuery = `select distinct * where {`;

    //Keyword search
    if (parameters["keyword"] != "") {
        hazardQuery +=
            `
        ?search a elastic-index:kwg_staging_es_index-copy;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        `;
    }

    //Filters out the types of hazards
    let typeQuery = ``;
    let hazardTypes = parameters["hazardTypes"];

    if (parameters["hazardTypes"].length > 0)
    {
        let setHazardTypes = new Set(hazardTypes);
        shouldUseInference = true;
        typeQuery += `filter (?type in (kwg-ont:` + Array.from(setHazardTypes).join(', kwg-ont:') + `))`;
    }

    //These filters handle search by place type (regions, zipcode, fips, nwz, uscd)
    let placeEntities = [];
    if (parameters["facetRegions"].length > 0) {
        placeEntities = parameters["facetRegions"];
    }
    if (parameters["placeFacetsZip"] != "") {
        entityAll = await getZipCodeArea();
        if (typeof entityAll['zipcodes'][parameters["placeFacetsZip"]] === 'undefined')
        {
            placeEntities.push(``);
        }
        else
        {
            entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
            placeEntities.push(entityArray[entityArray.length - 1]);
        }
    }
    if (parameters["placeFacetsFIPS"] != "") {
        entityAll = await getFIPS();
        if (typeof entityAll['fips'][parameters["placeFacetsFIPS"]] === 'undefined')
        {
            placeEntities.push(``);
        }
        else
        {
            entityArray = entityAll['fips'][parameters["placeFacetsFIPS"]].split("/");
            placeEntities.push(entityArray[entityArray.length - 1]);
        }
    }
    if (parameters["placeFacetsUSCD"] != "") {
        entityAll = await getUSClimateDivision();
        if (typeof entityAll['divisions'][parameters["placeFacetsUSCD"]] === 'undefined')
        {
            placeEntities.push(``);
        }
        else
        {
            entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
            placeEntities.push(entityArray[entityArray.length - 1]);
        }
    }
    if (parameters["placeFacetsNWZ"] != "") {
        entityAll = await getNWZone();
        if (typeof entityAll['nwzones'][parameters["placeFacetsNWZ"]] === 'undefined')
        {
            placeEntities.push(``);
        }
        else
        {
            entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
            placeEntities.push(entityArray[entityArray.length - 1]);
        }
    }

    // return 0 result if no places satisfy the inputs
    if (Array.from(new Set(placeEntities))[0] == `` && Array.from(new Set(placeEntities)).length == 1)
    {
        return { 'count': 0, 'record': {} };
    }

    let placeSearchQuery = ``;
    if (parameters["facetGNIS"].length > 0)
    {
        let gnisTypeArray = parameters["facetGNIS"];
        for (i = 0; i < gnisTypeArray.length; i++)
        {
            gnisTypeArray[i] = gnisTypeArray[i].replace(' ','');
        }

        let gnisFilter = ``;
        if (parameters["keyword"] != "") {
            gnisFilter = `filter not exists {filter contains(?gnisEntity_label,"${parameters["keyword"]}")}`;
        }

        placeSearchQuery += `
            ?entity kwg-ont:sfWithin ?s2Cell .
            ?s2Cell rdf:type kwg-ont:KWGCellLevel13;
                    kwg-ont:sfWithin|kwg-ont:sfCrosses|kwg-ont:sfOverlaps|kwg-ont:sfContains ?gnisEntity.
            ?gnisEntity kwg-ont:sfWithin ?s2cellGNIS;
                        rdf:type ?gnisPlaceType;
                        rdfs:label ?gnisEntity_label.
            values ?gnisPlaceType {usgs:` + gnisTypeArray.join(' usgs:') + `}
                    ${gnisFilter}
        `;
        if (placeEntities.length > 0)
        {
            let placesConnectedToS2 = [];
            let placesLocatedIn = [];
            for (let i = 0 ; i < placeEntities.length; i++)
            {
                if (placeEntities[i].startsWith('zipcode') || placeEntities[i].startsWith('noaaClimateDiv'))
                {
                    placesConnectedToS2.push(placeEntities[i]);
                }
                if (placeEntities[i].startsWith('Earth') || placeEntities[i].startsWith('NWZone'))
                {
                    placesLocatedIn.push(placeEntities[i]);
                }
            }
            if (placesConnectedToS2.length > 0)
            {
                placeSearchQuery += `
                    ?s2cellGNIS rdf:type kwg-ont:KWGCellLevel13 .
                    values ?placesConnectedToS2 {kwgr:` + placesConnectedToS2.join(' kwgr:') + `}
                    ?s2cellGNIS kwg-ont:sfWithin|kwg-ont:sfCrosses|kwg-ont:sfOverlaps|kwg-ont:sfContains ?placesConnectedToS2.
                `;  
            }
            if (placesLocatedIn.length > 0)
            {
                placeSearchQuery += `
                    ?s2cellGNIS kwg-ont:sfWithin|kwg-ont:sfCrosses|kwg-ont:sfOverlaps|kwg-ont:sfContains ?placesNonConnectedToS2.
                    values ?placesNonConnectedToS2 {kwgr:` + placesLocatedIn.join(' kwgr:') + `}
                `;
            }
        }
    }
    else if (placeEntities.length > 0)
    {
        let placesConnectedToS2 = [];
        let placesLocatedIn = [];
        for (let i = 0 ; i < placeEntities.length; i++)
        {
            if (placeEntities[i].startsWith('zipcode') || placeEntities[i].startsWith('noaaClimateDiv'))
            {
                placesConnectedToS2.push(placeEntities[i]);
            }
            if (placeEntities[i].startsWith('Earth') || placeEntities[i].startsWith('NWZone'))
            {
                placesLocatedIn.push(placeEntities[i]);
            }
        }
        if (placesConnectedToS2.length > 0)
        {
            placeSearchQuery += `
                ?entity kwg-ont:sfWithin ?s2Cell .
                ?s2Cell rdf:type kwg-ont:KWGCellLevel13 .
                values ?placesConnectedToS2 {kwgr:` + placesConnectedToS2.join(' kwgr:') + `}
                ?s2Cell kwg-ont:sfWithin|kwg-ont:sfCrosses|kwg-ont:sfOverlaps|kwg-ont:sfContains ?placesConnectedToS2.
            `;  
        }
        if (placesLocatedIn.length > 0)
        {
            placeSearchQuery += `
                values ?places {kwgr:` + placesLocatedIn.join(' kwgr:') + `}
            `;
        }
    }


    //Filter by the date hazard occurred
    let dateQuery = '';
    if (parameters["hazardFacetDateStart"] != "" || parameters["hazardFacetDateEnd"] != "") {
        let dateArr = [];
        if (parameters["hazardFacetDateStart"] != "") {
            dateArr.push(`(?startTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime || ?startTimeLabel > "` + parameters["hazardFacetDateStart"] + `"^^xsd:date)`);
            dateArr.push(`(?endTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime || ?endTimeLabel > "` + parameters["hazardFacetDateStart"] + `"^^xsd:date)`);
        }
        if (parameters["hazardFacetDateEnd"] != "") {
            dateArr.push(`("` + parameters["hazardFacetDateEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?startTimeLabel || "`+ parameters["hazardFacetDateEnd"] + `"^^xsd:date > ?startTimeLabel)`);
            dateArr.push(`("` + parameters["hazardFacetDateEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?endTimeLabel || "`+ parameters["hazardFacetDateEnd"] + `"^^xsd:date > ?endTimeLabel)`);
        }
        dateQuery = `
            ?observationCollection sosa:phenomenonTime ?time.
            ?time time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                  time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
            FILTER (` + dateArr.join(' && ') + `)`;
    }

    //Filter by a circle on the map
    let spatialSearchQuery = '';
    if (typeof parameters["spatialSearchWkt"] != 'undefined') {
        spatialSearchQuery += `
            ?entity geo:sfWithin '${parameters["spatialSearchWkt"]}'^^geo:wktLiteral.
        `;
    }

    //Build the full query
    hazardQuery += `
        ?entity rdf:type ?type; 
                rdfs:label ?label;
                kwg-ont:hasTemporalScope|sosa:isFeatureOfInterestOf/sosa:phenomenonTime|time:hasBeginning ?time;
                geo:hasGeometry/geo:asWKT ?wkt.
        ?type rdfs:subClassOf kwg-ont:Hazard;
              rdfs:label ?typeLabel.
        optional
        {
            ?entity kwg-ont:sfWithin ?place.
            ?place rdfs:label ?placeLabel.
            filter not exists {filter contains(?placeLabel,"S2 Cell") }
        }
        ?time time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
        ${typeQuery}
        ${placeSearchQuery}
        ${dateQuery}
        ${hazardTypeFacets(parameters)}
        ${spatialSearchQuery}
    }`;

    let queryResults = await query(hazardQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);

    for (let row of queryResults) {
        formattedResults.push({
            'hazard': row.entity.value,
            'hazard_name': row.label.value,
            'hazard_type': row.type.value,
            'hazard_type_name': row.typeLabel.value,
            'place':(typeof row.place === 'undefined') ? '' : row.place.value,
            'place_name':(typeof row.placeLabel === 'undefined') ? '' : row.placeLabel.value,
            'start_date':row.time.value,
            'start_date_name':row.startTimeLabel.value,
            'end_date':row.time.value,
            'end_date_name':row.endTimeLabel.value,      
            'wkt':row.wkt.value.replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>','')
        });
    }

    let countResults = await query(`select (count(*) as ?count) { ` + hazardQuery + ` LIMIT ` + recordNum*10 + `}`);
      return { 'count': countResults[0].count.value, 'record': formattedResults };
}

//These are facet searches that are unique to a specific hazard type (fire, earthquake, etc)
function hazardTypeFacets(parameters) {
    let typedHazardQuery = ``;

    if (parameters["hazardFacetMagnitudeMin"] != "" || parameters["hazardFacetMagnitudeMax"] != "") {
        let facetArr = [];
        if (parameters["hazardFacetMagnitudeMin"] != "")
            facetArr.push(`xsd:decimal(STR(?magnitude)) > ` + parameters["hazardFacetMagnitudeMin"]);
        if (parameters["hazardFacetMagnitudeMax"] != "")
            facetArr.push(parameters["hazardFacetMagnitudeMax"] + ` > xsd:decimal(STR(?magnitude))`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?magnitudeObj.
            ?magnitudeObj sosa:observedProperty kwgr:EarthquakeObservableProperty.mag.
            ?magnitudeObj sosa:hasSimpleResult ?magnitude FILTER (` + facetArr.join(' && ') + `).`;
    }

    if (parameters["hazardQuakeDepthMin"] != "" || parameters["hazardQuakeDepthMax"] != "") {
        let facetArr = [];
        if (parameters["hazardQuakeDepthMin"] != "")
            facetArr.push(`xsd:decimal(STR(?quakeDepth)) > ` + parameters["hazardQuakeDepthMin"]);
        if (parameters["hazardQuakeDepthMax"] != "")
            facetArr.push(parameters["hazardQuakeDepthMax"] + ` > xsd:decimal(STR(?quakeDepth))`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?quakeDepthObj.
            ?quakeDepthObj sosa:observedProperty kwgr:EarthquakeObservableProperty.depth.
            ?quakeDepthObj sosa:hasSimpleResult ?quakeDepth FILTER (` + facetArr.join(' && ') + `).`;
    }

    if (parameters["hazardFacetAcresBurnedMin"] != "" || parameters["hazardFacetAcresBurnedMax"] != "") {
        let facetArr = [];
        if (parameters["hazardFacetAcresBurnedMin"] != "")
            facetArr.push(`?numAcresBurned > ` + parameters["hazardFacetAcresBurnedMin"]);
        if (parameters["hazardFacetAcresBurnedMax"] != "")
            facetArr.push(parameters["hazardFacetAcresBurnedMax"] + ` > ?numAcresBurned`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?numAcresBurnedObj.
            #?numAcresBurnedObj rdfs:label ?numAcresBurnedObjLabel.
            ?numAcresBurnedObj sosa:observedProperty kwgr:mtbsFireObservableProperty.NumberOfAcresBurned.
            ?numAcresBurnedObj sosa:hasSimpleResult ?numAcresBurned FILTER (` + facetArr.join(' && ') + `).`;
    }

    if (parameters["hazardFacetMeanDnbrMin"] != "" || parameters["hazardFacetMeanDnbrMax"] != "") {
        let facetArr = [];
        if (parameters["hazardFacetMeanDnbrMin"] != "")
            facetArr.push(`?meanVal > ` + parameters["hazardFacetMeanDnbrMin"]);
        if (parameters["hazardFacetMeanDnbrMax"] != "")
            facetArr.push(parameters["hazardFacetMeanDnbrMax"] + ` > ?meanVal`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?meanValObj.
            #?meanValObj rdfs:label ?meanValObjLabel.
            ?meanValObj sosa:observedProperty kwgr:mtbsFireObservableProperty.MeandNBRValue.
            ?meanValObj sosa:hasSimpleResult ?meanVal FILTER (` + facetArr.join(' && ') + `).`;
    }

    if (parameters["hazardFacetSDMeanDnbrMin"] != "" || parameters["hazardFacetSDMeanDnbrMax"] != "") {
        let facetArr = [];
        if (parameters["hazardFacetSDMeanDnbrMin"] != "")
            facetArr.push(`?stanDevMeanVal > ` + parameters["hazardFacetSDMeanDnbrMin"]);
        if (parameters["hazardFacetSDMeanDnbrMax"] != "")
            facetArr.push(parameters["hazardFacetSDMeanDnbrMax"] + ` > ?stanDevMeanVal`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?stanDevMeanValObj.
            #?stanDevMeanValObj rdfs:label ?stanDevMeanValObjLabel.
            ?stanDevMeanValObj sosa:observedProperty kwgr:mtbsFireObservableProperty.StandardDeviationOfMeandNBRValue.
            ?stanDevMeanValObj sosa:hasSimpleResult ?stanDevMeanVal FILTER (` + facetArr.join(' && ') + `).`;
    }

    if (parameters["hazardFacetNumberDeathsMin"] != "" || parameters["hazardFacetNumberDeathsMax"] != "") {
        let facetArr = [];
        if (parameters["hazardFacetNumberDeathsMin"] != "")
            facetArr.push(`?deathDirectVal > ` + parameters["hazardFacetNumberDeathsMin"]);
        if (parameters["hazardFacetNumberDeathsMax"] != "")
            facetArr.push(parameters["hazardFacetNumberDeathsMax"] + ` > ?deathDirectVal`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?deathDirectValObj.
            #?deathDirectValObj rdfs:label ?deathDirectValObjLabel.
            ?deathDirectValObj sosa:observedProperty kwgr:impactObservableProperty.deathDirect.
            ?deathDirectValObj sosa:hasSimpleResult ?deathDirectVal FILTER (` + facetArr.join(' && ') + `).`;
    }

    if (parameters["hazardFacetNumberInjuredMin"] != "" || parameters["hazardFacetNumberInjuredMax"] != "") {
        let facetArr = [];
        if (parameters["hazardFacetNumberInjuredMin"] != "")
            facetArr.push(`?injuryDirectVal > ` + parameters["hazardFacetNumberInjuredMin"]);
        if (parameters["hazardFacetNumberInjuredMax"] != "")
            facetArr.push(parameters["hazardFacetNumberInjuredMax"] + ` > ?injuryDirectVal`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?injuryDirectValObj.
            #?injuryDirectValObj rdfs:label ?injuryDirectValObjLabel.
            ?injuryDirectValObj sosa:observedProperty kwgr:impactObservableProperty.injuryDirect.
            ?injuryDirectValObj sosa:hasSimpleResult ?injuryDirectVal FILTER (` + facetArr.join(' && ') + `).`;
    }

    if (typedHazardQuery != ``)
    {
        typedHazardQuery += `
            ?entity sosa:isFeatureOfInterestOf ?observationCollection.
        `;
    }
    return typedHazardQuery;
}
/**
* Gets all of the hazards and their respective subclasses.
* top_hazard is the topmost hazard class (ie 'Fire')
* middle_hazard are subclasses of the top_hazard
* lower_hazard are subclasses of the middle_hazard
* 
* @returns
*/
async function getHazardClasses() {

  let data = await fetch("/cache/hazards.json");
  return data.json();
}

//New search function for expert in stko-kwg
async function getExpertSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let topicQuery = '';
    if (parameters["expertTopics"].length > 0) {
        topicQuery = `values ?expert {kwgr:` + parameters["expertTopics"].join(' kwgr:') + `}`;
    }

    let expertQuery = `select distinct ?label ?entity ?affiliation ?affiliationLabel ?affiliationLoc ?affiliationLoc_label ?wkt
    (group_concat(distinct ?expert; separator = "||") as ?expertise)
    (group_concat(distinct ?expertLabel; separator = "||") as ?expertiseLabel)
    where {`;

    if (parameters["keyword"] != "") {
        expertQuery +=
            `
        ?search a elastic-index:kwg_staging_es_index-copy;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        `;
    }

    // use ?affiliation instead of ?entity for expert spatial search
    let spatialSearchQuery = '';
    if (typeof parameters["spatialSearchWkt"] != 'undefined') {
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
        ?affiliation rdfs:label ?affiliationLabel;
                     kwg-ont:sfWithin ?affiliationLoc;
        			 geo:hasGeometry/geo:asWKT ?wkt.
    	?affiliationLoc rdf:type ?affiliationLoc_type;
                     	rdfs:label ?affiliationLoc_label.
    	values ?affiliationLoc_type {kwg-ont:AdministrativeRegion_3}
        filter not exists {filter contains(?expertLabel,":")}
        ${spatialSearchQuery}
    } GROUP BY ?label ?entity ?affiliation ?affiliationLabel ?affiliationLoc ?affiliationLoc_label ?wkt`;


    let queryResults = await query(expertQuery + ` LIMIT` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);
    for (let row of queryResults) {
        formattedResults.push({
            'expert': row.entity.value,
            'expert_name': row.label.value,
            'affiliation': (typeof row.affiliation === 'undefined') ? " " : row.affiliation.value,
            'affiliation_name': (typeof row.affiliationLabel === 'undefined') ? " " : row.affiliationLabel.value,
            'expertise': row.expertise.value.split('||').slice(0,10),
            'expertise_name': row.expertiseLabel.value.split('||').slice(0,10),
            'place': row.affiliationLoc.value,
            'place_name': row.affiliationLoc_label.value,
            'wkt': (typeof row.wkt === 'undefined') ? "" : row.wkt.value,
        });
    }

    let countResults = await query(`select (count(*) as ?count) { ` + expertQuery + `}`);
    return { 'count': countResults[0].count.value, 'record': formattedResults };
}

async function getExpertTopics() {
    let formattedResults = [];

    let topicQuery = `
    select distinct ?topic ?label ?subtopic ?sublabel where {
        ?topic rdf:type kwg-ont:ExpertiseTopic;
               kwg-ont:hasSubTopic ?subtopic;
        	   rdfs:label ?label.
        ?subtopic rdfs:label ?sublabel.
    } ORDER BY ASC(?label)`;

    let queryResults = await query(topicQuery);
    for (let row of queryResults) {
        let topicShortArray = row.topic.value.split("/");
        let topicShort = topicShortArray[topicShortArray.length - 1];
        let subTopicShortArray = row.subtopic.value.split("/");
        let subTopicShort = subTopicShortArray[subTopicShortArray.length - 1];
        if (topicShort in formattedResults) {
            //We already have this expertise topic, which means we need to grab their subtopics
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

    return { 'topics': Object.values(formattedResults) };
}
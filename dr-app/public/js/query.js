<<<<<<< HEAD
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
<<<<<<< HEAD
<<<<<<< HEAD
    usgs:'http://gnis-ld.org/lod/usgs/ontology/',
=======
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
    usgs:'http://gnis-ld.org/lod/usgs/ontology/',
>>>>>>> 5a9d4f2e (Enable url parameter update, place/hazard query execution, and link GNIS facets with facet query results when selecting GNIS facets)
    'elastic-index': 'http://www.ontotext.com/connectors/elasticsearch/instance#',
    'iospress': 'http://ld.iospress.nl/rdf/ontology/',
};

let S_PREFIXES = '';
for (let [si_prefix, p_prefix_iri] of Object.entries(H_PREFIXES)) {
    S_PREFIXES += `prefix ${si_prefix}: <${p_prefix_iri}>\n`;
}

// SPARQL endpoint
<<<<<<< HEAD
<<<<<<< HEAD
const P_ENDPOINT = 'https://stko-kwg.geog.ucsb.edu/graphdb/repositories/KWG';

/**
 * Performs a SPARQL query
 * 
 * @param {string} srq_query The query that is being performed
 * @returns 
 */
async function query(srq_query) {
    let d_form = new FormData();
    d_form.append('query', S_PREFIXES + srq_query);
    d_form.append('infer', true);
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
=======
const P_ENDPOINT = 'https://stko-kwg.geog.ucsb.edu/sparql';
=======
const P_ENDPOINT = 'https://stko-kwg.geog.ucsb.edu/graphdb/repositories/KWG-Staging';
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)

var infer = 'false';
// query
async function query(srq_query) {
    let d_form = new FormData();
    d_form.append('query', S_PREFIXES + srq_query);
<<<<<<< HEAD

=======
    d_form.append('infer', infer); // disable inference
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
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

>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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
<<<<<<< HEAD
<<<<<<< HEAD
                    rdfs:label ?place_label.
=======
                    kwg-ont:hasZipCode ?place_label.
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
                    rdfs:label ?place_label.
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
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
<<<<<<< HEAD
<<<<<<< HEAD
                ?hazard rdf:type kwg-ont:Earthquake;
=======
                ?hazard rdf:type kwg-ont:EarthquakeEvent;
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
                ?hazard rdf:type kwg-ont:Earthquake;
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
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
<<<<<<< HEAD
<<<<<<< HEAD
                ?hazard rdf:type kwg-ont:NOAAHurricane;
=======
                ?hazard rdf:type kwg-ont:Hurricane;
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
                ?hazard rdf:type kwg-ont:NOAAHurricane;
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
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
<<<<<<< HEAD
=======
    if (typeof(row) == "undefined") {
        row = {
            'expert': { 'value': 'http://stko-kwg.geog.ucsb.edu/lod/resource/expert.1750909092' },
            'expert_label': { 'value': 'Chenyang Cao' }
        };
    }
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)

    formattedResults[row.expert_label.value] = row.expert.value;

    return { 'randomExpert': formattedResults };
}

async function getRandomWildfire() {
    let formattedResults = {};

    let randomWildfireQuery = `
    select distinct ?wildfire ?wildfire_label
    {
<<<<<<< HEAD
        ?wildfire rdf:type kwg-ont:MTBSWildfire;
=======
        ?wildfire rdf:type kwg-ont:Wildfire;
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
                rdfs:label ?wildfire_label.
    } ORDER BY RAND() LIMIT 1`;

    let queryResults = await query(randomWildfireQuery);

    let row = queryResults[0];
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======

    if (typeof(row) == "undefined") {
        row = {
            'wildfire': { 'value': 'http://stko-kwg.geog.ucsb.edu/lod/resource/hazard.162134.978925' },
            'wildfire_label': { 'value': 'Wildfire Occurred in POWDER RIVER from 2021-08-08-1330 to 2021-08-21-0700, MST' }
        };
    }

>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
    formattedResults[row.wildfire_label.value] = row.wildfire.value;

    return { 'randomWildfire': formattedResults };
}

async function getRandomEarthquake() {
    let formattedResults = {};

    let randomEarthquakeQuery = `
    select distinct ?earthquake ?earthquake_label
    {
<<<<<<< HEAD
<<<<<<< HEAD
        ?earthquake rdf:type kwg-ont:Earthquake;
=======
        ?earthquake rdf:type kwg-ont:EarthquakeEvent;
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
        ?earthquake rdf:type kwg-ont:Earthquake;
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
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
<<<<<<< HEAD
                kwg-ont:hasExpertise kwgr:topic.covid19;
=======
                kwg-ont:hasExpertise kwgr:hazardtopic.storm.aspecttopic.injury;
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
                rdfs:label ?expert_label.
    } ORDER BY RAND() LIMIT 1`;

    let queryResults = await query(randomExpertQuery);

    let row = queryResults[0];
<<<<<<< HEAD
=======
    if (typeof(row) == "undefined") {
        row = {
            'expert': { 'value': 'http://stko-kwg.geog.ucsb.edu/lod/resource/expert.14838165' },
            'expert_label': { 'value': 'Zhonghua Mao' }
        };
    }
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)

    formattedResults[row.expert_label.value] = row.expert.value;

    return { 'randomExpert': formattedResults };
}

async function getAdministrativeRegion() {
    let formattedResults = {};

    let regionQuery = `
    select ?a3 ?a3Label ?a2 ?a2Label ?a1 ?a1Label where {
        ?a3 rdf:type kwg-ont:AdministrativeRegion_3 .
<<<<<<< HEAD
<<<<<<< HEAD
        ?a3 kwg-ont:sfWithin ?a2 .
        ?a2 kwg-ont:sfWithin ?a1.
=======
        ?a3 kwg-ont:locatedIn ?a2 .
        ?a2 kwg-ont:locatedIn ?a1.
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
        ?a3 kwg-ont:sfWithin ?a2 .
        ?a2 kwg-ont:sfWithin ?a1.
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 59a7ac68 (Enable autocomplete search for administrative regions)
async function getNonHierarchicalAdministrativeRegion() {
    let formattedResults = [];

    let adminQuery = `
    select distinct ?admin ?admin_label
    {
        {
            ?admin rdf:type kwg-ont:AdministrativeRegion_2;
                   rdfs:label ?admin_label;
<<<<<<< HEAD
<<<<<<< HEAD
                   kwg-ont:sfWithin kwgr:Earth.North_America.United_States.USA.
=======
                   kwg-ont:locatedIn kwgr:Earth.North_America.United_States.USA.
>>>>>>> 59a7ac68 (Enable autocomplete search for administrative regions)
=======
                   kwg-ont:sfWithin kwgr:Earth.North_America.United_States.USA.
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
        }
        UNION
        {
            ?admin rdf:type kwg-ont:AdministrativeRegion_3;
                   rdfs:label ?admin_label;
<<<<<<< HEAD
<<<<<<< HEAD
                   kwg-ont:sfWithin ?admin_upper_level.
            ?admin_upper_level kwg-ont:sfWithin kwgr:Earth.North_America.United_States.USA.
=======
                   kwg-ont:locatedIn ?admin_upper_level.
            ?admin_upper_level kwg-ont:locatedIn kwgr:Earth.North_America.United_States.USA.
>>>>>>> 59a7ac68 (Enable autocomplete search for administrative regions)
=======
                   kwg-ont:sfWithin ?admin_upper_level.
            ?admin_upper_level kwg-ont:sfWithin kwgr:Earth.North_America.United_States.USA.
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
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

<<<<<<< HEAD
=======
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
>>>>>>> 59a7ac68 (Enable autocomplete search for administrative regions)
async function getZipCodeArea() {
    let formattedResults = [];

    let zipcodeQuery = `
    select distinct ?zipcode ?zipcodeArea where {
        ?zipcodeArea rdf:type kwg-ont:ZipCodeArea;
<<<<<<< HEAD
<<<<<<< HEAD
                     rdfs:label ?zipcode.
=======
                     kwg-ont:hasZipCode ?zipcode.
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
                     rdfs:label ?zipcode.
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
    } ORDER BY ASC(?zipcode)`;

    // use cached data for now
    // let queryResults = await query(zipcodeQuery);
    zipcode_areas_json = await fetch("/cache/zipcode_areas.json");
    zipcode_areas_cached = await zipcode_areas_json.json();
    let queryResults = zipcode_areas_cached.results.bindings;

    for (let row of queryResults) {
        let zipcode = row.zipcode.value;
<<<<<<< HEAD
<<<<<<< HEAD
        zipcode = zipcode.substring(9);
=======
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
        zipcode = zipcode.substring(9);
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
        let zipcodeArea = row.zipcodeArea.value;
        formattedResults[zipcode] = zipcodeArea;
    }

    return { 'zipcodes': formattedResults };
}

<<<<<<< HEAD
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

=======
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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
<<<<<<< HEAD
=======

>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
    for (let row of queryResults) {
        let division = row.division.value;
        let division_label = row.division_label.value;
        formattedResults[division_label] = division;
    }
<<<<<<< HEAD
=======

>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fbf3a2a0 (Add autocomplete search for GNIS features)
async function getGNISFeature() {
    let formattedResults = [];

    let gnisQuery = `
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5a9d4f2e (Enable url parameter update, place/hazard query execution, and link GNIS facets with facet query results when selecting GNIS facets)
    select distinct ?gnisFeatureType ?gnisFeatureType_label ?gnisFeatureSuperType ?gnisFeatureSuperType_label
    {
        ?gnisFeatureType rdfs:subClassOf ?gnisFeatureSuperType;
                         rdfs:label ?gnisFeatureType_label.
        ?gnisFeatureSuperType rdfs:label ?gnisFeatureSuperType_label.
<<<<<<< HEAD
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

=======
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
    select distinct ?gnisFeature ?gnisFeature_label where {
        ?gnisFeature rdf:type ?gnisFeatureType;
                     rdfs:label ?gnisFeature_label.
        ?gnisFeatureType rdfs:subClassOf ?gnisFeatureSuperType.
=======
>>>>>>> 5a9d4f2e (Enable url parameter update, place/hazard query execution, and link GNIS facets with facet query results when selecting GNIS facets)
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

>>>>>>> fbf3a2a0 (Add autocomplete search for GNIS features)
//New search function for place in stko-kwg
async function getPlaceSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

<<<<<<< HEAD
<<<<<<< HEAD
    let placeQuery = `select distinct ?entity ?label ?quantifiedName ?type ?typeLabel where {`;

    if (parameters["keyword"] != "") {
        placeQuery += `
        ?search a elastic-index:kwg_fs_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        ?entity elastic:score ?score.
        `;
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
                            kwg-ont:spatialRelation ?placesConnectedToS2.
                    ?placesConnectedToS2 kwg-ont:sfWithin ?superPlacesConnectedToS2.
                `;
                let placesConnectedToS2 = [];
        
                if (parameters["placeFacetsRegion"] != "") {
                    entityAll = await query(`
                    select ?entity ?score
                    {
                        ?search a elastic-index:kwg_fs_index;
                        elastic:query "${parameters["placeFacetsRegion"]}";
                        elastic:entities ?entity.
                        ?entity elastic:score ?score.
                        
                        ?entity a ?type; rdfs:label ?label;
                        OPTIONAL { ?entity kwg-ont:quantifiedName ?quantifiedName. }
                        values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3}
                        ?type rdfs:label ?typeLabel
                    } order by desc(?score)`);
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
                placeQuery += `filter (?placesConnectedToS2 in (${placesConnectedToS2.join(', ')}) || ?superPlacesConnectedToS2 in (${placesConnectedToS2.join(', ')}))`;
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
                    ?search a elastic-index:kwg_fs_index;
                    elastic:query "${parameters["placeFacetsRegion"]}";
                    elastic:entities ?entity.
                    
                    ?entity a ?type; rdfs:label ?label;
                    OPTIONAL { ?entity kwg-ont:quantifiedName ?quantifiedName. }
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
                optional
                {
                    ?entity kwg-ont:quantifiedName ?quantifiedName.
                }
                values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3 kwg-ont:ZipCodeArea kwg-ont:USClimateDivision kwg-ont:NWZone}
                ?type rdfs:label ?typeLabel
            }`;
        }
    }


=======
    let placeQuery = `select ?label ?type ?typeLabel ?entity where {`;
=======
    let placeQuery = `select distinct ?entity ?label ?type ?typeLabel where {`;
>>>>>>> f3e47053 ((1) Reorder the place facets in the front-end (2) Correct GNIS logic in place search)

    if (parameters["keyword"] != "") {
        placeQuery += `
        ?search a elastic-index:kwg_staging_es_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.`;
    }

<<<<<<< HEAD
<<<<<<< HEAD
    if (parameters["placeFacetsRegion"] != "" | parameters["placeFacetsUSCD"] != "" | parameters["placeFacetsNWZ"] != "" | parameters["placeFacetsZip"] != "")
=======
    if (parameters["placeFacetsRegion"] != "" | parameters["facetGNIS"].length > 0 | parameters["placeFacetsUSCD"] != "" | parameters["placeFacetsNWZ"] != "" | parameters["placeFacetsZip"] != "")
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
=======
    if (parameters["facetGNIS"].length > 0)
>>>>>>> f3e47053 ((1) Reorder the place facets in the front-end (2) Correct GNIS logic in place search)
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
<<<<<<< HEAD
                ?entity rdf:type ?type; rdfs:label ?label.
                values ?entity {kwgr:` + entity + `}
                ?type rdfs:label ?typeLabel.
                values ?type {kwg-ont:ZipCodeArea}
            }`);
        }
        if (parameters["placeFacetsUSCD"] != "") {
            entityAll = await getUSClimateDivision();
            entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
            entity = entityArray[entityArray.length - 1];
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
            entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
            entity = entityArray[entityArray.length - 1];
            typeQueries.push(`
            {
                ?entity rdf:type ?type; rdfs:label ?label.
                values ?entity {kwgr:` + entity + `}
                ?type rdfs:label ?typeLabel.
                values ?type {kwg-ont:NWZone}
            }`);
        }
        placeQuery += typeQueries.join(' union ');
=======
                placeQuery +=  `
                    ?entity kwg-ont:sfWithin ?s2cell.
                    ?s2cell rdf:type kwg-ont:KWGCellLevel13;
                            kwg-ont:sfWithin ?placesConnectedToS2.
                `;
                let placesConnectedToS2 = [];
        
                if (parameters["placeFacetsRegion"] != "") {
                    entityAll = await query(`
                    select ?entity
                    {
                        ?search a elastic-index:kwg_staging_es_index;
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
                    entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
                    entity = entityArray[entityArray.length - 1];
                    placesConnectedToS2.push(`kwgr:` + entity);
                }
                if (parameters["placeFacetsFIPS"] != "") {
                    entityAll = await getFIPS();
                    entityArray = entityAll['fips'][parameters["placeFacetsFIPS"]].split("/");
                    entity = entityArray[entityArray.length - 1];
                    placesConnectedToS2.push(`kwgr:` + entity);
                }
                if (parameters["placeFacetsUSCD"] != "") {
                    entityAll = await getUSClimateDivision();
                    entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
                    entity = entityArray[entityArray.length - 1];
                    placesConnectedToS2.push(`kwgr:` + entity);
                }
                if (parameters["placeFacetsNWZ"] != "") {
                    entityAll = await getNWZone();
                    entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
                    entity = entityArray[entityArray.length - 1];
                    placesConnectedToS2.push(`kwgr:` + entity);
                }
                placeQuery += `values ?placesConnectedToS2 {${placesConnectedToS2.join(' ')}}`;
            }
>>>>>>> f3e47053 ((1) Reorder the place facets in the front-end (2) Correct GNIS logic in place search)
    }
    else
    {
        if (parameters["placeFacetsRegion"] != "" | parameters["placeFacetsUSCD"] != "" | parameters["placeFacetsNWZ"] != "" | parameters["placeFacetsZip"] != "")
        {
            let typeQueries = [];
    
            if (parameters["placeFacetsRegion"] != "") {
                typeQueries.push(`
                {
                    ?search a elastic-index:kwg_staging_es_index;
                    elastic:query "${parameters["placeFacetsRegion"]}";
                    elastic:entities ?entity.
                    
                    ?entity a ?type; rdfs:label ?label.
                    values ?type {kwg-ont:AdministrativeRegion_2 kwg-ont:AdministrativeRegion_3}
                    ?type rdfs:label ?typeLabel
                }`);
            }
            if (parameters["placeFacetsZip"] != "") {
                entityAll = await getZipCodeArea();
                entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
                entity = entityArray[entityArray.length - 1];
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
                entityArray = entityAll['fips'][parameters["placeFacetsFIPS"]].split("/");
                entity = entityArray[entityArray.length - 1];
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
                entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
                entity = entityArray[entityArray.length - 1];
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
                entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
                entity = entityArray[entityArray.length - 1];
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

<<<<<<< HEAD
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======

>>>>>>> f3e47053 ((1) Reorder the place facets in the front-end (2) Correct GNIS logic in place search)
    if (typeof parameters["spatialSearchWkt"] != 'undefined') {
        placeQuery += `
            ?entity geo:sfWithin '${parameters["spatialSearchWkt"]}'^^geo:wktLiteral.
        `;
    }
<<<<<<< HEAD

    // Close the main query
    placeQuery += `}`;

    // If the user included a keyword search, sort them by the most relevant string results from ES
    if (parameters["keyword"] != "") {
      placeQuery += ` order by desc(?score)`;
    }

    let queryResults = await query(placeQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);

    let entityRawValues = [];
    for (let row of queryResults) {
        entityRawValues.push(row.entity.value);
        formattedResults.push({
            'place': row.entity.value,
            'place_name': (typeof row.quantifiedName === 'undefined') ? row.label.value : row.quantifiedName.value,
=======
    placeQuery += `}`;

    console.log(placeQuery);

    let queryResults = await query(placeQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);

    let entityRawValues = [];
    for (let row of queryResults) {
        //let entityArray = row.entity.value.split("/");
        //entityRawValues.push('kwgr:' + entityArray[entityArray.length - 1]);
        entityRawValues.push(row.entity.value);
        formattedResults.push({
            'place': row.entity.value,
            'place_name': row.label.value,
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
            'place_type': row.type.value,
            'place_type_name': row.typeLabel.value,
        });
    }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2f77a12b (Correct errors when no GNIS features are found within the selected areas)
    if (entityRawValues.length == 0)
    {
        return { 'count': 0, 'record': {} };
    }
<<<<<<< HEAD

    let wktQuery = await query(`select ?entity ?wkt where { ?entity geo:hasGeometry/geo:asWKT ?wkt. values ?entity {<${entityRawValues.join('> <')}>} }`);

    let wktResults = {};
    for (let row of wktQuery) {
        wktResults[row.entity.value] = (typeof row.wkt === 'undefined') ? '' : row.wkt.value.replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>','');
=======
    let wktQuery = await query(`select ?entity ?wkt where { ?entity geo:hasGeometry/geo:asWKT ?wkt. values ?entity {${entityRawValues.join(' ')}} }`);
    let wktResults = {};
    for (let row of wktQuery) {
        wktResults[row.entity.value] = (typeof row.wkt === 'undefined') ? '' : row.wkt.value;
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
=======
>>>>>>> 2f77a12b (Correct errors when no GNIS features are found within the selected areas)
    infer = 'true'; // the parameter infer is temporarily set to be true.
    let wktQuery = await query(`select ?entity ?wkt where { ?entity geo:hasGeometry/geo:asWKT ?wkt. values ?entity {<${entityRawValues.join('> <')}>} }`);
    infer = 'false';

    let wktResults = {};
    for (let row of wktQuery) {
        wktResults[row.entity.value] = (typeof row.wkt === 'undefined') ? '' : row.wkt.value.replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>','');
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
    }

    for (let i = 0; i < formattedResults.length; i++) {
        formattedResults[i]['wkt'] = wktResults[formattedResults[i]['place']];
    }

<<<<<<< HEAD
    let countResults = await query(`select (count(*) as ?count) { ` + placeQuery + ` LIMIT ` + recordNum*10 + `}`);
=======
    let countResults = await query(`select (count(*) as ?count) { ` + placeQuery + `}`);
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
    return { 'count': countResults[0].count.value, 'record': formattedResults };
}

//New search function for hazard in stko-kwg
async function getHazardSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];
<<<<<<< HEAD
    
    let hazardQuery = `select distinct ?entity ?label ?wkt {`;

    //Keyword search
    if (parameters["keyword"] != "") {
        hazardQuery += `
        ?search a elastic-index:kwg_fs_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        ?entity elastic:score ?score.
=======

    let hazardQuery = `select distinct ?entity ?label ?type ?typeLabel where {`;

    //Keyword search
    if (parameters["keyword"] != "") {
        hazardQuery +=
            `
        ?search a elastic-index:kwg_staging_es_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
        `;
    }

    //Filters out the types of hazards
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    let typeQuery = ``;
    let hazardTypes = parameters["hazardTypes"];

    if (parameters["hazardTypes"].length > 0)
    {
        let setHazardTypes = new Set(hazardTypes);
        typeQuery += `filter (?type in (kwg-ont:` + Array.from(setHazardTypes).join(', kwg-ont:') + `))`;
    }

    //These filters handle search by place type (regions, zipcode, fips, nwz, uscd)
=======
    let typeQuery = 'values ?type {kwg-ont:EarthquakeEvent kwg-ont:Hurricane kwg-ont:Wildfire kwg-ont:WildlandFireUse kwg-ont:PrescribedFire kwg-ont:UnknownFire} #Temporary limiter';
=======
    let typeQuery = 'values ?type {kwg-ont:Earthquake kwg-ont:NOAAHurricane kwg-ont:Wildfire kwg-ont:WildlandFireUse kwg-ont:PrescribedFire} #Temporary limiter';
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
=======
    let typeQuery = `?type rdfs:subClassOf ?superType.`;
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
    if (parameters["hazardTypes"].length > 0)
    {
        typeQuery += `filter (?type in (kwg-ont:` + parameters["hazardTypes"].join(', kwg-ont:') + `) || ?superType in (kwg-ont:` + parameters["hazardTypes"].join(', kwg-ont:') + `))`;
    }

<<<<<<< HEAD
<<<<<<< HEAD
    //These filters handle search by place type (regions, zipcode, nwz, uscd)
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
    //These filters handle search by place type (regions, zipcode, fips, nwz, uscd)
>>>>>>> 441d5b2f ((1) Enable the use of fips in hazard search (2) Correct frontend settings for GNIS)
=======
    //These filters handle search by place type (regions, gnis, zipcode, fips, nwz, uscd)
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
    let placeEntities = [];
    if (parameters["facetRegions"].length > 0) {
        placeEntities = parameters["facetRegions"];
    }
    if (parameters["facetGNIS"].length > 0) {
        let gnisTypeArray = parameters["facetGNIS"];
        for (i = 0; i < gnisTypeArray.length; i++)
        {
            gnisTypeArray[i] = gnisTypeArray[i].replace(' ','');
        }
        let gnisFilter = ``;
        if (parameters["keyword"] != "") {
            gnisFilter = `filter not exists {filter contains(?gnisEntity_label,"${parameters["keyword"]}")}`;
        }
        let gnisEntities = await query(`
            select distinct ?gnisEntity ?gnisType
            {
                ?gnisEntity rdf:type ?gnisType.
                values ?gnisType {usgs:` + gnisTypeArray.join(' usgs:') + `}
                ${gnisFilter}
            }
        `);
        for (let row of gnisEntities) {
            entityArray = row.gnisEntity.value.split("/"); 
            placeEntities.push('usgs:'+entityArray[entityArray.length - 1]);
        }
    }
    if (parameters["placeFacetsZip"] != "") {
        entityAll = await getZipCodeArea();
<<<<<<< HEAD
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

        placeSearchQuery += `
            ?entity kwg-ont:sfWithin ?s2Cell .
            ?s2Cell rdf:type kwg-ont:KWGCellLevel13;
                    kwg-ont:spatialRelation ?gnisEntity.
            ?gnisEntity kwg-ont:sfWithin ?s2cellGNIS;
                        rdf:type ?gnisPlaceType.
            values ?gnisPlaceType {usgs:` + gnisTypeArray.join(' usgs:') + `}
        `;
        if (placeEntities.length > 0)
        {
            placeSearchQuery += `
                ?s2cellGNIS rdf:type kwg-ont:KWGCellLevel13 .
                values ?placesConnectedToS2 {kwgr:` + placeEntities.join(' kwgr:') + `}
                ?s2cellGNIS kwg-ont:spatialRelation ?placesConnectedToS2.
            `;  
        }
    }
    else if (placeEntities.length > 0)
    {
        placeSearchQuery += `
            ?entity kwg-ont:spatialRelation ?s2Cell .
            ?s2Cell rdf:type kwg-ont:KWGCellLevel13 .
            values ?placesConnectedToS2 {kwgr:` + placeEntities.join(' kwgr:') + `}
            ?s2Cell kwg-ont:spatialRelation ?placesConnectedToS2.
        `;  
    }
=======
        entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
        placeEntities.push(entityArray[entityArray.length - 1]);
    }
    if (parameters["placeFacetsFIPS"] != "") {
        entityAll = await getFIPS();
        entityArray = entityAll['fips'][parameters["placeFacetsFIPS"]].split("/");
        placeEntities.push(entityArray[entityArray.length - 1]);
    }
    if (parameters["placeFacetsUSCD"] != "") {
        entityAll = await getUSClimateDivision();
        entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
        placeEntities.push(entityArray[entityArray.length - 1]);
    }
    if (parameters["placeFacetsNWZ"] != "") {
        entityAll = await getNWZone();
        entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
        placeEntities.push(entityArray[entityArray.length - 1]);
    }

    let placeSearchQuery = ``;
    if (placeEntities.length > 0)
    {
        let placesConnectedToS2 = [];
        let placesLocatedIn = [];
        for (let i = 0 ; i < placeEntities.length; i++)
        {
            if (placeEntities[i].startsWith('usgs') || placeEntities[i].startsWith('zipcode') || placeEntities[i].startsWith('noaaClimateDiv'))
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
            ?entity ?es ?s2Cell .
            ?s2Cell rdf:type kwg-ont:KWGCellLevel13 .
            values ?placesConnectedToS2 {kwgr:` + placesConnectedToS2.join(' kwgr:') + `}
            ?s2Cell ?p ?placesConnectedToS2.
            `;  
        }
        if (placesLocatedIn.length > 0)
        {
            placeSearchQuery += `
            ?entity kwg-ont:sfWithin ?places.
            values ?places {kwgr:` + placesLocatedIn.join(' kwgr:') + `}
            `;
        }
    }

>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)

    //Filter by the date hazard occurred
    let dateQuery = '';
    if (parameters["hazardFacetDateStart"] != "" || parameters["hazardFacetDateEnd"] != "") {
        let dateArr = [];
        if (parameters["hazardFacetDateStart"] != "") {
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
            dateArr.push(`?startTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime`);
            dateArr.push(`?endTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime`);
=======
            dateArr.push(`(?startTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime || ?startTimeLabel > "` + parameters["hazardFacetDateStart"] + `"^^xsd:date)`);
            dateArr.push(`(?endTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime || ?endTimeLabel > "` + parameters["hazardFacetDateStart"] + `"^^xsd:date)`);
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
        }
        if (parameters["hazardFacetDateEnd"] != "") {
            dateArr.push(`("` + parameters["hazardFacetDateEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?startTimeLabel || "`+ parameters["hazardFacetDateEnd"] + `"^^xsd:date > ?startTimeLabel)`);
            dateArr.push(`("` + parameters["hazardFacetDateEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?endTimeLabel || "`+ parameters["hazardFacetDateEnd"] + `"^^xsd:date > ?endTimeLabel)`);
        }
        dateQuery = `
            ?observationCollection sosa:phenomenonTime ?time.
<<<<<<< HEAD
            ?time time:hasBeginning/time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                time:hasEnd/time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
            ?time time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                  time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
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
<<<<<<< HEAD
<<<<<<< HEAD
                rdfs:label ?label;
                kwg-ont:hasTemporalScope|sosa:isFeatureOfInterestOf/sosa:phenomenonTime ?time.                
        optional
        {
            ?entity geo:hasGeometry/geo:asWKT ?wkt.
        }
        ?type rdfs:subClassOf kwg-ont:Hazard.
        ?entity kwg-ont:sfWithin ?place.
        ?time time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
              time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
=======
            rdfs:label ?label;
            kwg-ont:hasImpact|sosa:isFeatureOfInterestOf ?observationCollection.
        ?type rdfs:subClassOf ?superClass;
            rdfs:label ?typeLabel.
        values ?superClass {kwg-ont:Hazard kwg-ont:Fire} #Temporary limiter
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
                rdfs:label ?label;
                sosa:isFeatureOfInterestOf ?observationCollection.
        ?type rdfs:subClassOf kwg-ont:Hazard;
              rdfs:label ?typeLabel.
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
        ${typeQuery}
        ${placeSearchQuery}
        ${dateQuery}
        ${hazardTypeFacets(parameters)}
        ${spatialSearchQuery}
    }`;

<<<<<<< HEAD
    // If the user is searching for a hazard by keyword, sort them by the most relevant first
    if (parameters["keyword"] != "") {
        hazardQuery += ` ORDER BY desc(?score)`;
    }
    
    console.log(hazardQuery);

    infer = 'true'; // the parameter infer is temporarily set to be true.
    let queryResults = await query(hazardQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);
<<<<<<< HEAD

    let hazardEntites = [];
    for (let row of queryResults) {
        formattedResults.push({
            'hazard': row.entity.value,
            'hazard_name': row.label.value,
            'hazard_type': '',
            'hazard_type_name': '',
            'place': '',
            'place_name': '',
            'start_date': '',
            'start_date_name': '',
            'end_date': '',
            'end_date_name': '',    
            'wkt': (typeof row.wkt === 'undefined') ? '' :  row.wkt.value.replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>','')
        });
        hazardEntites.push(row.entity.value.replace('http://stko-kwg.geog.ucsb.edu/lod/resource/','kwgr:'));
    }

    let hazardAttributesQuery = `select distinct ?entity (group_concat(distinct ?placeQuantName; separator = "||") as ?placeQuantName) (group_concat(distinct ?placeLabel; separator = "||") as ?placeLabel) (group_concat(distinct ?type; separator = "||") as ?type) (group_concat(distinct ?typeLabel; separator = "||") as ?typeLabel) (group_concat(distinct ?place; separator = "||") as ?place) (group_concat(distinct ?time; separator = "||") as ?time) (group_concat(distinct ?startTimeLabel; separator = "||") as ?startTimeLabel) (group_concat(distinct ?endTimeLabel; separator = "||") as ?endTimeLabel)
    {
        ?entity rdf:type ?type;
                kwg-ont:hasTemporalScope|sosa:isFeatureOfInterestOf/sosa:phenomenonTime ?time.
                
        ?type rdfs:label ?typeLabel.

        OPTIONAL
        {
            ?entity kwg-ont:sfWithin ?place.
            ?place rdf:type kwg-ont:AdministrativeRegion;
                   rdfs:label ?placeLabel.
            OPTIONAL { ?place kwg-ont:quantifiedName ?placeQuantName .}
        }

        ?time time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
              time:inXSDDateTime|time:inXSDDate ?endTimeLabel.

        VALUES ?entity {${hazardEntites.join(' ')}}
    } GROUP BY ?entity` ;

    queryResults = await query(hazardAttributesQuery);
    queryResults.forEach(function(row, counterRow) {
        // If there isn't a quantified name use the regular label
        if (typeof row.placeQuantName === 'undefined') {
          // If there isn't a place name, use ''
          if (typeof row.placeLabel === 'undefined') {
            formattedResults[counterRow]['place_name'] = '';
          } else {
            formattedResults[counterRow]['place_name'] = row.placeLabel.value.split('||')[0];
          }
        } else {
          formattedResults[counterRow]['place_name'] = row.placeQuantName.value.split('||')[0];
        }
        formattedResults[counterRow]['hazard_type'] = row.type.value.split('||');
        formattedResults[counterRow]['hazard_type_name'] = row.typeLabel.value.split('||');
        formattedResults[counterRow]['place'] = (typeof row.place === 'undefined') ? '' : row.place.value.split('||')[0];
        formattedResults[counterRow]['start_date'] = row.time.value.split('||')[0];
        formattedResults[counterRow]['start_date_name'] = row.startTimeLabel.value.split('||')[0];
        formattedResults[counterRow]['end_date'] = row.time.value.split('||')[0];
        formattedResults[counterRow]['end_date_name'] = row.endTimeLabel.value.split('||')[0];
    })

    let countResults = await query(`select (count(*) as ?count) { ` + hazardQuery + ` LIMIT ` + recordNum*10 + `}`);
      return { 'count': countResults[0].count.value, 'record': formattedResults };
=======
    let queryResults = await query(hazardQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);
=======
    infer = 'false';

>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
    let entityRawValues = [];
    for (let row of queryResults) {
        let entityArray = row.entity.value.split("/");
        entityRawValues.push('kwgr:' + entityArray[entityArray.length - 1]);
        formattedResults.push({
            'hazard': row.entity.value,
            'hazard_name': row.label.value,
            'hazard_type': row.type.value,
            'hazard_type_name': row.typeLabel.value
        });
    }

    let propertyQuery = await query(`
        select ?entity ?place ?placeLabel ?placeWkt ?time ?startTimeLabel ?endTimeLabel ?wkt where { 
            values ?entity {${entityRawValues.join(' ')}} 
            optional
            {
                ?entity kwg-ont:sfWithin ?place.
                ?place rdfs:label ?placeLabel;
                       geo:hasGeometry/geo:asWKT ?placeWkt.
            }
            optional
            {
                ?entity sosa:isFeatureOfInterestOf ?observationCollection.
                ?observationCollection sosa:phenomenonTime ?time.
<<<<<<< HEAD
                ?time time:hasBeginning/time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                      time:hasEnd/time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
=======
                ?time time:inXSDDateTime|time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                      time:inXSDDateTime|time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
            }
            optional
            {
                ?entity geo:hasGeometry/geo:asWKT ?wkt.
            }
        }`);
    let propResults = {};
    for (let row of propertyQuery) {
        let place = (typeof row.place === 'undefined') ? '' : row.place.value;
        let place_name = (typeof row.placeLabel === 'undefined') ? '' : row.placeLabel.value;
        let place_wkt = (typeof row.placeWkt === 'undefined') ? '' : row.placeWkt.value;
        let start_date = (typeof row.time === 'undefined') ? '' : row.time.value;
        let start_date_name = (typeof row.startTimeLabel === 'undefined') ? '' : row.startTimeLabel.value;
        let end_date = (typeof row.time === 'undefined') ? '' : row.time.value;
        let end_date_name = (typeof row.endTimeLabel === 'undefined') ? '' : row.endTimeLabel.value;
        let wkt = (typeof row.wkt === 'undefined') ? '' : row.wkt.value;
        propResults[row.entity.value] = {
            'place': place,
            'place_name': place_name,
            'place_wkt':place_wkt,
            'start_date': start_date,
            'start_date_name': start_date_name,
            'end_date': end_date,
            'end_date_name': end_date_name,
            'wkt': wkt
        }
    }

    for (let i = 0; i < formattedResults.length; i++) {
        formattedResults[i]['place'] = propResults[formattedResults[i]['hazard']]['place'];
        formattedResults[i]['place_name'] = propResults[formattedResults[i]['hazard']]['place_name'];
        formattedResults[i]['start_date'] = propResults[formattedResults[i]['hazard']]['start_date'];
        formattedResults[i]['start_date_name'] = propResults[formattedResults[i]['hazard']]['start_date_name'];
        formattedResults[i]['end_date'] = propResults[formattedResults[i]['hazard']]['end_date'];
        formattedResults[i]['end_date_name'] = propResults[formattedResults[i]['hazard']]['end_date_name'];
        formattedResults[i]['wkt'] = (propResults[formattedResults[i]['hazard']]['wkt'] == '') ? propResults[formattedResults[i]['hazard']]['place_wkt'].replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>', '') : propResults[formattedResults[i]['hazard']]['wkt'].replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>', ''); 
    }

    let countResults = await query(`select (count(*) as ?count) { ` + hazardQuery + `}`);
    return { 'count': countResults[0].count.value, 'record': formattedResults };
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
}

//These are facet searches that are unique to a specific hazard type (fire, earthquake, etc)
function hazardTypeFacets(parameters) {
<<<<<<< HEAD
    let typedHazardQuery = ``;
=======
    let typedHazardQuery = '';
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)

    if (parameters["hazardFacetMagnitudeMin"] != "" || parameters["hazardFacetMagnitudeMax"] != "") {
        let facetArr = [];
        if (parameters["hazardFacetMagnitudeMin"] != "")
            facetArr.push(`xsd:decimal(STR(?magnitude)) > ` + parameters["hazardFacetMagnitudeMin"]);
        if (parameters["hazardFacetMagnitudeMax"] != "")
            facetArr.push(parameters["hazardFacetMagnitudeMax"] + ` > xsd:decimal(STR(?magnitude))`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?magnitudeObj.
<<<<<<< HEAD
            ?magnitudeObj sosa:observedProperty kwgr:EarthquakeObservableProperty.mag.
=======
            ?magnitudeObj sosa:observedProperty kwgr:earthquakeObservableProperty.mag.
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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
<<<<<<< HEAD
            ?quakeDepthObj sosa:observedProperty kwgr:EarthquakeObservableProperty.depth.
=======
            ?quakeDepthObj sosa:observedProperty kwgr:earthquakeObservableProperty.depth.
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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
<<<<<<< HEAD
            #?numAcresBurnedObj rdfs:label ?numAcresBurnedObjLabel.
            ?numAcresBurnedObj sosa:observedProperty kwgr:mtbsFireObservableProperty.NumberOfAcresBurned.
=======
            ?numAcresBurnedObj rdfs:label ?numAcresBurnedObjLabel
            FILTER(contains(?numAcresBurnedObjLabel, 'Observation of Number Of Acres Burned')).
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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
<<<<<<< HEAD
            #?meanValObj rdfs:label ?meanValObjLabel.
            ?meanValObj sosa:observedProperty kwgr:mtbsFireObservableProperty.MeandNBRValue.
=======
            ?meanValObj rdfs:label ?meanValObjLabel
            FILTER(contains(?meanValObjLabel, 'Observation of Mean dNBR Value')).
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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
<<<<<<< HEAD
            #?stanDevMeanValObj rdfs:label ?stanDevMeanValObjLabel.
            ?stanDevMeanValObj sosa:observedProperty kwgr:mtbsFireObservableProperty.StandardDeviationOfMeandNBRValue.
=======
            ?stanDevMeanValObj rdfs:label ?stanDevMeanValObjLabel
            FILTER(contains(?stanDevMeanValObjLabel, 'Observation of Standard Deviation of Mean dNBR Value')).
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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
<<<<<<< HEAD
            #?deathDirectValObj rdfs:label ?deathDirectValObjLabel.
            ?deathDirectValObj sosa:observedProperty kwgr:impactObservableProperty.deathDirect.
=======
            ?deathDirectValObj rdfs:label ?deathDirectValObjLabel.
            ?deathDirectValObj sosa:observedProperty kwgr:deathDirect.
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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
<<<<<<< HEAD
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
=======
            ?injuryDirectValObj rdfs:label ?injuryDirectValObjLabel.
            ?injuryDirectValObj sosa:observedProperty kwgr:injuryDirect.
            ?injuryDirectValObj sosa:hasSimpleResult ?injuryDirectVal FILTER (` + facetArr.join(' && ') + `).`;
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

<<<<<<< HEAD
    let hazardQuery = `
    select distinct ?type where {
        ?entity rdf:type ?type.
        ?type rdfs:subClassOf kwg-ont:HazardEvent.
    }`;

<<<<<<< HEAD
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
        FILTER(?type = kwg-ont:NOAAHurricane).
    }`;

=======
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
    let queryResults = await query(hazardQuery);
    for (let row of queryResults) {
        if (row.type.value.includes("http") == false) // this if statement is add to bypass empty nodes that are retrieved
        {
            continue;
        }
        let hazardLabelArray = row.type.value.split("/");
        formattedResults.push({
            'hazard_type': row.type.value,
            'hazard_type_name': hazardLabelArray[hazardLabelArray.length - 1]
        });
    }

<<<<<<< HEAD
    let queryResultsFire = await query(fireQuery);
    for (let row of queryResultsFire) {
        let hazardLabelArray = row.type.value.split("/");
        fireResults.push({
            'hazard_type': row.type.value,
            'hazard_type_name': hazardLabelArray[hazardLabelArray.length - 1]
        });
    }

    let queryResultsHurricane = await query(hurricaneQuery);
    for (let row of queryResultsHurricane) {
        let hazardLabelArray = row.type.value.split("/");
        hurricaneResults.push({
            'hazard_type': row.type.value,
            'hazard_type_name': hazardLabelArray[hazardLabelArray.length - 1]
        });
    }

    return { 'hazards': formattedResults, 'fires': fireResults, 'hurricanes': hurricaneResults };
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
    return { 'hazards': formattedResults};
>>>>>>> 9e822ac3 ((1) Enable the use of GNIS in hazard search (2) Refactor the hazard-related queries (3) Update predicate usage and filter/values statements in hazard search (4) Fix other minor issues)
=======
  let data = await fetch("/cache/hazards.json");
  return data.json();
>>>>>>> e6b677b7 (Add hazard dropdowns)
}

//New search function for expert in stko-kwg
async function getExpertSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let topicQuery = '';
    if (parameters["expertTopics"].length > 0) {
        topicQuery = `values ?expert {kwgr:` + parameters["expertTopics"].join(' kwgr:') + `}`;
    }

<<<<<<< HEAD
<<<<<<< HEAD
    let expertQuery = `select distinct ?label ?entity ?affiliation ?affiliationLabel ?affiliationLoc ?affiliationQuantName ?affiliationLoc_label ?wkt
=======
    let expertQuery = `select distinct ?label ?entity ?affiliation ?affiliationLabel ?wkt
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
    let expertQuery = `select distinct ?label ?entity ?affiliation ?affiliationLabel ?affiliationLoc ?affiliationLoc_label ?wkt
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
    (group_concat(distinct ?expert; separator = "||") as ?expertise)
    (group_concat(distinct ?expertLabel; separator = "||") as ?expertiseLabel)
    where {`;

    if (parameters["keyword"] != "") {
        expertQuery +=
            `
<<<<<<< HEAD
<<<<<<< HEAD
        ?search a elastic-index:kwg_fs_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        ?entity elastic:score ?score.
=======
        ?search a elastic-index:kwg_es_index;
=======
        ?search a elastic-index:kwg_staging_es_index;
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
        ?entity iospress:contributorAffiliation ?affiliation.
        ?affiliation rdfs:label ?affiliationLabel;
                     kwg-ont:sfWithin ?affiliationLoc;
        			 geo:hasGeometry/geo:asWKT ?wkt.
    	?affiliationLoc rdf:type ?affiliationLoc_type;
                     	rdfs:label ?affiliationLoc_label.
    	values ?affiliationLoc_type {kwg-ont:AdministrativeRegion_3}
<<<<<<< HEAD
      OPTIONAL { ?affiliationLoc kwg-ont:quantifiedName ?affiliationQuantName }
        filter not exists {filter contains(?expertLabel,":")}
        ${spatialSearchQuery}
    } GROUP BY ?label ?entity ?affiliation ?affiliationQuantName ?affiliationLabel ?affiliationLoc ?affiliationLoc_label ?wkt`;

    // If the user searched for an expert by name, give the most relevant first
    if (parameters["keyword"] != "") {
      expertQuery += ` ?score ORDER BY desc(?score)`;
    }

    let queryResults = await query(expertQuery + ` LIMIT` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);
    for (let row of queryResults) {
      let place_label = '';
      if (typeof row.affiliationQuantName === 'undefined') {
        // If there isn't a place name, use ''
        if (typeof row.affiliationLoc === 'undefined') {
          place_label = '';
        } else {
          place_label = row.affiliationLoc.value;
        }
      } else {
        place_label = row.affiliationQuantName.value;
      }
=======
        optional
        {
            ?entity iospress:contributorAffiliation ?affiliation.
            ?affiliation rdfs:label ?affiliationLabel.
            ?affiliation geo:hasGeometry/geo:asWKT ?wkt.
        }
=======
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
        ${spatialSearchQuery}
    } GROUP BY ?label ?entity ?affiliation ?affiliationLabel ?affiliationLoc ?affiliationLoc_label ?wkt`;

    console.log(expertQuery);
    let queryResults = await query(expertQuery + ` LIMIT` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);
    for (let row of queryResults) {
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
        formattedResults.push({
            'expert': row.entity.value,
            'expert_name': row.label.value,
            'affiliation': (typeof row.affiliation === 'undefined') ? " " : row.affiliation.value,
<<<<<<< HEAD
<<<<<<< HEAD
            'affiliation_name': (typeof row.affiliationLabel === 'undefined') ? " " : row.affiliationLabel.value,
            'expertise': row.expertise.value.split('||').slice(0,10),
            'expertise_name': row.expertiseLabel.value.split('||').slice(0,10),
            'place': row.affiliationLoc.value,
            'place_name': place_label,
=======
            'affiliation_name': (typeof row.affiliation_name === 'undefined') ? " " : row.affiliation_name.value,
            'expertise': row.expertise.value.split('||'),
            'expertise_name': row.expertiseLabel.value.split('||'),
            'place': " ",
            'place_name': " ",
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
            'affiliation_name': (typeof row.affiliationLabel === 'undefined') ? " " : row.affiliationLabel.value,
            'expertise': row.expertise.value.split('||'),
            'expertise_name': row.expertiseLabel.value.split('||'),
            'place': row.affiliationLoc.value,
            'place_name': row.affiliationLoc_label.value,
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
            'wkt': (typeof row.wkt === 'undefined') ? "" : row.wkt.value,
        });
    }

<<<<<<< HEAD
<<<<<<< HEAD
    let countResults = await query(`select (count(*) as ?count) { ` + expertQuery + ` LIMIT ` + recordNum*10 + `}`);
=======
=======
    console.log(formattedResults);
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
    let countResults = await query(`select (count(*) as ?count) { ` + expertQuery + `}`);
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
    return { 'count': countResults[0].count.value, 'record': formattedResults };
}

async function getExpertTopics() {
    let formattedResults = [];

<<<<<<< HEAD
<<<<<<< HEAD
    let topicQuery = `
    select distinct ?topic ?label ?subtopic ?sublabel where {
        ?topic rdf:type kwg-ont:ExpertiseTopic;
               kwg-ont:hasSubTopic ?subtopic;
        	   rdfs:label ?label.
        ?subtopic rdfs:label ?sublabel.
    } ORDER BY ASC(?label)`;

    let queryResults = await query(topicQuery);
=======
    let hazardQuery = `
=======
    let topicQuery = `
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
    select distinct ?topic ?label ?subtopic ?sublabel where {
        ?topic rdf:type kwg-ont:ExpertiseTopic;
               kwg-ont:hasSubTopic ?subtopic;
        	   rdfs:label ?label.
        ?subtopic rdfs:label ?sublabel.
    } ORDER BY ASC(?label)`;

<<<<<<< HEAD
    let queryResults = await query(hazardQuery);
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
    let queryResults = await query(topicQuery);
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
    for (let row of queryResults) {
        let topicShortArray = row.topic.value.split("/");
        let topicShort = topicShortArray[topicShortArray.length - 1];
        let subTopicShortArray = row.subtopic.value.split("/");
        let subTopicShort = subTopicShortArray[subTopicShortArray.length - 1];
        if (topicShort in formattedResults) {
<<<<<<< HEAD
<<<<<<< HEAD
            //We already have this expertise topic, which means we need to grab their subtopics
=======
            //We already have this user, which means we need to grab their expertise
>>>>>>> a587a8cb (Distinguish between places connected to S2 cells and places associated with hazards through kwg-ont:locatedIn relations when exploring by hazards)
=======
            //We already have this expertise topic, which means we need to grab their subtopics
>>>>>>> 8783cf40 (Start transitioning from KWG-V3 to KWG-Staging)
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
=======
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
const P_ENDPOINT = 'https://stko-kwg.geog.ucsb.edu/sparql';

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
    if (typeof(row) == "undefined") {
        row = {
            'expert': { 'value': 'http://stko-kwg.geog.ucsb.edu/lod/resource/expert.1750909092' },
            'expert_label': { 'value': 'Chenyang Cao' }
        };
    }

    formattedResults[row.expert_label.value] = row.expert.value;

    return { 'randomExpert': formattedResults };
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

    return { 'randomWildfire': formattedResults };
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

    return { 'randomEarthquake': formattedResults };
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
    if (typeof(row) == "undefined") {
        row = {
            'expert': { 'value': 'http://stko-kwg.geog.ucsb.edu/lod/resource/expert.14838165' },
            'expert_label': { 'value': 'Zhonghua Mao' }
        };
    }

    formattedResults[row.expert_label.value] = row.expert.value;

    return { 'randomExpert': formattedResults };
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

async function getZipCodeArea() {
    let formattedResults = [];

    let zipcodeQuery = `
    select distinct ?zipcode ?zipcodeArea where {
        ?zipcodeArea rdf:type kwg-ont:ZipCodeArea;
                     kwg-ont:hasZipCode ?zipcode.
    } ORDER BY ASC(?zipcode)`;

    // use cached data for now
    // let queryResults = await query(zipcodeQuery);
    zipcode_areas_json = await fetch("/cache/zipcode_areas.json");
    zipcode_areas_cached = await zipcode_areas_json.json();
    let queryResults = zipcode_areas_cached.results.bindings;

    for (let row of queryResults) {
        let zipcode = row.zipcode.value;
        let zipcodeArea = row.zipcodeArea.value;
        formattedResults[zipcode] = zipcodeArea;
    }

    return { 'zipcodes': formattedResults };
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

//New search function for place in stko-kwg
async function getPlaceSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let placeQuery = `select ?label ?type ?typeLabel ?entity where {`;

    if (parameters["keyword"] != "") {
        placeQuery += `
        ?search a elastic-index:kwg_es_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.`;
    }

    if (parameters["placeFacetsRegion"] != "" | parameters["placeFacetsUSCD"] != "" | parameters["placeFacetsNWZ"] != "" | parameters["placeFacetsZip"] != "") {
        let typeQueries = [];

        if (parameters["placeFacetsRegion"] != "") {
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
        if (parameters["placeFacetsZip"] != "") {
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
        if (parameters["placeFacetsUSCD"] != "") {
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
        if (parameters["placeFacetsNWZ"] != "") {
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

    if (typeof parameters["spatialSearchWkt"] != 'undefined') {
        placeQuery += `
            ?entity geo:sfWithin '${parameters["spatialSearchWkt"]}'^^geo:wktLiteral.
        `;
    }
    placeQuery += `}`;

    let queryResults = await query(placeQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);
    let entityRawValues = [];
    for (let row of queryResults) {
        let entityArray = row.entity.value.split("/");
        entityRawValues.push('kwgr:' + entityArray[entityArray.length - 1]);
        formattedResults.push({
            'place': row.entity.value,
            'place_name': row.label.value,
            'place_type': row.type.value,
            'place_type_name': row.typeLabel.value,
        });
    }

    let wktQuery = await query(`select ?entity ?wkt where { ?entity geo:hasGeometry/geo:asWKT ?wkt. values ?entity {${entityRawValues.join(' ')}} }`);
    let wktResults = {};
    for (let row of wktQuery) {
        wktResults[row.entity.value] = (typeof row.wkt === 'undefined') ? '' : row.wkt.value;
    }

    for (let i = 0; i < formattedResults.length; i++) {
        formattedResults[i]['wkt'] = wktResults[formattedResults[i]['place']];
    }

    let countResults = await query(`select (count(*) as ?count) { ` + placeQuery + `}`);
    return { 'count': countResults[0].count.value, 'record': formattedResults };
}

//New search function for hazard in stko-kwg
async function getHazardSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let hazardQuery = `select distinct ?entity ?label ?type ?typeLabel where {`;

    //Keyword search
    if (parameters["keyword"] != "") {
        hazardQuery +=
            `
        ?search a elastic-index:kwg_es_index;
        elastic:query "${parameters["keyword"]}";
        elastic:entities ?entity.
        `;
    }

    //Filters out the types of hazards
    let typeQuery = 'values ?type {kwg-ont:EarthquakeEvent kwg-ont:Hurricane kwg-ont:Wildfire kwg-ont:WildlandFireUse kwg-ont:PrescribedFire kwg-ont:UnknownFire} #Temporary limiter';
    if (parameters["hazardTypes"].length > 0)
        typeQuery = `values ?type {kwg-ont:` + parameters["hazardTypes"].join(' kwg-ont:') + `}`;

    //These filters handle search by place type (regions, zipcode, nwz, uscd)
    let placeEntities = [];
    if (parameters["facetRegions"].length > 0) {
        placeEntities = parameters["facetRegions"];
    }
    if (parameters["placeFacetsZip"] != "") {
        entityAll = await getZipCodeArea();
        entityArray = entityAll['zipcodes'][parameters["placeFacetsZip"]].split("/");
        placeEntities.push(entityArray[entityArray.length - 1]);
    }
    if (parameters["placeFacetsUSCD"] != "") {
        entityAll = await getUSClimateDivision();
        entityArray = entityAll['divisions'][parameters["placeFacetsUSCD"]].split("/");
        placeEntities.push(entityArray[entityArray.length - 1]);
    }
    if (parameters["placeFacetsNWZ"] != "") {
        entityAll = await getNWZone();
        entityArray = entityAll['nwzones'][parameters["placeFacetsNWZ"]].split("/");
        placeEntities.push(entityArray[entityArray.length - 1]);
    }
    let placeSearchQuery = (placeEntities.length > 0) ? `
        optional
        {
            ?entity ?es ?s2Cell .
            ?s2Cell rdf:type kwg-ont:KWGCellLevel13 .
        }
        
        ?entity kwg-ont:locatedIn ?places.
        values ?places {kwgr:` + placeEntities.join(' kwgr:') + `}
        ` :
        '';

    //Filter by the date hazard occurred
    let dateQuery = '';
    if (parameters["hazardFacetDateStart"] != "" || parameters["hazardFacetDateEnd"] != "") {
        let dateArr = [];
        if (parameters["hazardFacetDateStart"] != "") {
            dateArr.push(`?startTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime`);
            dateArr.push(`?endTimeLabel > "` + parameters["hazardFacetDateStart"] + `T00:00:00+00:00"^^xsd:dateTime`);
        }
        if (parameters["hazardFacetDateEnd"] != "") {
            dateArr.push(`"` + parameters["hazardFacetDateEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?startTimeLabel`);
            dateArr.push(`"` + parameters["hazardFacetDateEnd"] + `T00:00:00+00:00"^^xsd:dateTime > ?endTimeLabel`);
        }
        dateQuery = `
            ?observationCollection sosa:phenomenonTime ?time.
            ?time time:hasBeginning/time:inXSDDateTime|time:inXSDDate ?startTimeLabel;
                time:hasEnd/time:inXSDDateTime|time:inXSDDate ?endTimeLabel.
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

    let queryResults = await query(hazardQuery + ` LIMIT ` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);
    let entityRawValues = [];
    for (let row of queryResults) {
        let entityArray = row.entity.value.split("/");
        entityRawValues.push('kwgr:' + entityArray[entityArray.length - 1]);
        formattedResults.push({
            'hazard': row.entity.value,
            'hazard_name': row.label.value,
            'hazard_type': row.type.value,
            'hazard_type_name': row.typeLabel.value
        });
    }

    let propertyQuery = await query(`
        select ?entity ?place ?placeLabel ?placeWkt ?time ?startTimeLabel ?endTimeLabel ?wkt where { 
            values ?entity {${entityRawValues.join(' ')}} 
            optional
            {
                ?entity kwg-ont:locatedIn ?place.
                ?place rdfs:label ?placeLabel;
                       geo:hasGeometry/geo:asWKT ?placeWkt.
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
        }`);
    let propResults = {};
    for (let row of propertyQuery) {
        let place = (typeof row.place === 'undefined') ? '' : row.place.value;
        let place_name = (typeof row.placeLabel === 'undefined') ? '' : row.placeLabel.value;
        let place_wkt = (typeof row.placeWkt === 'undefined') ? '' : row.placeWkt.value;
        let start_date = (typeof row.time === 'undefined') ? '' : row.time.value;
        let start_date_name = (typeof row.startTimeLabel === 'undefined') ? '' : row.startTimeLabel.value;
        let end_date = (typeof row.time === 'undefined') ? '' : row.time.value;
        let end_date_name = (typeof row.endTimeLabel === 'undefined') ? '' : row.endTimeLabel.value;
        let wkt = (typeof row.wkt === 'undefined') ? '' : row.wkt.value;
        propResults[row.entity.value] = {
            'place': place,
            'place_name': place_name,
            'place_wkt':place_wkt,
            'start_date': start_date,
            'start_date_name': start_date_name,
            'end_date': end_date,
            'end_date_name': end_date_name,
            'wkt': wkt
        }
    }

    for (let i = 0; i < formattedResults.length; i++) {
        formattedResults[i]['place'] = propResults[formattedResults[i]['hazard']]['place'];
        formattedResults[i]['place_name'] = propResults[formattedResults[i]['hazard']]['place_name'];
        formattedResults[i]['start_date'] = propResults[formattedResults[i]['hazard']]['start_date'];
        formattedResults[i]['start_date_name'] = propResults[formattedResults[i]['hazard']]['start_date_name'];
        formattedResults[i]['end_date'] = propResults[formattedResults[i]['hazard']]['end_date'];
        formattedResults[i]['end_date_name'] = propResults[formattedResults[i]['hazard']]['end_date_name'];
        formattedResults[i]['wkt'] = (propResults[formattedResults[i]['hazard']]['wkt'] == '') ? propResults[formattedResults[i]['hazard']]['place_wkt'].replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>', '') : propResults[formattedResults[i]['hazard']]['wkt'].replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>', ''); 
    }

    let countResults = await query(`select (count(*) as ?count) { ` + hazardQuery + `}`);
    return { 'count': countResults[0].count.value, 'record': formattedResults };
}

//These are facet searches that are unique to a specific hazard type (fire, earthquake, etc)
function hazardTypeFacets(parameters) {
    let typedHazardQuery = '';

    if (parameters["hazardFacetMagnitudeMin"] != "" || parameters["hazardFacetMagnitudeMax"] != "") {
        let facetArr = [];
        if (parameters["hazardFacetMagnitudeMin"] != "")
            facetArr.push(`xsd:decimal(STR(?magnitude)) > ` + parameters["hazardFacetMagnitudeMin"]);
        if (parameters["hazardFacetMagnitudeMax"] != "")
            facetArr.push(parameters["hazardFacetMagnitudeMax"] + ` > xsd:decimal(STR(?magnitude))`);
        typedHazardQuery += `
            ?observationCollection sosa:hasMember ?magnitudeObj.
            ?magnitudeObj sosa:observedProperty kwgr:earthquakeObservableProperty.mag.
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
            ?quakeDepthObj sosa:observedProperty kwgr:earthquakeObservableProperty.depth.
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
            ?numAcresBurnedObj rdfs:label ?numAcresBurnedObjLabel
            FILTER(contains(?numAcresBurnedObjLabel, 'Observation of Number Of Acres Burned')).
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
            ?meanValObj rdfs:label ?meanValObjLabel
            FILTER(contains(?meanValObjLabel, 'Observation of Mean dNBR Value')).
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
            ?stanDevMeanValObj rdfs:label ?stanDevMeanValObjLabel
            FILTER(contains(?stanDevMeanValObjLabel, 'Observation of Standard Deviation of Mean dNBR Value')).
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
            ?deathDirectValObj rdfs:label ?deathDirectValObjLabel
            FILTER(contains(?deathDirectValObjLabel, 'Impact Observation of Death Direct of the Hurricane (Typhoon)')).
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
            ?injuryDirectValObj rdfs:label ?injuryDirectValObjLabel
            FILTER(contains(?injuryDirectValObjLabel, 'Impact Observation of Injury Direct of the Hurricane (Typhoon)')).
            ?injuryDirectValObj sosa:hasSimpleResult ?injuryDirectVal FILTER (` + facetArr.join(' && ') + `).`;
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
            'hazard_type': row.type.value,
            'hazard_type_name': hazardLabelArray[hazardLabelArray.length - 1]
        });
    }

    let queryResultsFire = await query(fireQuery);
    for (let row of queryResultsFire) {
        let hazardLabelArray = row.type.value.split("/");
        fireResults.push({
            'hazard_type': row.type.value,
            'hazard_type_name': hazardLabelArray[hazardLabelArray.length - 1]
        });
    }

    let queryResultsHurricane = await query(hurricaneQuery);
    for (let row of queryResultsHurricane) {
        let hazardLabelArray = row.type.value.split("/");
        hurricaneResults.push({
            'hazard_type': row.type.value,
            'hazard_type_name': hazardLabelArray[hazardLabelArray.length - 1]
        });
    }

    return { 'hazards': formattedResults, 'fires': fireResults, 'hurricanes': hurricaneResults };
}

//New search function for expert in stko-kwg
async function getExpertSearchResults(pageNum, recordNum, parameters) {
    let formattedResults = [];

    let topicQuery = '';
    if (parameters["expertTopics"].length > 0) {
        topicQuery = `values ?expert {kwgr:` + parameters["expertTopics"].join(' kwgr:') + `}`;
    }

    let expertQuery = `select distinct ?label ?entity ?affiliation ?affiliationLabel ?wkt
    (group_concat(distinct ?expert; separator = "||") as ?expertise)
    (group_concat(distinct ?expertLabel; separator = "||") as ?expertiseLabel)
    where {`;

    if (parameters["keyword"] != "") {
        expertQuery +=
            `
        ?search a elastic-index:kwg_es_index;
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
        optional
        {
            ?entity iospress:contributorAffiliation ?affiliation.
            ?affiliation rdfs:label ?affiliationLabel.
            ?affiliation geo:hasGeometry/geo:asWKT ?wkt.
        }
        ${spatialSearchQuery}
    } GROUP BY ?label ?entity ?affiliation ?affiliationLabel ?wkt`;

    let queryResults = await query(expertQuery + ` LIMIT` + recordNum + ` OFFSET ` + (pageNum - 1) * recordNum);
    for (let row of queryResults) {
        formattedResults.push({
            'expert': row.entity.value,
            'expert_name': row.label.value,
            'affiliation': (typeof row.affiliation === 'undefined') ? " " : row.affiliation.value,
            'affiliation_name': (typeof row.affiliation_name === 'undefined') ? " " : row.affiliation_name.value,
            'expertise': row.expertise.value.split('||'),
            'expertise_name': row.expertiseLabel.value.split('||'),
            'place': " ",
            'place_name': " ",
            'wkt': (typeof row.wkt === 'undefined') ? "" : row.wkt.value,
        });
    }

    let countResults = await query(`select (count(*) as ?count) { ` + expertQuery + `}`);
    return { 'count': countResults[0].count.value, 'record': formattedResults };
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
        if (topicShort in formattedResults) {
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

    return { 'topics': Object.values(formattedResults) };
>>>>>>> 0bf31404 (update my repo)
}
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
    kwgr: 'http://stko-kwg.geog.ucsb.edu/lod/resource/',
    'kwg-ont': 'http://stko-kwg.geog.ucsb.edu/lod/ontology/',
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
const P_ENDPOINT = 'http://stko-kwg.geog.ucsb.edu:7200/repositories/KnowWhereGraph-V2';

// query
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

getFilters();

// query expertise super topics, place types and hazard types
async function getFilters() {
    // store expertise super topics, place types and hazard types
    let h_superTopics = {};
    let h_placeTypes = {};
    let h_hazardTypes = {};

    // let a_superTopics = await query( /* syntax: sparql */ `
    //     select ?super_topic ?super_topic_label where { 
    //         ?super_topic rdf:type kwg-ont:ExpertiseTopic;
    //             rdfs:label ?super_topic_label.
    //     }
    // `);

    // for (let row of a_superTopics) {
    //     h_superTopics[row.super_topic.value] = row.super_topic_label.value;
    // }

    // as place types do not have a super class such as kwg-ont:Place in KnowWhereGraph-V2 right now,
    // we will configure h_placeTypes manually
    // retrieve iris and labels of kwg-ont:AdministrativeRegion and its subclasses
    let AdministrativeRegion_iri = 'http://stko-kwg.geog.ucsb.edu/lod/ontology/AdministrativeRegion';
    h_placeTypes[AdministrativeRegion_iri] = {'label':'AdministrativeRegion', 'subclasses':{}};
    let a_placeTypes_AdministrativeRegion =  await query( /* syntax: sparql */ `
        select ?place_type ?place_type_label where { 
            ?place_type rdfs:subClassOf kwg-ont:AdministrativeRegion;
                rdfs:label ?place_type_label.
        }
    `);
    for (let row of a_placeTypes_AdministrativeRegion) {
        h_placeTypes[AdministrativeRegion_iri]['subclasses'][row.place_type.value] = row.place_type_label.value;
    }
    
    // retrieve iris and labels of kwg-ont:USClimateDivision
    let USClimateDivision_iri = 'http://stko-kwg.geog.ucsb.edu/lod/ontology/USClimateDivision';
    h_placeTypes[USClimateDivision_iri] = {'label':'USClimateDivision'};

    // retrieve iris and labels of kwg-ont:NWZone
    let NWZone_iri = 'http://stko-kwg.geog.ucsb.edu/lod/ontology/NWZone';
    h_placeTypes[NWZone_iri] = {'label':'NWZone'};

    // retrieve iris and labels of kwg-ont:ZipCodeArea
    let ZipCodeArea_iri = 'http://stko-kwg.geog.ucsb.edu/lod/ontology/ZipCodeArea';
    h_placeTypes[ZipCodeArea_iri] = {'label':'ZipCodeArea'};

    console.log(h_placeTypes);
    console.log(getInstances('http://stko-kwg.geog.ucsb.edu/lod/ontology/AdministrativeRegion_0'))
    // let a_hazardTypes = await query( /* syntax: sparql */ `
    //     select ?hazard_type ?hazard_type_label where { 
    //         ?hazard_type rdfs:subClassOf kwg-ont:Hazard;
    //             rdfs:label ?hazard_type_label.
    //     }
    // `);

    // for (let row of a_hazardTypes) {
    //     h_hazardTypes[row.hazard_type.value] = row.hazard_type_label.value;
    // }

    // return {'Expertise':h_superTopics, 'Place':h_placeTypes, 'Hazard':h_hazardTypes};

    // test data
    // let topicgroup_iri_selected = [];
    // // let topicgroup_iri_selected = "http://stko-roy.geog.ucsb.edu/lod/resource/topicgroup.biology";
    // // let expertises_iri_selected = [];
    // let expertises_iri_selected = ['http://stko-roy.geog.ucsb.edu/lod/resource/topic.data_science','http://stko-roy.geog.ucsb.edu/lod/resource/topic.covid19'];
    // // let place_type_iri_list_selected = [];
    // let place_type_iri_list_selected = ['http://stko-roy.geog.ucsb.edu/lod/ontology/City','http://stko-roy.geog.ucsb.edu/lod/ontology/County','http://stko-roy.geog.ucsb.edu/lod/ontology/NWSZone'];
    // let hazards_type_iri_selected =['http://stko-roy.geog.ucsb.edu/lod/ontology/Wildfire', 'http://stko-roy.geog.ucsb.edu/lod/ontology/ThunderstormWind'];
    // // let hazards_type_iri_selected = [];
    // let keyword = "";
    // let start_year = '1990';
    // let start_month = '01';
    // let start_date = '01';
    // let end_year = '2021';
    // let end_month = '12';
    // let end_date = '31';
    // let tabname = 'Hazard';
    // let pagenum = 1;
    // let recordnum = 20;
    // let search_result = getFullTextSearchResult(tabname, pagenum, recordnum, keyword, topicgroup_iri_selected, expertises_iri_selected, place_type_iri_list_selected, hazards_type_iri_selected, start_year, start_month, start_date, end_year, end_month, end_date);

};

// functions that respond to onclick events
// query instances
async function getInstances(class_iri)
{
    let h_instances = [];
    let a_instances = await query( /* syntax: sparql */ `
        select ?instance ?instance_label
        {
            ?instance rdf:type <${class_iri}>;
                      rdfs:label ?instance_label
        }
    `);

    for (let row of a_instances) {
        h_instances.push({'instance': row.instance.value, 'instance_label': row.instance_label.value});
    }

    return h_instances;
}

// query expert table record
async function getExpertTableRecord(pagenum, recordnum, keyword, topicgroup_iri_selected, expertises_iri_selected, place_type_iri_list_selected) 
{
    let h_expertTable = [];

    // generate query string to retrieve expert records
    let expert_query_string = `
        select distinct ?expert ?expert_name ?affiliation ?affiliation_name 
        (group_concat(distinct ?department; separator=",") as ?department) 
        (group_concat(distinct ?department_name; separator=",") as ?department_name) 
        (group_concat(distinct ?expertise; separator=",") as ?expertise) 
        (group_concat(distinct ?expertise_name; separator=",") as ?expertise_name) 
        ?place ?place_name (group_concat(distinct ?place_geometry; separator=",") as ?place_geometry) 
        (group_concat(distinct ?place_geometry_wkt; separator=",") as ?place_geometry_wkt) ?webpage
        {
    `;
    if (keyword != "")
    {
        expert_query_string += `
            ?search a elastic-index:dr_index_new;
            elastic:query "${keyword}";
            elastic:entities ?expert.
        `;
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
        expert_query_string += `filter (?expertise in (${expertises_iri_selected.map((expertise) => 
            `<${expertise}>`).join(',')}))`;
    }
    else if (topicgroup_iri_selected != "")
    {
        expert_query_string += `<${topicgroup_iri_selected}> kwg-ont:subTopic ?expertise`;
    }
    if (place_type_iri_list_selected.length != 0)
    {
        expert_query_string += `filter (?place_type in (${place_type_iri_list_selected.map((place_type) => 
            `<${place_type}>`).join(',')}))`;
    }
    if (keyword != "")
    {
        expert_query_string +=  `filter (regex(?place_name, "${keyword}", "i"))`;
    }
    expert_query_string += `} group by ?expert ?expert_name ?affiliation ?affiliation_name ?place ?place_name ?webpage`;

    let a_expertTable = await query(expert_query_string + ` limit` + recordnum + ` offset ` + (pagenum-1)*recordnum);

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
            'place_geometry':(typeof row.place_geometry  === 'undefined') ? '' : row.place_geometry.value,
            'place_geometry_wkt':(typeof row.place_geometry_wkt  === 'undefined') ? '' : row.place_geometry_wkt.value,
            'webpage':row.webpage.value
        });
    }

    // generate query string to retrieve the counter of expert records
    let expert_counter_query_string = `
        select (count(*) as ?count)
        {
    ` + expert_query_string + `}`;

    let a_counter_expertTable = await query(expert_counter_query_string);

    return {'count':a_counter_expertTable[0].count.value,'record':h_expertTable};
}

// query hazard table records
async function getHazardTableRecord(pagenum, recordnum, keyword, place_type_iri_list_selected, hazards_type_iri_selected, start_year, start_month, start_date, end_year, end_month, end_date) 
{
    let h_hazardTable = [];
    // generate query string to retrieve hazard records
    let hazard_query_string = `
        select distinct ?hazard ?hazard_name ?hazard_type ?hazard_type_name ?place ?place_name 
        ?date ?date_name
        {
    `;
    if (keyword != "")
    {
        hazard_query_string += `
            ?search a elastic-index:dr_index_new;
            elastic:query "${keyword}";
            elastic:entities ?hazard.
        `;
    }
    hazard_query_string += `
        ?hazard kwg-ont:locatedAt ?place;
                sosa:phenomenonTime ?date;
                rdfs:label ?hazard_name;
                rdf:type ?hazard_type.
        ?hazard_type rdfs:subClassOf kwg-ont:Hazard;
                     rdfs:label ?hazard_type_name.
        ?date rdfs:label ?date_name;
              time:hasBeginning ?start_date;
              time:hasEnd ?end_date.
        ?start_date rdfs:label ?start_date_label.
        ?end_date rdfs:label ?end_date_label.
        ?place rdfs:label ?place_name;
               rdf:type ?place_type.
        ?place_type rdfs:subClassOf kwg-ont:Place;
                    rdfs:label ?place_type_name.
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
    if (place_type_iri_list_selected.length != 0)
    {
        hazard_query_string += `filter (?place_type in (${place_type_iri_list_selected.map((place_type) => 
            `<${place_type}>`).join(',')}))`;
    }
    if (keyword != "")
    {
        hazard_query_string +=  `filter (regex(?place_name, "${keyword}", "i"))`;
    }
    hazard_query_string += `}`;

    let a_hazardTable = await query(hazard_query_string + ` limit` + recordnum + ` offset ` + (pagenum-1)*recordnum);
    for (let row of a_hazardTable)
    {
        h_hazardTable.push({
            'hazard':row.hazard.value,
            'hazard_name':row.hazard_name.value,
            'hazard_type':row.hazard_type.value,
            'hazard_type_name':row.hazard_type_name.value,
            'place':row.place.value,
            'place_name':row.place_name.value,
            'place_geometry':(typeof row.place_geometry  === 'undefined') ? '' : row.place_geometry.value,
            'place_geometry_wkt':(typeof row.place_geometry_wkt  === 'undefined') ? '' : row.place_geometry_wkt.value,
            'date':row.date.value,
            'date_name':row.date_name.value,
        });
    }

    // generate query string to retrieve the counter of hazard records
    let hazard_counter_query_string = `
        select (count(*) as ?count)
        {
    ` + hazard_query_string + `}`;

    let a_counter_hazardTable = await query(hazard_counter_query_string);
    
    return {'count':a_counter_hazardTable[0].count.value,'record':h_hazardTable};
}

// query place table records
async function getPlaceTableRecord(pagenum, recordnum, keyword, topicgroup_iri_selected, expertises_iri_selected, place_type_iri_list_selected, hazards_type_iri_selected, start_year, start_month, start_date, end_year, end_month, end_date) 
{
    let h_placeTable = [];

    let place_query_string = `
        select distinct ?place ?place_name ?place_type ?place_type_name 
    `;

    // generate query string to retrieve place records depending on the selection of filters
    if (topicgroup_iri_selected != "")
    {
        place_query_string += `
            (group_concat(distinct ?place_geometry; separator=",") as ?place_geometry) 
            (group_concat(distinct ?place_geometry_wkt; separator=",") as ?place_geometry_wkt)
            {
        `;
        if (keyword != "")
        {
            place_query_string += `
                ?search a elastic-index:dr_index_new;
                elastic:query "${keyword}";
                elastic:entities ?expert.
            `;
        }
        place_query_string += `
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
            place_query_string += `filter (?expertise in (${expertises_iri_selected.map((expertise) => 
                `<${expertise}>`).join(',')}))`;
        }
        else if (topicgroup_iri_selected != "")
        {
            place_query_string += `<${topicgroup_iri_selected}> kwg-ont:subTopic ?expertise`;
        }
    }
    else if (hazards_type_iri_selected.length != 0)
    {
        place_query_string += `
            {
        `;
        if (keyword != "")
        {
            place_query_string += `
                ?search a elastic-index:dr_index_new;
                elastic:query "${keyword}";
                elastic:entities ?hazard.
            `;
        }
        place_query_string += `
            ?hazard kwg-ont:locatedAt ?place;
                    sosa:phenomenonTime ?date;
                    rdfs:label ?hazard_name;
                    rdf:type ?hazard_type.
            ?hazard_type rdfs:subClassOf kwg-ont:Hazard;
                         rdfs:label ?hazard_type_name.
            ?date rdfs:label ?date_name;
                  time:hasBeginning ?start_date;
                  time:hasEnd ?end_date.
            ?start_date rdfs:label ?start_date_label.
            ?end_date rdfs:label ?end_date_label.
            ?place rdfs:label ?place_name;
                   rdf:type ?place_type.
            ?place_type rdfs:subClassOf kwg-ont:Place;
                        rdfs:label ?place_type_name.
        `;
        if ((start_year != '') && (start_month != '') && (start_date != ''))
        {
            place_query_string += `filter (?start_date_label >= '${start_year+'-'+start_month+'-'+start_date+'-0000 EST'}')`;
        }
        if ((end_year != '') && (end_month != '') && (end_date != ''))
        {
            place_query_string += `filter (?end_date_label <= '${end_year+'-'+end_month+'-'+end_date+'-2400 EST'}')`;
        }
        place_query_string += `filter (?hazard_type in (${hazards_type_iri_selected.map((hazard_type) => `<${hazard_type}>`).join(',')}))`;
    }
    else
    {
        place_query_string += `
            (group_concat(distinct ?place_geometry; separator=",") as ?place_geometry) 
            (group_concat(distinct ?place_geometry_wkt; separator=",") as ?place_geometry_wkt)
            {
        `;
        place_query_string += `
            ?place rdfs:label ?place_name;
                   rdf:type ?place_type.
            ?place_type rdfs:subClassOf kwg-ont:Place;
                        rdfs:label ?place_type_name.
            optional
            {
                ?place geo:hasGeometry ?place_geometry .
                ?place_geometry geo:asWKT ?place_geometry_wkt .
            }
        `;
    }
    if (keyword != "")
    {
        place_query_string +=  `filter (regex(?place_name, "${keyword}", "i"))`;
    }
    if (place_type_iri_list_selected.length != 0)
    {
        place_query_string += `filter (?place_type in (${place_type_iri_list_selected.map((place_type) => 
            `<${place_type}>`).join(',')}))`;
    }
    if (hazards_type_iri_selected.length != 0) 
    {
        place_query_string += `}`;
    }
    else
    {
        place_query_string += `} group by ?place ?place_name ?place_type ?place_type_name`;
    }

    let a_placeTable = await query(place_query_string + ` limit` + recordnum + ` offset ` + (pagenum-1)*recordnum);
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
    let place_counter_query_string = `
        select (count(*) as ?count)
        {
    ` + place_query_string + `}`;
    let a_counter_placeTable = await query(place_counter_query_string);
    return {'count':a_counter_placeTable[0].count.value,'record':h_placeTable};
}

// full-text search
async function getFullTextSearchResult(tabname, pagenum, recordnum, keyword, topicgroup_iri_selected, expertises_iri_selected, place_type_iri_list_selected, hazards_type_iri_selected, start_year, start_month, start_date, end_year, end_month, end_date)
{
    let place_query_string = `
        select distinct *
        {
    `;
    let expert_query_string = `
        select distinct *
        {
    `;
    let hazard_query_string = `
        select distinct *
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
    else if (topicgroup_iri_selected != "")
    {
        expert_query_string += `<${topicgroup_iri_selected}> kwg-ont:subTopic ?expertise`;
    }

    hazard_query_string += `
        ?hazard kwg-ont:locatedAt ?place;
                sosa:phenomenonTime ?date;
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

    let search_result = {};
    if (tabname == 'Place')
    {
        search_result = {
            "Place":getPlaceTableRecord(pagenum, recordnum, keyword, topicgroup_iri_selected, expertises_iri_selected, place_type_iri_list_selected, hazards_type_iri_selected, start_year, start_month, start_date, end_year, end_month, end_date)
        }
    }
    if (tabname == 'Expert')
    {
        search_result = {
            "Expert":getExpertTableRecord(pagenum, recordnum, keyword, topicgroup_iri_selected, expertises_iri_selected, place_type_iri_list_selected)
        }
    }
    if (tabname == 'Hazard')
    {
        search_result = {
            "Hazard":getHazardTableRecord(pagenum, recordnum, keyword, place_type_iri_list_selected, hazards_type_iri_selected, start_year, start_month, start_date, end_year, end_month, end_date)
        }
    }
    console.log(search_result);
    return search_result;
}

// getFilters();
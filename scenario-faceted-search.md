# Faceted Search Competency Questions, Onclick Events & Sample SPARQL Queries

These competency questions are raised based on our faceted search prototype (https://projects.invisionapp.com/share/7G10PRR68K3Y#/screens/458122549). One basic and one complex question are asked for each scenario. Sample SPARQL queries are given for both competency questions and onclick events.

## Explore by Expertise

### Question 1 (Basic)
* Who are the experts that have selected expertise (e.g., data science and COVID-19)?

#### SPARQL Query
```SPARQL
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select ?type_name ?expert_name ?affiliation_name ?department_name (group_concat(?expertise_name; separator="\t") as ?expertise_list) ?firstname ?lastname ?fullname ?webpage
{
    ?expert rdf:type ?type; 
			kwg-ont:hasExpertise ?topic;
            kwg-ont:affiliation ?affiliation;
            kwg-ont:department ?department;
            kwg-ont:firstName ?firstname;
            kwg-ont:lastName ?lastname;
            kwg-ont:fullName ?fullname;
            kwg-ont:personalPage ?webpage;
            kwg-ont:hasExpertise ?expertise;
            rdfs:label ?expert_name .
    ?type rdfs:label ?type_name.
    ?expertise rdfs:label ?expertise_name.
    ?department rdfs:label ?department_name.
    ?affiliation rdfs:label ?affiliation_name.
    FILTER (?topic in (kwgr:topic.data_science, kwgr:topic.covid19))
} 
GROUP BY ?type_name ?expert_name ?affiliation_name ?department_name ?firstname ?lastname ?fullname ?webpage
```

#### Sample Result
<http://stko-roy.geog.ucsb.edu:7202/sparql?savedQueryName=Explore%20by%20Expertise%20(Basic)&owner=admin>

### Question 2 (Complex)
* Given the interested expertise (e.g., data science and COVID-19) and the places of interest (e.g., Seattle and Boston), who are related experts and what are their relevant information? 

#### SPARQL Query
```SPARQL
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select ?type_name ?expert_name ?affiliation_name ?department_name (group_concat(?expertise_name; separator="\t") as ?expertise_list) ?firstname ?lastname ?fullname ?webpage
{
    ?expert rdf:type ?type; 
			kwg-ont:hasExpertise ?topic;
            kwg-ont:affiliation ?affiliation;
            kwg-ont:department ?department;
            kwg-ont:firstName ?firstname;
            kwg-ont:lastName ?lastname;
            kwg-ont:fullName ?fullname;
            kwg-ont:personalPage ?webpage;
            kwg-ont:hasExpertise ?expertise;
            rdfs:label ?expert_name .
    ?type rdfs:label ?type_name.
    ?expertise rdfs:label ?expertise_name.
    ?department rdfs:label ?department_name.
    ?affiliation kwg-ont:locatedAt ?affiliation_loc;
                 rdfs:label ?affiliation_name.
    FILTER (?topic in (kwgr:topic.data_science, kwgr:topic.covid19))
    FILTER (?affiliation_loc in (kwgr:city.Seattle, kwgr:city.Boston))
} 
GROUP BY ?type_name ?expert_name ?affiliation_name ?department_name ?firstname ?lastname ?fullname ?webpage
```

#### Sample Result
<http://stko-roy.geog.ucsb.edu:7202/sparql?savedQueryName=Explore%20by%20Expertise%20(Complex)&owner=admin>

#### Missing
(1) Spatial-temporal filters for expertise
(2) Hazards as filters and their spatial-temporal filters

## Explore by Place

### Question 1 (Basic)
* What are the places (including cities, NWS zones and counties) in California?

#### SPARQL Query
```SPARQL
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX sosa: <http://www.w3.org/ns/sosa/>

select ?place_name ?place_type_name
{
	?place rdf:type ?place_type;
        rdfs:label ?place_name;
        kwg-ont:locatedAt kwgr:state.06.
    ?place_type rdfs:label ?place_type_name.
    FILTER (?place_type in (kwg-ont:City, kwg-ont:NWSZone, kwg-ont:County))
}
```

### Sample Result
<http://stko-roy.geog.ucsb.edu:7202/sparql?savedQueryName=Explore%20by%20Place%20(Basic)&owner=admin>

### Question 2 (Complex)
* Given the places (e.g., Lehigh) and time of interest (e.g., from 2007-01-10-0700 to 2007-01-10-1000 EST), what is the number of hazards that have happened in each place?

#### SPARQL Query
```SPARQL
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX sosa: <http://www.w3.org/ns/sosa/>

select ?place (COUNT(?hazard) as ?hazard_num)
{
	?hazard kwg-ont:locatedAt ?place;
         sosa:phenomenonTime ?phenomenontime.
    FILTER (?place in (kwgr:z.42061, kwgr:z.42062))
    FILTER (?phenomenontime in (kwgr:interval.200701100700_200701101000EST))
}
GROUP BY ?place
```

#### Sample Result
<http://stko-roy.geog.ucsb.edu:7202/sparql?savedQueryName=Explore%20by%20Place%20(Complex)&owner=admin>

#### Missing
(1) Expertise as filters and spatial-temporal filters for expertise
(2) Spatial-temporal filters for hazards

## Onclick Events

### Select Expertise
* Show expertise under selected topics (e.g., disease-related and hazard/disaster-related topics).

#### SPARQL Query
```SPARQL
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?expertise ?topic
{
    ?expertise kwg-ont:hasSuperTopic ?topic.
    FILTER (?topic in (kwgr:topic.Diseaserelated_Topic, kwgr:topic.Hazard_or_Disasterrelated_Topic)).
}
```

#### Sample Result
<http://stko-roy.geog.ucsb.edu:7202/sparql?savedQueryName=Select%20Expertise&owner=admin>

### Select Places
* Show places from selected categories (e.g., city, NWS zone and county).

#### SPARQL Query
```SPARQL
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?place ?place_type
{
    ?place rdf:type ?place_type;
    FILTER (?place_type in (kwg-ont:City, kwg-ont:NWSZone, kwg-ont:County))
}
```

#### Sample Result
<http://stko-roy.geog.ucsb.edu:7202/sparql?savedQueryName=Select%20Places&owner=admin>

### Select Hazards
* Show hazards from selected categories (e.g., debris flow and flood).

#### SPARQL Query
```SPARQL
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?hazard ?hazard_type
{
    ?hazard rdf:type ?hazard_type
    FILTER (?hazard_type in (kwg-ont:DebrisFlow, kwg-ont:Flood))
}
```

#### Sample Result
<http://stko-roy.geog.ucsb.edu:7202/sparql?savedQueryName=Select%20Hazards&owner=admin>

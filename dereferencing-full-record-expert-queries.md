# SPARQL Queries Used for Dereferencing Expert Full Records

The example queries are given using the example of an expert named David Lopez-Carr.

## Example: David Lopez-Carr

### kwgr:expert.carrlito.gmail.com

#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwgr:expert.carrlito.gmail.com}.
    ?subject ?predicate ?object.
}
```
### kwg-ont:Expert

#### SPARQL Query

```SPARQL
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
select ?subject ?predicate ?object
{
    values ?subject  {kwg-ont:Expert}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:firstName

#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:firstName}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:fullName

#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:fullName}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:lastName

#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:lastName}.
    ?subject ?predicate ?object.
}
```

### kwgr:expertise.other.Schistosomiasis.LOPEZ-CARR.DAVID

#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwgr:expertise.other.Schistosomiasis.LOPEZ-CARR.DAVID}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:hasTopic

#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:hasTopic}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:Topic

#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:Topic}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:hasSuperTopic

#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:hasSuperTopic}.
    ?subject ?predicate ?object.
}
```

### kwgr:topic.other
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwgr:topic.other}.
    ?subject ?predicate ?object.
}
```

### kwgr:topic.General_Medical_Public_Healthcarerelated_Topic
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwgr:topic.General_Medical_Public_Healthcarerelated_Topic}.
    ?subject ?predicate ?object.
}
```

#### Notes

The similar query also applies to kwgr:topic.Environmental_Agriculuturalrelated_Topic, kwgr:topic.Information_Technologyrelated_Topic and kwgr:topic.Business_Management.

### kwg-ont:hasTitle
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:hasTitle}.
    ?subject ?predicate ?object.
}
```

### kwgr:jobTitle.Academia.Unknown
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwgr:jobTitle.Academia.Unknown}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:Academia
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:Academia}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:JobTitle
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:JobTitle}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:associatedWith
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:associatedWith}.
    ?subject ?predicate ?object.
}
```

### kwgr:association.American_Association_of_Geographers
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwgr:association.American_Association_of_Geographers}.
    ?subject ?predicate ?object.
}
```

#### Notes
The similar query also applies to kwgr:association.American_Geophysical_Union, kwgr:association.American_Public_Health_Association and kwgr:association.Population_Association_of_America.

### kwg-ont:Organization
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:Organization}.
    ?subject ?predicate ?object.
}
```

#### Notes
The similar query also applies to kwgr:association.American_Geophysical_Union, kwgr:association.American_Public_Health_Association and kwgr:association.Population_Association_of_America.

### kwg-ont:hasAffiliation
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:hasAffiliation}.
    ?subject ?predicate ?object.
}
```

### kwgr:affiliation.DAVID_LOPEZCARR
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwgr:affiliation.DAVID_LOPEZCARR}.
    ?subject ?predicate ?object.
}
```

### kwg-ont:locatedIn
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwg-ont:locatedIn}.
    ?subject ?predicate ?object.
}
```

### kwgr:Earth.North_America.USA.5_1
#### SPARQL Query

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kwg-ont: <http://stko-roy.geog.ucsb.edu/lod/ontology/>
PREFIX kwgr: <http://stko-roy.geog.ucsb.edu/lod/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?subject ?predicate ?object
{
    values ?subject {kwgr:Earth.North_America.USA.5_1}.
    ?subject ?predicate ?object.
}
```

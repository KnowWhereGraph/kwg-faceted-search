# Create the Elasticsearch GraphDB Connector for the Direct Relief Use Case

## 

Type the following SPARQL queries for the index creation.

### 

#### SPARQL Query

```SPARQL
PREFIX :<http://www.ontotext.com/connectors/elasticsearch#>
PREFIX inst:<http://www.ontotext.com/connectors/elasticsearch/instance#>
INSERT DATA {
	inst:dr_index :createConnector '''
{
  "fields": [
    {
      "fieldName": "expertise",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/hasExpertise",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
    {
      "fieldName": "affiliation",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/affiliation",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
    {
      "fieldName": "department",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/department",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
    {
      "fieldName": "association",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/associatedWith",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
    {
      "fieldName": "firstName",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/firstName"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
    {
      "fieldName": "lastName",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/lastName"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
    {
      "fieldName": "fullname",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/fullName"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
    {
      "fieldName": "personalPage",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/personalPage"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
    {
      "fieldName": "locatedAt",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/locatedAt",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
    {
      "fieldName": "locatedIn",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/locatedIn",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "phenomenonTime",
      "propertyChain": [
        "http://www.w3.org/ns/sosa/phenomenonTime",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "superTopic",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/hasSuperTopic",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "topic",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/hasTopic",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "narrative",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/hasNarrative"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "impact",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/hasImpact",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "source",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/hasSource",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "featureOfInterest",
      "propertyChain": [
        "http://www.w3.org/ns/sosa/hasFeatureOfInterest",
        "http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "fipsCode",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/fipsCode"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "nwsCode",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/nwsCode"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "sameAs",
      "propertyChain": [
        "http://www.w3.org/2002/07/owl#sameAs",
		"http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "member",
      "propertyChain": [
        "http://www.w3.org/ns/sosa/hasMember",
		"http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "simpleResult",
      "propertyChain": [
        "http://www.w3.org/ns/sosa/hasSimpleResult"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "observableProperty",
      "propertyChain": [
        "http://www.w3.org/ns/sosa/observableProperty"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    },
	{
      "fieldName": "jobTitle",
      "propertyChain": [
        "http://stko-roy.geog.ucsb.edu/lod/ontology/hasTitle",
		"http://www.w3.org/2000/01/rdf-schema#label"
      ],
      "indexed": true,
      "stored": true,
      "analyzed": true,
      "multivalued": true,
      "ignoreInvalidValues": false,
      "fielddata": false,
      "array": false,
      "objectFields": []
    }
  ],
  "languages": [],
  "types": [
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Expert",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Department",
	"http://stko-roy.geog.ucsb.edu/lod/ontology/Affiliation",
	"http://stko-roy.geog.ucsb.edu/lod/ontology/Organization",
	"http://stko-roy.geog.ucsb.edu/lod/ontology/Expertise",
	"http://stko-roy.geog.ucsb.edu/lod/ontology/Place",
	"http://stko-roy.geog.ucsb.edu/lod/ontology/Hazard",
	"http://www.w3.org/ns/sosa/Observation",
	"http://www.w3.org/ns/sosa/ObservableProperty",
	"http://www.w3.org/ns/sosa/ObservationCollection",
	"http://stko-roy.geog.ucsb.edu/lod/ontology/JobTitle"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "elasticsearchNode": "http://128.111.106.227:9200",
  "elasticsearchBasicAuthUser": "elastic",
  "elasticsearchBasicAuthPassword": "knowwheregraph",
  "elasticsearchClusterSniff": true,
  "manageIndex": true,
  "manageMapping": true,
  "bulkUpdateBatchSize": 5000,
  "bulkUpdateRequestSize": 5242880
}
''' .
}
```
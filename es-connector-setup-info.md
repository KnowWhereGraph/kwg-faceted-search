# Create the Elasticsearch GraphDB Connector for the Direct Relief Use Case

## Create Three Example Indices

Type the following SPARQL queries for each index creation.

### Create the Place Index

#### SPARQL Query

```SPARQL
PREFIX :<http://www.ontotext.com/connectors/elasticsearch#>
PREFIX inst:<http://www.ontotext.com/connectors/elasticsearch/instance#>
INSERT DATA {
	inst:place_index :createConnector '''
{
  "fields": [
    {
      "fieldName": "placetype",
      "propertyChain": [
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
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
    "http://kwg.geog.ucsb.edu/lod/ontology/Place"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "elasticsearchNode": "http://128.111.106.227:9200",
  "elasticsearchClusterSniff": true,
  "manageIndex": true,
  "manageMapping": true,
  "bulkUpdateBatchSize": 5000,
  "bulkUpdateRequestSize": 5242880
}
''' .
}
```

### Create the Hazard Index

#### SPARQL Query

```SPARQL
PREFIX :<http://www.ontotext.com/connectors/elasticsearch#>
PREFIX inst:<http://www.ontotext.com/connectors/elasticsearch/instance#>
INSERT DATA {
	inst:hazard_index :createConnector '''
{
  "fields": [
    {
      "fieldName": "location",
      "propertyChain": [
        "http://128.111.106.227/lod/ontology/locatedAt"
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
      "fieldName": "hazardtype",
      "propertyChain": [
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
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
      "fieldName": "phenomenontime",
      "propertyChain": [
        "http://www.w3.org/ns/sosa/"
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
    "http://128.111.106.227/lod/ontology/Hazard"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "elasticsearchNode": "http://128.111.106.227:9200",
  "elasticsearchClusterSniff": true,
  "manageIndex": true,
  "manageMapping": true,
  "bulkUpdateBatchSize": 5000,
  "bulkUpdateRequestSize": 5242880
}
''' .
}
```

### Create the Expert Index

#### SPARQL Query

```SPARQL
PREFIX :<http://www.ontotext.com/connectors/elasticsearch#>
PREFIX inst:<http://www.ontotext.com/connectors/elasticsearch/instance#>
INSERT DATA {
	inst:expert_index :createConnector '''
{
  "fields": [
    {
      "fieldName": "expertise",
      "propertyChain": [
        "http://128.111.106.227/lod/ontology/hasExpertise",
        "http://www.w3.org/2000/01/rdf-schema#label",
        "http://128.111.106.227/lod/ontology/hasSuperTopic"
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
        "http://128.111.106.227/lod/ontology/affiliation",
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
        "http://128.111.106.227/lod/ontology/department",
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
      "fieldName": "firstname",
      "propertyChain": [
        "http://128.111.106.227/lod/ontology/firstName"
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
      "fieldName": "lastname",
      "propertyChain": [
        "http://128.111.106.227/lod/ontology/lastName"
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
        "http://128.111.106.227/lod/ontology/fullName"
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
      "fieldName": "personalpage",
      "propertyChain": [
        "http://128.111.106.227/lod/ontology/personalPage"
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
    "http://128.111.106.227/lod/ontology/Expert"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "elasticsearchNode": "http://128.111.106.227:9200",
  "elasticsearchClusterSniff": true,
  "manageIndex": true,
  "manageMapping": true,
  "bulkUpdateBatchSize": 5000,
  "bulkUpdateRequestSize": 5242880
}
''' .
}
```
# Creating the Elasticsearch GraphDB Connector 

## Instructions

Type the following SPARQL queries for the index creation.

### Main graph

The repository used is KnowWhereGraph-V2 on http://stko-kwg.geog.ucsb.edu:7200.

#### SPARQL Query

```SPARQL

PREFIX :<http://www.ontotext.com/connectors/elasticsearch#>
PREFIX inst:<http://www.ontotext.com/connectors/elasticsearch/instance#>
INSERT DATA {
	inst:kwg_index_v2 :createConnector '''
{
  "fields": [
    {
      "fieldName": "label",
      "propertyChain": [
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
      "fieldName": "comment",
      "propertyChain": [
        "http://www.w3.org/2000/01/rdf-schema#comment"
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
      "fieldName": "hasFireCause",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/hasFireCause",
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
      "fieldName": "hasIncidentName",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/hasIncidentName"
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
      "fieldName": "sfWithin",
      "propertyChain": [
        "http://www.opengis.net/ont/geosparql#sfWithin",
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
      "fieldName": "hasFireMappingAssessmentLabel",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/hasFireMappingAssessmentLabel",
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
      "fieldName": "hasFireName",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/hasFireName"
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
      "fieldName": "hasMappingProgram",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/hasMappingProgram",
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
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/locatedIn",
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
      "fieldName": "isFeatureOfInterestOf",
      "propertyChain": [
        "http://www.w3.org/ns/sosa/isFeatureOfInterestOf",
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
      "fieldName": "cbsaCode",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/cbsaCode"
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
      "fieldName": "cbsaName",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/cbsaName"
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
      "fieldName": "siteID",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/siteID"
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
      "fieldName": "hosts",
      "propertyChain": [
        "http://www.w3.org/ns/sosa/hosts",
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/pocValue"
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
      "fieldName": "climateDivisionFIPS",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/climateDivisionFIPS"
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
      "fieldName": "climateDivisionName",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/climateDivisionName"
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
      "fieldName": "climateDivisionNumber",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/climateDivisionNumber"
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
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/PrescribedFire",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Wildfire",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/ComplexFire",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/OutOfAreaResponseFire",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/UnknownFire",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/WildlandFireUse",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/AdministrativeRegion_0",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/AdministrativeRegion_1",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/AdministrativeRegion_2",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/AdministrativeRegion_3",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/AdministrativeRegion_4",
	"http://stko-kwg.geog.ucsb.edu/lod/ontology/NWZone",
	"http://stko-kwg.geog.ucsb.edu/lod/ontology/USClimateDivision",
	"http://stko-kwg.geog.ucsb.edu/lod/ontology/ZipCodeArea",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/AirQualitySite",
	"http://stko-kwg.geog.ucsb.edu/lod/ontology/EarthquakeEvent"
  ],
  "readonly": false,
  "detectFields": false,
  "importGraph": false,
  "elasticsearchNode": "http://stko-kwg.geog.ucsb.edu:9200",
  "elasticsearchBasicAuthUser": "elastic",
  "elasticsearchBasicAuthPassword": "JDC6sh1kaK6g1OZS1FJP",
  "elasticsearchClusterSniff": true,
  "manageIndex": true,
  "manageMapping": true,
  "bulkUpdateBatchSize": 5000,
  "bulkUpdateRequestSize": 5242880
}
''' .
}

```
# Creating the Elasticsearch GraphDB Connector 

## Instructions

Type the following SPARQL queries for the index creation.

### Main graph

The repository used is KWG-V3 on http://stko-kwg.geog.ucsb.edu/graphdb.

#### SPARQL Query

```SPARQL

PREFIX :<http://www.ontotext.com/connectors/elasticsearch#>
PREFIX inst:<http://www.ontotext.com/connectors/elasticsearch/instance#>
INSERT DATA {
	inst:kwg_es_index :createConnector '''
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
      "fieldName": "contributorFullName",
      "propertyChain": [
        "http://ld.iospress.nl/rdf/ontology/contributorFullName"
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
      "fieldName": "contributorRole",
      "propertyChain": [
        "http://ld.iospress.nl/rdf/ontology/contributorRole",
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
      "fieldName": "hasAliase",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/hasAliase"
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
      "fieldName": "hasDBLPID",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/hasDBLPID"
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
      "fieldName": "hasExpertise",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/hasExpertise",
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
      "fieldName": "citation",
      "propertyChain": [
        "http://gnis-ld.org/lod/gnis/ontology/citation"
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
      "fieldName": "featureId",
      "propertyChain": [
        "http://gnis-ld.org/lod/gnis/ontology/featureId"
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
      "fieldName": "mapName",
      "propertyChain": [
        "http://gnis-ld.org/lod/gnis/ontology/mapName"
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
      "fieldName": "officialName",
      "propertyChain": [
        "http://gnis-ld.org/lod/gnis/ontology/officialName"
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
      "fieldName": "hasFIPS",
      "propertyChain": [
        "http://stko-kwg.geog.ucsb.edu/lod/ontology/hasFIPS"
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
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Hurricane",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/EarthquakeEvent",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.cyclone",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.flood",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.hurricane",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.storm",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.wind",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.acute",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.aid",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.assistance",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.cash",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.cold_chain",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.damage",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.direct_assistance",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.disaster",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.disaster_related_illness",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.disease",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.displaced_individuals",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.electrocution",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.emergency_communication",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.emergency_medical",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.emergency_preparedness",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.epidemiology",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.exposure",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.health",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.humanitarian",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.illness",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.individuals_vulnerability",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.injury",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.logistical_support",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.medical_equipment",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.medical_supplies",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.medication",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.medicine",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.mobile_medical_units",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.mobility",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.nutritional_supplements",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.pharmaceuticals",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.power_outage",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.prevention",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.public_health",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.recovery",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.relief",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.response",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.risk_zone",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.supplies",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.targeted_assistance",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.treatment",
    "http://stko-kwg.geog.ucsb.edu/lod/ontology/Topic.vaccine",
    "http://ld.iospress.nl/rdf/ontology/Contributor",
    "http://gnis-ld.org/lod/usgs/ontology/Airport",
    "http://gnis-ld.org/lod/usgs/ontology/Arch",
    "http://gnis-ld.org/lod/usgs/ontology/Arroyo",
    "http://gnis-ld.org/lod/usgs/ontology/Bar",
    "http://gnis-ld.org/lod/usgs/ontology/Basin",
    "http://gnis-ld.org/lod/usgs/ontology/Bay",
    "http://gnis-ld.org/lod/usgs/ontology/Beach",
    "http://gnis-ld.org/lod/usgs/ontology/Bench",
    "http://gnis-ld.org/lod/usgs/ontology/Bend",
    "http://gnis-ld.org/lod/usgs/ontology/Bridge",
    "http://gnis-ld.org/lod/usgs/ontology/Building",
    "http://gnis-ld.org/lod/usgs/ontology/Canal",
    "http://gnis-ld.org/lod/usgs/ontology/Cape",
    "http://gnis-ld.org/lod/usgs/ontology/Cemetery",
    "http://gnis-ld.org/lod/usgs/ontology/Channel",
    "http://gnis-ld.org/lod/usgs/ontology/Church",
    "http://gnis-ld.org/lod/usgs/ontology/Cliff",
    "http://gnis-ld.org/lod/usgs/ontology/Crater",
    "http://gnis-ld.org/lod/usgs/ontology/Crossing",
    "http://gnis-ld.org/lod/usgs/ontology/Dam",
    "http://gnis-ld.org/lod/usgs/ontology/Flat",
    "http://gnis-ld.org/lod/usgs/ontology/Gap",
    "http://gnis-ld.org/lod/usgs/ontology/Glacier",
    "http://gnis-ld.org/lod/usgs/ontology/Gut",
    "http://gnis-ld.org/lod/usgs/ontology/Harbor",
    "http://gnis-ld.org/lod/usgs/ontology/Hospital",
    "http://gnis-ld.org/lod/usgs/ontology/Island",
    "http://gnis-ld.org/lod/usgs/ontology/Isthmus",
    "http://gnis-ld.org/lod/usgs/ontology/Lake",
    "http://gnis-ld.org/lod/usgs/ontology/Lava",
    "http://gnis-ld.org/lod/usgs/ontology/Mine",
    "http://gnis-ld.org/lod/usgs/ontology/MountainRange",
    "http://gnis-ld.org/lod/usgs/ontology/OilField",
    "http://gnis-ld.org/lod/usgs/ontology/Park",
    "http://gnis-ld.org/lod/usgs/ontology/Plain",
    "http://gnis-ld.org/lod/usgs/ontology/PopulatedPlace",
    "http://gnis-ld.org/lod/usgs/ontology/PostOffice",
    "http://gnis-ld.org/lod/usgs/ontology/Rapids",
    "http://gnis-ld.org/lod/usgs/ontology/Reservoir",
    "http://gnis-ld.org/lod/usgs/ontology/Ridge",
    "http://gnis-ld.org/lod/usgs/ontology/Rock",
    "http://gnis-ld.org/lod/usgs/ontology/School",
    "http://gnis-ld.org/lod/usgs/ontology/Slope",
    "http://gnis-ld.org/lod/usgs/ontology/Spring",
    "http://gnis-ld.org/lod/usgs/ontology/Stream",
    "http://gnis-ld.org/lod/usgs/ontology/Summit",
    "http://gnis-ld.org/lod/usgs/ontology/Swamp",
    "http://gnis-ld.org/lod/usgs/ontology/Tower",
    "http://gnis-ld.org/lod/usgs/ontology/Trail",
    "http://gnis-ld.org/lod/usgs/ontology/Tunnel",
    "http://gnis-ld.org/lod/usgs/ontology/Valley",
    "http://gnis-ld.org/lod/usgs/ontology/Waterfall",
    "http://gnis-ld.org/lod/usgs/ontology/Well"
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
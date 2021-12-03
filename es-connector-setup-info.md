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
	  "http://stko-kwg.geog.ucsb.edu/lod/ontology/AirQualitySite"
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
### Direct Relief subgraph

The repository used is KnowWhereGraph-V1 on http://stko-roy.geog.ucsb.edu:7202.

#### SPARQL Query

```SPARQL

PREFIX :<http://www.ontotext.com/connectors/elasticsearch#>
PREFIX inst:<http://www.ontotext.com/connectors/elasticsearch/instance#>
INSERT DATA {
	inst:dr_index_new :createConnector '''
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
    "http://www.w3.org/ns/sosa/Observation",
    "http://www.w3.org/ns/sosa/ObservableProperty",
    "http://www.w3.org/ns/sosa/ObservationCollection",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/JobTitle",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/City",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/State",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/NWSZone",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Marine",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/County",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Hail",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/ThunderstormWind",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Tornado",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/HeavySnow",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/HeavyRain",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/ExtremeColdWindChill",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Waterspout",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/FunnelCloud",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/RipCurrent",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Avalanche",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/HighWind",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/IceStorm",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Blizzard",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/HighSurf",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Flood",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Wildfire",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Drought",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/WinterStorm",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/WinterWeather",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/DenseFog",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/FlashFlood",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/StormSurgeTide",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/DustStorm",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/StrongWind",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/ExcessiveHeat",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Lightning",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/DebrisFlow",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/FrostFreeze",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Sleet",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Lake-EffectSnow",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/ColdWindChill",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Heat",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/DustDevil",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/TropicalStorm",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/MarineThunderstormWind",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/FreezingFog",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/MarineHail",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/CoastalFlood",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/MarineHighWind",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/AstronomicalLowTide",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/MarineStrongWind",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Sneakerwave",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/LakeshoreFlood",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/TropicalDepression",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/MarineTropicalStorm",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/DenseSmoke",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/MarineHurricaneTyphoon",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/MarineTropicalDepression",
    "http://stko-roy.geog.ucsb.edu/lod/ontology/Hurricane"
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
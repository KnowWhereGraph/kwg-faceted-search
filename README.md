# Faceted Search

The search interface for KnowWhereGraph.

## Building and Deploying

The project has two environments that it can be run under:

1. production: Uses the production endpoint and base address. This is typically used for general development.
2. stage: Uses the staging endpoint and base address. This is typically used when developing against a new graph.

### Generating the Cache

Before building, the cache must be generated. Handling this task before the actual angular build step ensures that the cache is included in the `dist/` folder. You'll need an empty folder `src/assets/data`; create it if it doesn't exist (`mkdir src/assets/data`).

To generate the cache, call either of the two commands below, depending on which environment you want

`npm run cache-prod`

or

`npm run cache-stage`

### Building

When building choose between the configurations specified in with the `--configuration` flag. The `production` flag should be used for production builds and `stage` for staging.

`ng build --configuration <production/stage/local>`

This command builds outputs the build in the `dist/` folder.

Building inside a Docker container is also supported for automation and to avoid any system dependencies. See the sections below for each environment.

#### Production

```bash
docker-compose docker-compose.production.yml -f up
```

#### Stage

```bash
docker-compose docker-compose.stage.yml -f up
```

#### Local

```bash
docker-compose docker-compose.local.yml -f up
```

### Deploying

There are three types of deployments:

1. Local: Normal development mode, run locally
2. Docker: Deploying with docker using nginx

#### Locally (Development Mode)

When working on the faceted-search, use the traditional `ng serve`. Visit the site locally at http://localhost:4200.

## Troubleshooting

### The GNIS/Hazard/Location Tree Facets Aren't Working

These facets are _dynamic_: their content is fetched from the graph endpoint and then rendered into a tree. Each type of tree has a different function for populating its children. To debug a broken tree, make sure that the endpoint is available.

### Autocomplete Facets Are Broken

The autocomplete suggestions are loaded from a cache and inserted into the DOM. If an autocomplete facet is broken, ensure that the cache file is loading though the network tab and check the console for errors. If it's not being loaded, make sure that the files exist; generate them if they don't (refer to the building section of the Readme) .If the cache _is_ being loaded, ensure that the subroutine responsible for loading it into the DOM is parsing it properly.

### The Table Isn't Populating

Each table is represented by a component. Table populating happens after component construction (when new tabs are visited) and when facets are changed. A number of queries are sent to fetch the data. The results are stored in an array in the table component, which the UI reads from. If the data isn't being shown in the table, there might be a problem with...

1. Any of the queries fetching the data
1. The processing of the query results (either in the query service or the table component)
1. The HTML doesn't match the underlying component data structure

### Results Aren't Shown on the Map

The location of each _thing_ (expert, hazard event, place) is returned from a SPARQL query. This same SPARQL query also retrieves the other information about the thing (label, etc). The locations are aggregated and then fired off in an event, to the map component which handles the logic of placing them on the map. If something isn't showing on the map

1. The query may be broken
1. The event may have broken
1. The map component isn't correctly handling the location data

### Query Status is Incorrect

The UI lets the user know what's happening with their query (running or counting). Each table component interacts with that portion of the UI through event messages. When a query starts, an event is triggered to let the search component know to update the status. Same when the query finishes and counting starts, and when counting finishes with the total number of results. If this status is incorrect it could be from a number of things.

1. Problem with the query
1. The events aren't firing where/when they need to
1. The search component isn't parsing the events properly

## Testing

Between releases, the project should go through a testing phase. A few key workflows are given below.

### Autocomplete Facets

The autocomplete facets should suggest the closest match to what you have typed into the facet. These include

1. Administrative Regions
1. Zip Codes
1. FIPS Codes
1. Climate Divisions
1. National Weather Zones

In each case, type the beginning of a value and make sure that the _closest_ match is suggested.

### Dynamic Facets

Make sure that the GNIS, Location, Expert, and Hazard Type tree selection facets expand properly. Also make sure that the query results look accurate.

### Table Links

Each result shown in the table is a clickable link that brings you to phhuzz.link. Confirm that, in each table view, the links are correct and bring you to the appropriate page.

### Table Pagination

Make sure that the table can correctly be navigated through by changing the number of results per page and then by changing the page.

## Versioning

The Faceted Search follows versioning conventions from [Semantic Versioning](https://semver.org/).

## Contributing

Contributions as issues and pull requests are welcome. New features should be made as pull requests into the `develop` branch and attached to an issue. The pull request should detail what was done, how it can be tested, and any relevant documentation updates. The project uses [prettier](https://prettier.io/) for code formatting, with line widths set to 120 characters.

Before creating pull requests, prettify your code changes with [prettier](https://prettier.io/).

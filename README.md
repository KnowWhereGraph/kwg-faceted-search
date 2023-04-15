<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
# Knowledge Explorer

The Knowledge Explorer is an AngularJS webapp designed to give an overview of the information stored in the backing graph database.

## Deploying

To deploy dr-app run the following from `dr-app/`,

```
npm install
npm start
```

## Contributing

The Knowledge Explorer is licensed under Apache 2. Code contributions are welcome; contributors should create branches under `stko-kwg` and create pull requests to merge into it.
=======
# FacetedSearch

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.2.
=======
=======
>>>>>>> 230b87cf (update my repo)
=======
>>>>>>> 92c43531 (Add Apache 2 license)
=======
>>>>>>> 1c30124f (Remove old src and update readme)
# Faceted Search


![License](https://img.shields.io/github/license/knowwheregraph/kwg-faceted-search.svg)
![Licensse](https://img.shields.io/github/issues/knowwheregraph/kwg-faceted-search.svg)


The search interface for KnowWhereGraph.
>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)

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

`ng build --configuration <production/stage>`

This command builds outputs the build in the `dist/` folder.

### Deploying

There are three types of deployments:

1. Local: Normal development mode, run locally
2. Docker: Deploying with docker using nginx
3. Server: Deployments on a server, using nginx

#### Locally (Development Mode)

When working on the faceted-search, use the traditional `ng serve`. Visit the site locally at http://localhost:4200.

#### Docker + NGINX

To run the full NGINX and Angular stack, run the docker container created from the included Dockerfile.

```bash
docker build -t faceted-search .
docker run -d -p 8080:80 faceted-search
```

Visit http://localhost:8080 for the deployment.

#### Staging & Production Servers

When deploying on the staging or production servers, first fetch the cache, then build the project, and finally copy the files to a location that is being served by NGINX.

For example,

```bash
npm run cache-prod
npm run build --configuration=stage
cp -r dist/faceted-search/* /var/www/html
```

## Versioning

The Faceted Search follows versioning conventions from [Semantic Versioning](https://semver.org/).

## Contributing

Contributions as issues and pull requests are welcome. New features should be made as pull requests into the `develop` branch and attached to an issue. The pull request should detail what was done, how it can be tested, and any relevant documentation updates. The project uses [prettier](https://prettier.io/) for code formatting, with line widths set to 120 characters.

Before creating pull requests, lint the project with

`ng lint`


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
<<<<<<< HEAD

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

<<<<<<< HEAD
<<<<<<< HEAD
## Components
The application has been broken into discrete component objects. Every page has the `nav` and the `footer` components; the rest of the page's content is driven by other components.

Each type of search (Place, Hazard, Person) has its own component. This has resulted in a fair amount of code overlap and isn't DRY. This is mostly due to not seeing the forest through the trees; in the future we may find that we can combine all tables into one.

### facets
The `facets` component is responsible for displaying and emitting events about user selections. As of right now (03/02/2022) the event system hasn't been written.

The appropriate facets are displayed based on the current selected tab index of the Angular Material Tab control in the `search` component. When new tabs are selected, an event is fired to update the corresponding tab index variable in the `facets` component which the template uses.

### footer
The `footer` component is responsible for the website footer

### hazards-table
The `hazards-table` has the logic for the table when users select the 'hazards' tab on the `search` component.

### index
The `index` component is responsible for the content on the main landing page.

### nav
The `nav` component is responsible for the website banner and navigation links.

### places-table
The `places-table` component is responsible for the table that's rendered when users select the 'Places' tab in the `search` component.

### search
<<<<<<< HEAD
The search component is the main view of the search page. It contains the `facets` component and the various table components.

The number of results from user searches is also displayed in this component and is obtained through child-parent data sharing using events from the table components

>>>>>>> 0b1c11c0 (Initial project commit with most of the basic components)
=======
The search component is the main view of the search page. It contains the `facets` component, each of the different tables, and the map component.
>>>>>>> feb11910 (Add support for generating the cache via cli. Switch the format over to csv to save space and refactor the cache-reading code to compensate for the format difference)
=======
Contributions as issues and pull requests are welcome. New features should be made as pull requests into the `develop` branch and attached to an issue. The pull request should detail what was done, how it can be tested, and any relevant documentation updates.
>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)
=======
Contributions as issues and pull requests are welcome. New features should be made as pull requests into the `develop` branch and attached to an issue. The pull request should detail what was done, how it can be tested, and any relevant documentation updates. The project uses [prettier](https://prettier.io/) for code formatting, with line widths set to 120 characters.

Before creating pull requests, lint the project with

`ng lint`
<<<<<<< HEAD
>>>>>>> 421c4d2f (Add a code formatter & linter)
=======
=======
# KWG-Faceted-Search
=======
# Knowledge Explorer
>>>>>>> 310a3110 (Add Apache 2 license)

The Knowledge Explorer is an AngularJS webapp designed to give an overview of the information stored in the backing graph database.

## Deploying

To deploy dr-app run the following from `dr-app/`,

```
npm install
npm start
<<<<<<< HEAD
```
>>>>>>> 0bf31404 (update my repo)
<<<<<<< HEAD
>>>>>>> 230b87cf (update my repo)
=======
=======
```

## Contributing

The Knowledge Explorer is licensed under Apache 2. Code contributions are welcome; contributors should create branches under `stko-kwg` and create pull requests to merge into it.
>>>>>>> 310a3110 (Add Apache 2 license)
>>>>>>> 92c43531 (Add Apache 2 license)
=======
>>>>>>> 1c30124f (Remove old src and update readme)

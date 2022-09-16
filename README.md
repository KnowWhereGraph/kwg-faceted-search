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
# Faceted Search
The search interface for KnowWhereGraph.
>>>>>>> 8520741e (Update the documentation for the code and restructure the Readme)

## Building and Deploying
The project has two environments that it can be run under:

1. production: Uses the production endpoint and base address. This is typically used for general development.
2. stage: Uses the staging endpoint and base address. This is typically used when developing against a new graph.


### Generating the Cache

Before building, the cache must be generated. Handling this task before the actual angular build step ensures that the cache is included in the `dist/` folder. You'll need an empty folder `src/assets/data`; create it if it doesn't exist (`mkdir src/assets/data`).

To generate the cache, call either of the two commands below, depending on which environment you want

`npm run cache-production`

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

## Contributing

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

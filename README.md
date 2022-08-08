# FacetedSearch

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.2.

## Building and Deploying

The project has two modes that it can be run under:
1. production: Uses the production endpoint and base address
2. stage: Uses the staging endpoint and base address

In either case, the source is built to a `./dist` folder which is then served by NGINX.

### Cache Generation and Building

Before building, the cache must be generated. Handling this task before building will ensure that they're included in the `dist/` folder. The cache generation script has no way of telling which environment file . Because of this, the base url needs to be included in the call to the execution of the script-seen in `package.json`. To generate the cache, call either of the two commands below

`npm run cache-stage`

or

`npm run cache-prod`

Building works similarly however, the deployment URL's are kept in the `environment.ts` file, conforming to Angular's build conventions.

To choose between configurations, use the `--configuration` flag, outlined in the Angular documentation. The `production` flag should be used for production builds and `stage` for staging.

`ng build --configuration <production/stage>`

### Deploying

#### Development Mode
When working on the faceted-search, use the traditional `ng serve`. Visit the site locally at http://localhost:4200.

#### Locally
To run the full NGINX and Angular stack, first download the cache, then build the source, and then use the included Dockerfile.

Together,

```

docker build -t faceted-search .
docker run -d -p 8080:80 faceted-search
```

Visit http://localhost:8080 for the deployment.



#### Staging & Production
When deploying on the staging or production servers, first fetch the cache, then build the project, and copy the files to .....

The single page architecture requires the nginx configuration to include `try_files $uri /index.html`. 

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
The search component is the main view of the search page. It contains the `facets` component, each of the different tables, and the map component.

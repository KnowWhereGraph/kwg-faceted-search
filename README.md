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

## Building and Deploying

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

To run locally, run `ng serve` for a dev server and navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Components
The application has been broken into discrete component objects. Every page has the `nav` and the `footer` components; the rest of the page's content is driven by other components.

Each type of search (Place, Hazard, Person) has its own component. This has resulted in a fair amount of code overlap and isn't DRY. This is mostly due to not seeing the forest through the trees; in the future we may find that we can combine all tables into one.

### about
The `about` component controls the content that's rendered when users visit the `/about` page.

### explore
The `explore` component controls the content that's rendered when users visit the `/explore` page.

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
The search component is the main view of the search page. It contains the `facets` component and the various table components.

The number of results from user searches is also displayed in this component and is obtained through child-parent data sharing using events from the table components

>>>>>>> 0b1c11c0 (Initial project commit with most of the basic components)

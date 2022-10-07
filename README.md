# Faceted Search
The search interface for KnowWhereGraph.

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

Contributions as issues and pull requests are welcome. New features should be made as pull requests into the `develop` branch and attached to an issue. The pull request should detail what was done, how it can be tested, and any relevant documentation updates.

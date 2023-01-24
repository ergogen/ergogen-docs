# Ergogen documentation

This repository contains the documentation for [Ergogen](https://github.com/ergogen/ergogen).  
The latest version is deployed [here](https://docs.ergogen.xyz/).

### Contributing

To submit improvements and fixes to the documentation: fork this repository and make your changes in [/docs](./docs).
You can preview your changes using a local setup or by submitting a PR to get a deployment preview built for you.

### Deployment

PRs that are merged into the `main` branch will automatically be deployed to https://docs.ergogen.xyz/ using GitHub actions.

### Local Development

```
$ yarn
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server. Note that Node.js v17 changed to OpenSSL 3.0, causing a startup error in the current config, which (for the time being) can be circumvented by using `NODE_OPTIONS="--openssl-legacy-provider" yarn start` instead.

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

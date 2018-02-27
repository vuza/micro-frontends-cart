# Micro frontends: Cart

This repository is part of a proof of concept, implementing micro frontends, see https://github.com/vuza/micro-frontends for "What the hell are micro frontends".

This repository contains the UI and business logic of the POC's shopping cart. The whole application's entry point is `./index.js`. The UI gets rendered at `./src/ui/index.js` and the React.js application can be found at `./src/ui/widget/`. There is also a backend part for adding products to the cart, which can be found at `./src/api/index.js`.

## Usage

Type `npm run start:watch` for development. It'll hot reload your application on changes. See `travis.yml` for AWS Elastic Beanstalk deployment.

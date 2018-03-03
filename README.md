# WorldCup Prono 2018

[![Greenkeeper badge](https://badges.greenkeeper.io/wilsto/worldprono2018.svg)](https://greenkeeper.io/)

[![Watch the video](https://github.com/wilsto/worldprono2018/blob/master/client/assets/images/YouTube_thumb.png)](https://youtu.be/qJ3eIZDXu9M)

## Pour commencer
Ce projet a été généré avec [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.5.0.

- Build Systems: Grunt
- Testing: Mocha + Chai (assertions: Expect) + Sinon

### Client
- Scripts: TypeScript
- Markup: HTML
- Stylesheets: CSS
- Angular Routers: ui-router
- CSS Frameworks: Bootstrap + UI Bootstrap

### Server
- Scripts: Babel
- Database:MongoDB
- Authentication boilerplate: Yes
- oAuth integrations: Facebook Twitter Google
- Socket.io integration: Yes

### Prérequis

- [Git](https://git-scm.com/)
- [gitKraken](https://www.gitkraken.com/)
- [Node.js and npm](nodejs.org) Node ^6.11.1, npm ^3.9.5
- [Yarn](https://yarnpkg.com/) (`npm install --global yarn`)
- [Bower](bower.io) (`npm install --global bower`)
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Installation
1. Run `yarn install` to install server dependencies.
2. Run `bower install` to install front-end dependencies.

### Developpement
3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running
4. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development
Run `grunt build` for building and `grunt serve` for preview.

## Testing
Running `npm test` will run the unit tests with karma.

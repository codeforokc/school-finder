# School Finder Frontend

 Frontend for the school finder app.

## Contributing
 See the [School Finder Contributor Guide](CONTRIBUTOR_GUIDE.md).

## Structure

 This is an [AngularJS](https://angularjs.org/) application. The app is located in the app folder.

## Folders

 - app - holds the final application code
    - css - where stylesheets are located
    - scripts - where external scripts are located
 - tests - where tests are located

## Dependencies
 NPM is used to keep track of dependencies.

## Styling
 We're using [Bootstrap](http://getbootstrap.com/) to style the frontend.

## Initializing the Environment

 - CD to school-finder-frontend
 - Run `npm install` via the command line

## Launching the App

 - Run app/index.html through your IDE of choice.

## Testing

 [Karma](http://karma-runner.github.io/0.12/index.html), [Mocha](http://mochajs.org/), and [Chai](http://chaijs.com/)

 The Karma configuration file is located in school-finder-fronted folder.

#### Key Karma Configurations

 - [reporters](https://github.com/codeforokc/school-finder/blob/master/school-finder-frontend/karma.conf.js#L30): We're currently using "Nyan" via the command line.
 - [browsers](https://github.com/codeforokc/school-finder/blob/master/school-finder-frontend/karma.conf.js#L58): We're currently using PhantomJS (a headless browser). This allows us to run the tests against a browser without actually launching a browser.

#### Running the tests

 - CD to school-finder-frontend
 - Run `npm test` at the command line

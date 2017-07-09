# TS Project #

A generic frontend project boiler plate in **TypeScript** with **source map** support.

Main features:

* Source Map support
* Incremental Build
* Unit tests
* Browser auto-refresh


Main dependencies:

* **Application Server**: [Node](https://nodejs.org/en/)
* **Compiler**: [TypeScript](https://github.com/Microsoft/TypeScript)
* **Linter**: [TSLint](https://github.com/palantir/tslint)
* **Task Runner**: [Gulp](https://github.com/gulpjs/gulp)
* **JavaScript File Bundler**: [Browserify](https://github.com/substack/node-browserify)
* **Code Minifier**: [Uglify](https://github.com/mishoo/UglifyJS2)
* **HTTP Server**: [BrowserSync](https://github.com/Browsersync/browsersync.github.io)
* **Unit Test Runner**: [Tape](https://github.com/substack/tape)


## Installation ##

Node, TypeScript and TSLint should be installed globally.

	$> git clone https://github.com/yahiko00/TSProject.git <new folder>
	$> cd <new folder>
	$> git init
	$> npm install


## Build ##

Project settings are defined in `package.json`, `settings` section. Inside this section, set `debug` to `true` to debug the project with source maps, or set `debug` to `false` to build the project in the release mode.

Tasks are defined in the `gulpfile.js` script.

Commands should be run under a **bash** shell.

The following command builds the project, runs unit tests, and opens the browser. If any change happens, it builds the project again and refreshes the browser.

	$> npm run watchRefresh

For more predefined commands, see `package.json`, item `scripts`.

Unit tests are logged in the `tests/` folder, file `tape.log`.

## Contributors ##

yahiko


## Licence ##

ISC

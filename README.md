# newman-reporter-htmlextra

![Newman htmlextra Reporter Logo](./examples/NewmanHtmlextraReporterLogo.png)

[![Build and Test](https://github.com/DannyDainton/newman-reporter-htmlextra/workflows/Build%20and%20Test/badge.svg)](https://github.com/DannyDainton/newman-reporter-htmlextra/actions)
[![NPM Version](https://img.shields.io/npm/v/newman-reporter-htmlextra.svg?style=flat-square)](https://www.npmjs.com/package/newman-reporter-htmlextra)
[![NPM Weekly Downloads](https://img.shields.io/npm/dw/newman-reporter-htmlextra.svg?style=flat-square)](https://www.npmjs.com/package/newman-reporter-htmlextra)
[![NPM Downloads](https://img.shields.io/npm/dt/newman-reporter-htmlextra.svg?style=flat-square)](https://www.npmjs.com/package/newman-reporter-htmlextra)
[![Docker Pulls](https://img.shields.io/docker/pulls/dannydainton/htmlextra?style=flat-square)](https://hub.docker.com/r/dannydainton/htmlextra)

A [Newman](https://github.com/postmanlabs/newman) HTML reporter that has been extended to include the separation of the iteration runs so these are no longer aggregated together and also some additional `handlebars helpers` to enable users to create better custom templates. 

This reporter comes with a dashboard style summary landing page and a set of different tabs which contain the detailed request information. There are also a few optional configuration flags available, to tailor the final report in a number of different ways.

---

If you're a fan of the project and you wanted to show your appreciation by keeping me highly caffeinated - You can do that here 😍

<a href="https://www.buymeacoffee.com/htmlextra" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="35" width="165"></a>

---

## Report Example

![Default Report](./examples/Default_Report.gif)

---

## Interactive Example Report

To give you an idea of what the final report will look like, I've added a working example here for you to get your hands on:

- [Standard Report Showing All Successful Requests](https://s3.eu-west-2.amazonaws.com/newman-htmlextra-reports/All_Passed.html)

---

## Install

> The reporter works as a plugin with [Newman](https://github.com/postmanlabs/newman) so ensure that you have already installed that package globally, using `npm install -g newman`.

To `globally` install the `htmlextra` package:

```console
npm install -g newman-reporter-htmlextra
```

To use `htmlextra` as a library, install the package as a dependency into a `nodejs` project's `package.json` file using:

```console
npm install -S newman-reporter-htmlextra
```

To install `node`, `newman` and the `htmlextra` packages together, use this command to pull the `Docker` image:

```console
docker pull dannydainton/htmlextra
```

---

## Usage

In order to enable this reporter, specify `htmlextra` in Newman's `-r` or `--reporters` option. The following command will create a new report in the `./newman` directory, if the directory does not exist, it will be created as part of the Newman run.

```console
newman run collection.json -r htmlextra
```

### CLI Options

#### With Newman CLI

| CLI Option  | Description       | Example |
|-------------|-------------------|---------|
| `--reporter-htmlextra-export <path>` | Specify a path where the output HTML file will be written to disk. If not specified, the file will be written to `newman/` in the current working directory. | `newman run collection.json -r htmlextra --reporter-htmlextra-export ./results/report.html`|
| `--reporter-htmlextra-template <path>` | Specify a path to the custom template which will be used to render the HTML report. This option depends on `--reporter htmlextra` and `--reporter-htmlextra-export` being present in the run command. If this option is not specified, the [default template](./lib/dashboard-template.hbs) is used | `newman run collection.json -r htmlextra --reporter-htmlextra-template ./template.hbs`|
| `--reporter-htmlextra-showOnlyFails` | Use this optional flag to tell the reporter to display only the requests with failed tests. | `newman run collection.json -r htmlextra --reporter-htmlextra-showOnlyFails`|
| `--reporter-htmlextra-testPaging` | Use this optional flag to add pagination to the tests in the request view. | `newman run collection.json -r htmlextra --reporter-htmlextra-testPaging`|
| `--reporter-htmlextra-browserTitle` | Use this optional flag to change the name of the title in the browser tab. The default name is "Newman Summary Report". | `newman run collection.json -r htmlextra --reporter-htmlextra-browserTitle "My Newman report"`|
| `--reporter-htmlextra-title` | This optional flag can be used to give your report a different main `Title` in the centre of the report. If this is not set, the report will show "Newman Run Dashboard". | `newman run collection.json -r htmlextra --reporter-htmlextra-title "My Newman Report"`|
| `--reporter-htmlextra-titleSize` | An optional flag to reduce the size of the main report title. The sizes range from `1` to `6`, the higher the number, the smaller the title will be. The default size is `2`. | `newman run collection.json -r htmlextra --reporter-htmlextra-titleSize 4`|
| `--reporter-htmlextra-logs` | This optional flag shows any console log statements in the collection, on the final report. This is `false` by default. | `newman run collection.json -r htmlextra --reporter-htmlextra-logs`|
| `--reporter-htmlextra-hideRequestBody` | An optional flag which allows you to exclude certain `Request Bodies` from the final report. Enter the name of the request that you wish to hide. | `newman run collection.json -r htmlextra --reporter-htmlextra-hideRequestBody "Login"`|
| `--reporter-htmlextra-hideResponseBody` | An optional flag which allows you to exclude certain `Response Bodies` from the final report. Enter the name of the request that you wish to hide. | `newman run collection.json -r htmlextra --reporter-htmlextra-hideResponse "Auth Request"`|
| `--reporter-htmlextra-showEnvironmentData` | An optional flag which allows you to show all the `Environment` variables used during the run, in the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-showEnvironmentData`|
| `--reporter-htmlextra-skipEnvironmentVars` | An optional flag which allows you to exclude certain `Environment` variables from the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-skipEnvironmentVars "API_KEY"`|
| `--reporter-htmlextra-showGlobalData` | An optional flag which allows you to show all the `Global` variables used during the run, in the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-showGlobalData`|
| `--reporter-htmlextra-skipGlobalVars` | An optional flag which allows you to exclude certain `Global` variables from the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-skipGlobalVars "API_TOKEN"`|
| `--reporter-htmlextra-omitHeaders` | An optional flag which allows you to exclude all `Headers` from the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-omitHeaders`|
| `--reporter-htmlextra-skipHeaders` | An optional flag which allows you to exclude certain `Headers` from the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-skipHeaders "Authorization"`|
| `--reporter-htmlextra-skipSensitiveData` | An optional flag that will exclude all the `Request/Response Headers` and the `Request/Response bodies`, from each request in the final report. This will only show the main request info and the Test Results. This is `false` by default. | `newman run collection.json -r htmlextra --reporter-htmlextra-skipSensitiveData`|
| `--reporter-htmlextra-showMarkdownLinks` | An optional flag which allows you render Markdown links from the test names and `pm.expect()` statements, in the final report. This could be useful if you use an external bug tracker. | `newman run collection.json -r htmlextra --reporter-htmlextra-showMarkdownLinks`|
| `--reporter-htmlextra-noSyntaxHighlighting` | An optional flag which allows you disable the code syntax highlighting. This _could_ enhance the performance of opening larger reports. | `newman run collection.json -r htmlextra --reporter-htmlextra-noSyntaxHighlighting`|
| `--reporter-htmlextra-showFolderDescription` | An optional flag which allows you to show all the folder descriptions, in the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-showFolderDescription`|
| `--reporter-htmlextra-timezone` | An optional flag which allows you to set the timezone on the final report's timestamp | `newman run collection.json -r htmlextra --reporter-htmlextra-timezone "Australia/Sydney"`|

---

#### With Newman as a Library

All the CLI functionality is available for programmatic use within a `nodejs` script.

Creating a very basic `nodejs` project can be done like this:

- Create a new directory using `mkdir <new dir name>`
- Move to the new directory using `cd <new dir name>`
- Create a `package.json` file using `npm init -y`
- Install the required node modules using `npm i -S newman newman-reporter-htmlextra`
- Create a new `<filename>.js` file and add the script below which contains the current list of reporter options
- Add your `collection.json` file reference to the script and run using `node <filename>.js`

Once the node script has run, the report will be created in the default `./newman` directory. A new save location can be specified using the `export` flag. 

To enable the functionality of a given feature, uncomment any of the options within the `htmlextra` object. 

```javascript
const newman = require('newman');

newman.run({
    collection: './pathToFile/collection.json', // Collection URL from a public link or the Postman API can also be used
    reporters: ['htmlextra'],
    iterationCount: 1,
    reporter: {
        htmlextra: {
            // export: './report.html',
            // template: './template.hbs'
            // logs: true,
            // showOnlyFails: true,
            // noSyntaxHighlighting: true,
            // testPaging: true,
            // browserTitle: "My Newman report",
            // title: "My Newman Report",
            // titleSize: 4,
            // omitHeaders: true,
            // skipHeaders: "Authorization",
            // hideRequestBody: ["Login"],
            // hideResponseBody: ["Auth Request"],
            // showEnvironmentData: true,
            // skipEnvironmentVars: ["API_KEY"],
            // showGlobalData: true,
            // skipGlobalVars: ["API_TOKEN"],
            // skipSensitiveData: true,
            // showMarkdownLinks: true,
            // showFolderDescription: true,
            // timezone: "Australia/Sydney"
        }
    }
});
```
---

#### Running The Reporter With Docker

A docker image `dannydainton/htmlextra` has been created for the reporter and can be found on [Docker Hub](https://hub.docker.com/repository/docker/dannydainton/htmlextra)

#### Basic Usage

Using this command, it will pull down the image and run the Postman Collection with Newman. Once the run has completed it will create a new report file in the `/newman` dir.

```console
docker run -t -v $(pwd):/etc/newman dannydainton/htmlextra run collection.json -r htmlextra
```

Using an environment file during the Newman run:

```console
docker run -t -v $(pwd):/etc/newman dannydainton/htmlextra run collection.json -e environment.json -r htmlextra
```

Using either the Shared Collection link from the Postman App or using the Postman API Link to the files:

```console
docker run -t -v $(pwd):/etc/newman dannydainton/htmlextra run <URL to Collection> -e <URL to Environment> -r htmlextra
```

Each of these command can be used with the different CLI flags to create the final report that you require.

---

## Compatibility

| **newman-reporter-htmlextra** | **newman** | **node** |
|:------------------------:|:----------:|:--------:|
|         >= v1.1.0          | >= v4.2.3  | >= v10.x  |

---

## Project Contributors

I would be lying if I said that I've created this reporter all on my own, I need to say a massive **_Thank You!_** to the following folks for helping make `htmlextra` even better:

- [@codenirvana](https://github.com/codenirvana)
- [@ldz-w](https://github.com/ldz-w)
- [@sam-viz](https://github.com/sam-viz)
- [@bassie1995](https://github.com/bassie1995)
- [@praveendvd](https://github.com/praveendvd)
- [@Prachi481992](https://github.com/Prachi481992)

A huge amount of love and appreciation also goes to [Bruce](https://twitter.com/BruceOnlyBruce) _The Legend_, for creating the awesome project logo ♥️

---

## License

This software is licensed under Apache-2.0. See the [LICENSE.md](LICENSE.md) file for more information.

---

## Special mention

This work have been hugely inspired and copied several aspects of the great work done by [Martijn Vander Vlag](https://github.com/martijnvandervlag) to create the [newman-reporter-htmlfull](https://github.com/martijnvandervlag/newman-reporter-htmlfull) package. Check out that package too, this contains many of the same aggregation features.

It was also brought together by reviewing the feature requests, from the official [Postman HTML reporter](https://github.com/postmanlabs/newman-reporter-html) and implementing them into this reporter.

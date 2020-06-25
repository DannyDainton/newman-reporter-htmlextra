# newman-reporter-htmlextra

[![Build and Test](https://github.com/DannyDainton/newman-reporter-htmlextra/workflows/Build%20and%20Test/badge.svg)](https://github.com/DannyDainton/newman-reporter-htmlextra/actions)
[![NPM Version](https://img.shields.io/npm/v/newman-reporter-htmlextra.svg?style=flat-square)](https://www.npmjs.com/package/newman-reporter-htmlextra)
[![NPM Weekly Downloads](https://img.shields.io/npm/dw/newman-reporter-htmlextra.svg?style=flat-square)](https://www.npmjs.com/package/newman-reporter-htmlextra)
[![NPM Downloads](https://img.shields.io/npm/dt/newman-reporter-htmlextra.svg?style=flat-square)](https://www.npmjs.com/package/newman-reporter-htmlextra)
[![Docker Pulls](https://img.shields.io/docker/pulls/dannydainton/htmlextra?style=flat-square)](https://hub.docker.com/r/dannydainton/htmlextra)

A [Newman](https://github.com/postmanlabs/newman) HTML reporter that has been extended to include the separation of the iteration runs so these are no longer aggregated together and also some additional `handlebars helpers` to enable users to create better custom templates. This reporter comes with a default dashboard-style template which also includes a `Dark Theme` switcher. There are also a few optional flags available, you can find these all listed below.

---

## Interactive Example Report

To give you an idea of what the final report will look like, I've added a working example here for you to get your hands on:

- [Standard Report Showing All Successful Requests](https://s3.eu-west-2.amazonaws.com/newman-htmlextra-reports/All_Passed.html)

---

## Basic Usage

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

---

## CLI Options

The reporter comes with several different options that allow you to change different aspects of the final report and hide certain pieces of information that you do not want to be shown in the output.

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
| `--reporter-htmlextra-hideResponse` | An optional flag which allows you to exclude certain `Response Bodies` from the final report. Enter the name of the request that you wish to hide. | `newman run collection.json -r htmlextra --reporter-htmlextra-hideResponse "Auth Request"`|
| `--reporter-htmlextra-showEnvironmentData` | An optional flag which allows you to show all the `Environment` variables used during the run, in the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-showEnvironmentData`|
| `--reporter-htmlextra-skipEnvironmentVars` | An optional flag which allows you to exclude certain `Environment` variables from the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-skipEnvironmentVars "API_KEY"`|
| `--reporter-htmlextra-omitHeaders` | An optional flag which allows you to exclude all `Headers` from the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-omitHeaders`|
| `--reporter-htmlextra-skipHeaders` | An optional flag which allows you to exclude certain `Headers` from the final report | `newman run collection.json -r htmlextra --reporter-htmlextra-skipHeaders "Authorization"`|
| `--reporter-htmlextra-skipSensitiveData` | An optional flag that will exclude all the `Request/Response Headers` and the `Request/Response bodies`, from each request in the final report. This will only show the main request info and the Test Results. This is `false` by default. | `newman run collection.json -r htmlextra --reporter-htmlextra-skipSensitiveData`|
| `--reporter-htmlextra-showMarkdownLinks` | An optional flag which allows you render Markdown links from the test names and `pm.expect()` statements, in the final report. This could be useful if you use an external bug tracker. | `newman run collection.json -r htmlextra --reporter-htmlextra-showMarkdownLinks`|
| `--reporter-htmlextra-noSyntaxHighlighting` | An optional flag which allows you disable the code syntax highlighting. This _could_ enhance the performance of opening larger reports. | `newman run collection.json -r htmlextra --reporter-htmlextra-noSyntaxHighlighting`|

Custom templates can be passed to the `htmlextra` reporter via the `--reporter-htmlextra-template <path>` flag. The [default template](./lib/dashboard-template.hbs) is used in all other cases. 

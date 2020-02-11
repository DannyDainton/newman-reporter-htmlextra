# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

-----------------------------------------------------------------------

## [1.11.0] - 2020-02-11

### Added

- Pass/Fail iteration tab colours
- Filter for Iterations
- Selected Iteration label
- Style changes to the Iteration tabs

-----------------------------------------------------------------------

## [1.10.1] - 2020-02-03

### Added

- Includes additional buttons for expanding/collapsing all the requests

-----------------------------------------------------------------------

## [1.10.0] - 2020-02-03

### Fixed

- Fixed the sizing on the main summary panels if the number are greater than 9999
- Iteration tab is now more visible when the iteration is selected
- Closed some unclosed `<div>` tags in the default templates (Credit to @bassie1995)

### Added

- Added the `omitHeaders` flag to hide _all_ headers from the requests and responses

-----------------------------------------------------------------------

## [1.9.2] - 2019-10-23

### Fixed

- Fixed an issue with the `Back To Top` button that caused a flood of errors in the console

-----------------------------------------------------------------------

## [1.9.1] - 2019-10-21

### Added

- Includes a `Back To Top` button for all the different tabs
- Fixed some inconsistency in the style of the different tabs

-----------------------------------------------------------------------

## [1.9.0] - 2019-10-21

### Added

- Supports displaying a GraphQL Request Body and any GraphQL Variables

-----------------------------------------------------------------------

## [1.8.9] - 2019-09-24

### Added

- Added an option to hide certain headers from requests and responses by name (Credit to @bassie1995)
- Added an option to skip outputting headers and bodies in all requests and responses (Credit to @bassie1995)

-----------------------------------------------------------------------

## [1.8.8] - 2019-09-01

### Added

- Added a button to give users the ability to copy the `request body` to the clipboard

-----------------------------------------------------------------------

## [1.8.7] - 2019-09-01

### Added

- Added support to format XML responses (Credit to @ldz-w)

-----------------------------------------------------------------------

## [1.8.6] - 2019-08-02

### Updated

- Updated the node package dependencies

-----------------------------------------------------------------------

## [1.8.5] - 2019-07-17

### Fixed

- Fixed a bug that prevented the Expand/Collapse buttons from working on multiple iterations

-----------------------------------------------------------------------

## [1.8.4] - 2019-07-17

### Fixed

- Bumping the version to manually publish a new NPM version

-----------------------------------------------------------------------

## [1.8.3] - 2019-07-17

### Added

- Added support for `urlencoded` request bodies
- Added new tests to cover this request body type
- Added a visual clue to the `request` bar to show the number of `skipped` tests

-----------------------------------------------------------------------

## [1.8.2] - 2019-07-12

### Fixed

- Fixed the incorrectly formatted JSON on the response body

-----------------------------------------------------------------------

## [1.8.1] - 2019-06-28

### Fixed

- Syntax error in the templates causing iterations on Safari to fail (Credit to @sam-viz)

-----------------------------------------------------------------------

## [1.8.0] - 2019-06-28

### Added

- Added support for `formdata` request bodies (Credit to @Prachi481992)
- Added new tests to cover this request body type

-----------------------------------------------------------------------

## [1.7.6] - 2019-06-26

### Fixed

- Incorrect spelling on the template

-----------------------------------------------------------------------

## [1.7.5] - 2019-06-24

### Updated

- Updated the jQuery links inside the templates

-----------------------------------------------------------------------

## [1.7.4] - 2019-05-29

### Added

- Added a new `titleSize` cli option to change the size of the main heading which becomes truncated when using the `title` flag

-----------------------------------------------------------------------

## [1.7.3] - 2019-05-24

### Added

- Added buttons to expand / collapse all the folders in the `Total Requests` tab
- Added a visual indicator on the folder bar to show if any of the requests have failed tests in them

-----------------------------------------------------------------------

## [1.7.2] - 2019-05-11

### Added

- Added a helper to change the browser title element from the CLI

-----------------------------------------------------------------------

## [1.7.1] - 2019-05-08

### Updated

- The `Failed Tests` tab now also includes the folder path of the failed test.

-----------------------------------------------------------------------

## [1.7.0] - 2019-05-08

### Added

- A optional flag has been added to display the `console.log()` statements in the report

-----------------------------------------------------------------------

## [1.6.11] - 2019-04-29

### Updated

- Updated the `README` with links to an interactive set of reports

-----------------------------------------------------------------------

## [1.6.10] - 2019-03-31

### Updated

- Updated the dependencies

-----------------------------------------------------------------------

## [1.6.9] - 2019-03-21

### Changed

- Changed the styling on all the templates if the request doesn't have tests

-----------------------------------------------------------------------

## [1.6.8] - 2019-03-18

### Added

- Added the `Request Headers` table to all the templates

-----------------------------------------------------------------------

## [1.6.7] - 2019-03-15

### Added

- Added the `retrieve` property to the DataTables object

-----------------------------------------------------------------------

## [1.6.6] - 2019-03-10

### Changed

- Changed the flag name from `paging` to `testPaging`

-----------------------------------------------------------------------

## [1.6.5] - 2019-03-10

### Added

- Added a `paging` flag to allow the pagination of the tests in the request view

-----------------------------------------------------------------------

## [1.6.4] - 2019-03-09

### Added

- Added a search and filter feature to the test result tables

-----------------------------------------------------------------------

## [1.6.3] - 2019-03-05

### Fixed

- Fixed Issue with the template

-----------------------------------------------------------------------

## [1.6.2] - 2019-03-05

### Added

- Added a `dark` theme when showing only the test fails

-----------------------------------------------------------------------

## [1.6.1] - 2019-03-04

### Added

- Extra information about the test failures in the request view

-----------------------------------------------------------------------

## [1.6.0] - 2019-03-04

### Added

- A `--reporter-htmlextra-showOnlyFails` option to tell the reporter to display only the requests with failed tests

-----------------------------------------------------------------------

## [1.5.7] - 2019-03-02

### Fixed

- Prevented the `Response Header` name wrapping the text on the table view.

-----------------------------------------------------------------------

## [1.5.6] - 2019-03-01

### Changed

- If no export file name and location are included, the report name will include the collection name
- Changed the style on the `Response Headers` to a table view.

-----------------------------------------------------------------------

## [1.5.5] - 2019-02-18

### Added

- Displayed the number of the requests within each of the folders

-----------------------------------------------------------------------

## [1.5.4] - 2019-02-18

### Added

- A new CLI option that allows the user to give the report a new main title  

-----------------------------------------------------------------------

## [1.5.3] - 2019-02-17

### Changed

- The `Skipped` panel on the dashboard will be `Amber` if any tests are skipped  

-----------------------------------------------------------------------

## [1.5.2] - 2019-02-17

### Changed

- The Iteration panel on the dashboard will be `red` if any tests failed during the run 

-----------------------------------------------------------------------

## [1.5.1] - 2019-02-17

### Changed

- The folder sections in the request tab are now collapsible 

-----------------------------------------------------------------------

## [1.5.0] - 2019-02-15

### Added

- A new `--reporter-htmlextra-darkTheme` cli flag to tell the reporter to use the dark theme dashboard
- A new `darkTheme` property option if used with a script

-----------------------------------------------------------------------

## [1.4.5] - 2019-02-15

### Added

- A new dark theme dashboard template 

-----------------------------------------------------------------------

## [1.4.4] - 2019-02-14

### Added

- A new package will be deployed from Travis if all the tests pass 

-----------------------------------------------------------------------

## [1.4.3] - 2019-02-14

### Changed

- Updated the default template to allow each failure card to be collapsible

-----------------------------------------------------------------------

## [1.4.2] - 2019-02-13

### Changed

- Exposed the `Response Headers` on the report for each request 

-----------------------------------------------------------------------

## [1.4.1] - 2019-02-12

### Changed

- Updated the default template to allow each request card to be collapsible
- Included some tooltips for the Summary page tabs to make it clearer that these are clickable buttons  

-----------------------------------------------------------------------

## [1.4.0] - 2019-01-25

### Added

- I've attempted to expose the `console.log` statements from the `Tests` and `Pre-Requests`.
- Created some tests to cover the addition of the console logs.

### Changed

- Updated the default template to include a `Console Logs` tab

-----------------------------------------------------------------------

## [1.3.1] - 2019-01-16

### Fixed

- The `Assertions Passed` label of the Summary view was quite confusing

-----------------------------------------------------------------------

## [1.3.0] - 2019-01-15

### Changed

- Added the `iteration` property to the aggregation `parent` object in the `index.js` file to separate the requests easier

### Added

- Updated the dashboard template to separate each iteration into tabs

-----------------------------------------------------------------------

## [1.2.7] - 2019-01-12

### Fixed

- Updated the out of date modules

-----------------------------------------------------------------------

## [1.2.6] - 2019-01-11

### Fixed

- Copy and Paste feature was not working as expected, if fixed that. :)

-----------------------------------------------------------------------

## [1.2.5] - 2019-01-09

### Changed

- Styling changes to the dashboard template.
- Made the dashboard template the default one for the reporter
- Alternative template added to the `./templates` dir.

-----------------------------------------------------------------------

## [1.2.4] - 2019-01-08

### Fixed

- The dashboard template request headers were not turning red if a test failed.

-----------------------------------------------------------------------

## [1.2.3] - 2019-01-08

### Changed

- The templates now display the request body, if the request has one.

-----------------------------------------------------------------------

## [1.2.2] - 2019-01-04

### Added

- Added images of the new dashboard style report to the `README.md` file

-----------------------------------------------------------------------

## [1.2.1] - 2019-01-03

### Added

- Added a new dashboard style report template

-----------------------------------------------------------------------

## [1.2.0] - 2019-01-03

### Added

- Added the ability to display the folder level descriptions on the report

### Changed

- Updated the default template to show the folder level descriptions
- Markdown is now rendered on the HTML page

-----------------------------------------------------------------------

## [1.1.3] - 2018-12-21

### Added

- Travis CI badge to the `README` file

### Changed

- Node v6 build removed from Travis file - No `npm ci` support for that version

-----------------------------------------------------------------------

## [1.1.2] - 2018-12-21

### Added

- Created a `.travis.yml` file and committed the `package-lock.json` file to the repo

-----------------------------------------------------------------------

## [1.1.1] - 2018-12-17

### Added

- Added integration tests for the CLI runner

-----------------------------------------------------------------------

## [1.1.0] - 2018-12-17

### Added

- All the Skipped Tests during the collection run are now part of the individual requests (This has a dependency on Newman Version 4.2.3 or higher)
- Added some integration and repository level tests

### Changed

- Updated the default template to show the skipped tests in the single request summary

-----------------------------------------------------------------------

## [1.0.5] - 2018-12-14

### Fixed

- Updated the default template to fix a pass percentage calculation error

-----------------------------------------------------------------------

## [1.0.4] - 2018-12-13

### Added

- Exposed the skipped tests - Currently, this are still showing as `passed` in the main aggregations though :(

### Changed

- Updated the default template

-----------------------------------------------------------------------

## [1.0.3] - 2018-12-09

### Added

- Included the `moment-helpers` module to give more flexibly about what date format you can choose

### Changed

- Updated the default template

-----------------------------------------------------------------------

## [1.0.2] - 2018-12-07

### Fixed

- Missed a single comma in the `./lib/index.js` file which caused the package to fail :(

-----------------------------------------------------------------------

## [1.0.1] - 2018-12-07

### Added

- Updated the `package.json` file to include more details

-----------------------------------------------------------------------

## [1.0.0] - 2018-12-07

### Added

- Initial Release

-----------------------------------------------------------------------

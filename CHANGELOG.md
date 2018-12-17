# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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

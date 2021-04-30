#!/usr/bin/env node
/* eslint-disable max-len */
let { Command } = require('commander'),
    program = new Command(),
    version = require('../package.json').version;

program
    .option('--reporter-htmlextra-export', 'Specify a export location for the report')
    .option('--reporter-htmlextra-template', 'Specify a custom template path for the reporter to use')
    .option('--reporter-htmlextra-logs', 'Displays the console log statements on the final report.')
    .option('--reporter-htmlextra-showOnlyFails', 'Display only the requests with failed tests.')
    .option('--reporter-htmlextra-noSyntaxHighlighting', 'Disable the code syntax highlighting')
    .option('--reporter-htmlextra-testPaging', 'Adds pagination to the tests in the request view')
    .option('--reporter-htmlextra-browserTitle', 'Specify the name of the title in the browser tab')
    .option('--reporter-htmlextra-title', 'Specify the name of the main report title on the Summary tab')
    .option('--reporter-htmlextra-titleSize', 'Specify the size of the main report title')
    .option('--reporter-htmlextra-omitHeaders', 'Excludes all `Headers` from the final report')
    .option('--reporter-htmlextra-skipHeaders', 'Exclude certain `Headers` from the final report')
    .option('--reporter-htmlextra-omitRequestBodies', 'Exclude all `Request Bodies` from the final report')
    .option('--reporter-htmlextra-omitResponseBodies', 'Exclude all `Response Bodies` from the final report')
    .option('--reporter-htmlextra-hideRequestBody', 'Exclude certain `Request Bodies` from the final report')
    .option('--reporter-htmlextra-hideResponseBody', 'Exclude certain `Response Bodies` from the final report')
    .option('--reporter-htmlextra-showEnvironmentData', 'Displays all the `Environment` variables used during the run')
    .option('--reporter-htmlextra-skipEnvironmentVars', 'Exclude certain `Environment` variables from the final report')
    .option('--reporter-htmlextra-showGlobalData', 'Displays all the `Global` variables used during the run')
    .option('--reporter-htmlextra-skipGlobalVars', 'Exclude certain `Global` variables from the final report')
    .option('--reporter-htmlextra-skipSensitiveData', 'Excludes all `Request/Response Headers` and `Request/Response bodies`')
    .option('--reporter-htmlextra-showMarkdownLinks', 'Renders Markdown links from the test names and `pm.expect()` statements')
    .option('--reporter-htmlextra-showFolderDescription', 'Displays all the folder descriptions in the final report')
    .option('--reporter-htmlextra-timezone', 'Specify the timezone for the final report');

program
    .addHelpCommand(false)
    .usage('newman run [collection file | link] -r htmlextra [option]')
    .version(version, '-v, --version', 'HTMLEXTRA version');

if (process.argv.length < 3) {
    program.help();
}
(Number(process.version[1]) >= 6) && [process.stdout, process.stderr].forEach((s) => {
    s && s.isTTY && s._handle && s._handle.setBlocking && s._handle.setBlocking(true);
});
program.parse(process.argv);

/* eslint-disable arrow-body-style */
/* eslint-disable padding-line-between-statements */
/* eslint-disable semi */
/* eslint-disable arrow-parens */
/* eslint-disable block-scoped-var */
/* eslint-disable no-redeclare */
/* eslint-disable one-var */
/* eslint-disable no-unused-vars */
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    moment = require('moment-timezone'),
    handlebars = require('handlebars'),
    helpers = require('handlebars-helpers')({
        handlebars: handlebars
    }),

    util = require('./util'),

    /**
 * An object of the default file read preferences.
 *
 * @type {Object}
 */
    FILE_READ_OPTIONS = { encoding: 'utf8' },

    /**
 * The default Handlebars template to use when no user specified template is provided.
 *
 * @type {String}
 */
    DEFAULT_TEMPLATE = 'dashboard-template.hbs',

    /**
    /**
 * The show only fails Handlebars template is used when the arg is passed in the cli.
 *
 * @type {String}
 */
    SHOW_ONLY_FAILS = 'only-failures-dashboard.hbs',

    /**
    /**
 * The list of execution data fields that are aggregated over multiple requests for the collection run
 *
 * @type {String[]}
 */
    AGGREGATED_FIELDS = ['cursor', 'item', 'request', 'response', 'requestError'],

    PostmanHTMLExtraReporter;

/**
 * A function that creates raw markup to be written to Newman HTML reports.
 *
 * @param {Object} newman - The collection run object, with a event handler setter, used to enable event wise reporting.
 * @param {Object} options - The set of HTML reporter run options.
 * @param {String=} options.template - Optional path to the custom user defined HTML report template (Handlebars).
 * @param {String=} options.export - Optional custom path to create the HTML report at.
 * @param {String=} options.title - Optional flag to set a custom title on the report.
 * @param {String=} options.paging - Optional flag to add paging to the tests on the request view.
 * @param {String=} options.showOnlyFails - Optional flag to create a report showing only failed tests.
 * @param {String=} options.logs - Optional flag to show the console logs in the report.
 * @param {Object} collectionRunOptions - The set of all the collection run options.
 * @returns {*}
 */
PostmanHTMLExtraReporter = function (newman, options, collectionRunOptions) {
    // Helper for calculating pass percentage
    handlebars.registerHelper('percent', function (passed, failed) {
        return (passed * 100 / (passed + failed)).toFixed(0);
    });
    // Helper for converting object to json
    handlebars.registerHelper('formdata', function (context) {
        let formdata = {};

        context.forEach(function (value, key) {
            if (value.src) {
                formdata[value.key] = value.src;
            }
            else {
                formdata[value.key] = value.value;
            }
        });

        return JSON.stringify(formdata);
    });
    // increment helper for zero index
    handlebars.registerHelper('inc', function (value) {
        return parseInt(value) + 1;
    });
    // Sums the total tests by 'assertions - skipped tests'
    handlebars.registerHelper('totalTests', function (assertions, skippedTests) {
        return skippedTests ? parseInt(assertions) - parseInt(skippedTests) : parseInt(assertions);
    });
    // Adds the moment helper module
    handlebars.registerHelper('paging', function () {
        var paging = options.testPaging || false;

        return paging;
    });
    handlebars.registerHelper('logs', function () {
        var logs = options.logs || false;

        return logs;
    });
    handlebars.registerHelper('isTheSame', function (lvalue, rvalue, options) {
        if (arguments.length < 3) {
            throw new Error('Handlebars Helper equal needs 2 parameters');
        }
        // eslint-disable-next-line no-negated-condition
        // eslint-disable-next-line eqeqeq
        // eslint-disable-next-line no-negated-condition
        if (lvalue !== rvalue) {
            return options.inverse(this);
        }
        // eslint-disable-next-line no-else-return
        else {
            return options.fn(this);
        }
    });
    handlebars.registerHelper('isNotIn', function (elem, list, options) {
        if (typeof (list) === 'object') {
            list = list.map(v => v.toLowerCase())
        }
        else if (list.length !== undefined) {
            list = list.toLowerCase()
        }

        if (elem !== undefined) {
            var convertedElem = elem.toLowerCase()
        }

        if (_.includes(list, convertedElem)) {
            return options.inverse(this);
        }

        return options.fn(this);
    });
    handlebars.registerHelper('totalFolders', function (aggregations) {
        return aggregations.length;
    });
    handlebars.registerHelper('totalFailedFolders', function (aggregations) {
        let failedFolders = 0;

        aggregations.forEach(aggregation => {
            aggregation.executions.forEach(execution => {
                if (execution.cumulativeTests.failed > 0) {
                    failedFolders++;
                }
            });
        });

        return failedFolders;
    });

    // @todo throw error here or simply don't catch them and it will show up as warning on newman
    if (options.showOnlyFails && !options.template) {
        var htmlTemplate = path.join(__dirname, SHOW_ONLY_FAILS);
    }
    else {
        // eslint-disable-next-line one-var
        // eslint-disable-next-line block-scoped-var
        var htmlTemplate = options.template || path.join(__dirname, DEFAULT_TEMPLATE);
    }
    var compiler = handlebars.compile(fs.readFileSync(htmlTemplate, FILE_READ_OPTIONS));
    // Handle the skipped tests

    newman.on('assertion', function (err, o) {
        if (err) { return; }

        if (o.skipped) {
            this.summary.skippedTests = this.summary.skippedTests || [];

            this.summary.skippedTests.push({
                cursor: {
                    ref: o.cursor.ref,
                    iteration: o.cursor.iteration,
                    scriptId: o.cursor.scriptId
                },
                assertion: o.assertion,
                skipped: o.skipped,
                error: o.error,
                item: {
                    id: o.item.id,
                    name: o.item.name
                }
            });
        }
    });

    newman.on('console', function (err, o) {
        if (err) { return; }

        if (options.logs) {
            this.summary.consoleLogs = this.summary.consoleLogs || {};
            this.summary.consoleLogs[o.cursor.ref] = this.summary.consoleLogs[o.cursor.ref] || [];
            this.summary.consoleLogs[o.cursor.ref].push(o);
        }
    });

    newman.on('beforeDone', function () {
        var items = {},
            executionMeans = {},
            netTestCounts = {},
            aggregations = [],
            traversedRequests = {},
            aggregatedExecutions = {},
            consoleLogs = this.summary.consoleLogs || {},
            executions = _.get(this, 'summary.run.executions'),
            assertions = _.transform(executions, function (result, currentExecution) {
                var stream,
                    reducedExecution,
                    executionId = currentExecution.cursor.ref;

                if (!_.has(traversedRequests, executionId)) {
                    // mark the current request instance as traversed
                    _.set(traversedRequests, executionId, 1);

                    // set the base assertion and cumulative test details for the current request instance
                    _.set(result, executionId, {});
                    _.set(netTestCounts, executionId, { passed: 0, failed: 0, skipped: 0 });

                    // set base values for overall response size and time values
                    _.set(executionMeans, executionId, { time: { sum: 0, count: 0 }, size: { sum: 0, count: 0 } });

                    reducedExecution = _.pick(currentExecution, AGGREGATED_FIELDS);

                    if (reducedExecution.response && _.isFunction(reducedExecution.response.toJSON)) {
                        reducedExecution.response = reducedExecution.response.toJSON();
                        stream = reducedExecution.response.stream;
                        reducedExecution.response.body = Buffer.from(stream).toString();
                    }

                    // set sample request and response details for the current request
                    items[reducedExecution.cursor.ref] = reducedExecution;
                }

                executionMeans[executionId].time.sum += _.get(currentExecution, 'response.responseTime', 0);
                executionMeans[executionId].size.sum += _.get(currentExecution, 'response.responseSize', 0);

                ++executionMeans[executionId].time.count;
                ++executionMeans[executionId].size.count;

                _.forEach(currentExecution.assertions, function (assertion) {
                    var aggregationResult,
                        assertionName = assertion.assertion,
                        testName = _.get(assertion, 'error.test') || undefined,
                        errorMessage = _.get(assertion, 'error.message') || undefined,
                        isError = _.get(assertion, 'error') !== undefined,
                        isSkipped = _.get(assertion, 'skipped');

                    result[executionId][assertionName] = result[executionId][assertionName] || {
                        name: assertionName,
                        testFailure: { test: testName, message: errorMessage },
                        passed: 0,
                        failed: 0,
                        skipped: 0
                    };
                    aggregationResult = result[executionId][assertionName];

                    if (isError && isSkipped !== true) {
                        aggregationResult.failed++;
                        netTestCounts[executionId].failed++;
                    }
                    else if (isSkipped) {
                        aggregationResult.skipped++;
                        netTestCounts[executionId].skipped++;
                    }
                    else if (isError === false && isSkipped === false) {
                        aggregationResult.passed++;
                        netTestCounts[executionId].passed++;
                    }
                });
            }, {}),

            aggregator = function (execution) {
                // fetch aggregated run times and response sizes for items, (0 for failed requests)
                var aggregationMean = executionMeans[execution.cursor.ref],
                    meanTime = _.get(aggregationMean, 'time', 0),
                    meanSize = _.get(aggregationMean, 'size', 0),
                    parent = execution.item.parent(),
                    iteration = execution.cursor.iteration,
                    previous = _.last(aggregations),
                    current = _.merge(items[execution.cursor.ref], {
                        assertions: _.values(assertions[execution.cursor.ref]),
                        mean: {
                            time: util.prettyms(meanTime.sum / meanTime.count),
                            size: util.filesize(meanSize.sum / meanSize.count)
                        },
                        cumulativeTests: netTestCounts[execution.cursor.ref],
                        consoleLogs: consoleLogs[execution.cursor.ref]
                    });

                if (aggregatedExecutions[execution.cursor.ref]) { return; }

                aggregatedExecutions[execution.cursor.ref] = true;

                if (previous && parent.id === previous.parent.id && previous.parent.iteration === iteration) {
                    previous.executions.push(current);
                }
                else {
                    aggregations.push({
                        parent: {
                            id: parent.id,
                            name: util.getFullName(parent),
                            description: parent.description,
                            iteration: iteration
                        },
                        executions: [current]
                    });
                }
            };

        _.forEach(this.summary.run.executions, aggregator);

        //  File name validation regex from owasp https://owasp.org/www-community/OWASP_Validation_Regex_Repository
        var pattern = new RegExp('^(([a-zA-Z]:|\\\\)\\\\)?(((\\.)|' +
        '(\\.\\.)|([^\\\\/:*?"|<>. ](([^\\\\/:*?"|<>. ])|' +
        '([^\\\\/:*?"|<>]*[^\\\\/:*?"|<>. ]))?))' +
        '\\\\)*[^\\\\/:*?"|<>. ](([^\\\\/:*?"|<>. ])' +
        '|([^\\\\/:*?"|<>]*[^\\\\/:*?"|<>. ]))?$');

        let timezone = options.timezone || moment.tz.guess(true);

        this.exports.push({
            name: 'html-reporter-htmlextra',
            default: (this.summary.collection.name).match(pattern) ?
                `${this.summary.collection.name}.html` : 'newman_htmlextra.html',
            path: options.export,
            content: compiler({
                skipHeaders: options.skipHeaders || [],
                skipEnvironmentVars: options.skipEnvironmentVars || [],
                skipGlobalVars: options.skipGlobalVars || [],
                hideRequestBody: options.hideRequestBody || [],
                hideResponseBody: options.hideResponseBody || [],
                showEnvironmentData: options.showEnvironmentData || false,
                showGlobalData: options.showGlobalData || false,
                skipSensitiveData: options.skipSensitiveData || false,
                omitHeaders: options.omitHeaders || false,
                showMarkdownLinks: options.showMarkdownLinks || false,
                noSyntaxHighlighting: options.noSyntaxHighlighting || false,
                showFolderDescription: options.showFolderDescription || false,
                browserTitle: options.browserTitle || 'Newman Summary Report',
                title: options.title || 'Newman Run Dashboard',
                titleSize: options.titleSize || 2,
                timestamp: moment().tz(timezone).format('dddd, DD MMMM YYYY HH:mm:ss'),
                version: collectionRunOptions.newmanVersion,
                folders: collectionRunOptions.folder,
                aggregations: aggregations,
                summary: {
                    stats: this.summary.run.stats,
                    collection: this.summary.collection,
                    globals: _.isObject(this.summary.globals) ? this.summary.globals : undefined,
                    environment: _.isObject(this.summary.environment) ? this.summary.environment : undefined,
                    failures: this.summary.run.failures,
                    responseTotal: util.filesize(this.summary.run.transfers.responseTotal),
                    responseAverage: util.prettyms(this.summary.run.timings.responseAverage),
                    duration: util.prettyms(this.summary.run.timings.completed - this.summary.run.timings.started),
                    skippedTests: _.isObject(this.summary.skippedTests) ? this.summary.skippedTests : undefined
                }
            })
        });
    });
};

module.exports = PostmanHTMLExtraReporter;

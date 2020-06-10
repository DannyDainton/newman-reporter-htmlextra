/* eslint-disable no-console */
var fs = require('fs'),
    _ = require('lodash'),
    //  File name validation regex from owasp https://owasp.org/www-community/OWASP_Validation_Regex_Repository
    pattern = new RegExp('^(([a-zA-Z]:|\\\\)\\\\)?(((\\.)|' +
        '(\\.\\.)|([^\\\\/:*?"|<>. ](([^\\\\/:*?"|<>. ])|' +
        '([^\\\\/:*?"|<>]*[^\\\\/:*?"|<>. ]))?))' +
        '\\\\)*[^\\\\/:*?"|<>. ](([^\\\\/:*?"|<>. ])' +
        '|([^\\\\/:*?"|<>]*[^\\\\/:*?"|<>. ]))?$');

describe('Newman and htmlextra run from a script', function () {
    var outFile = 'out/newman-report.htmlextra.html',
        invalidCollectionNameFolder = 'test/requests/collection_with_name_containing_invalid_characters',
        files = fs.readdirSync(invalidCollectionNameFolder);

    beforeEach(function (done) {
        // eslint-disable-next-line consistent-return
        fs.stat('out', function (err) {
            if (err) {
                return fs.mkdir('out', done);
            }
            done();
        });
    });

    afterEach(function (done) {
        let files = fs.readdirSync('newman');

        files.forEach(function (file) {
            fs.unlinkSync('newman/' + file);
        });
        // eslint-disable-next-line consistent-return
        fs.stat(outFile, function (err) {
            if (err) {
                return done();
            }
            fs.unlink(outFile, done);
        });
    });

    // Get all collection files from the invalidCollectionNameFolder
    files = files.filter(function (file) {
        return (/^((?!(package(-lock)?))|.+)\.json/).test(file);
    });

    // For each collection send newman.run and validate output
    files.forEach(function (file) {
        let collectionFile = JSON.parse(fs.readFileSync(invalidCollectionNameFolder + '/' + file, 'utf8')),
            regCreator = function (name) {
                return (new RegExp('(' + _.escapeRegExp(name) +
                            ')-\\d{4}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{3}-\\d.html$'));
            },
            checkFileExistance = function (input, outputFile) {
                let status, output,
                    timeStamp = outputFile[0].match(/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3}-\d.html$/g);

                input = (input).includes('\\') ? (input).split('\\').slice(-1)[0] : input;
                if (outputFile.length !== 0) {
                    output = (outputFile[0]).match(regCreator(input));
                    status = output === null ? `Expected ${input}${timeStamp[0]}` :
                        output[0];
                }
                else if (outputFile.length === 0) {
                    status = 'No output files were created';
                }

                return status;
            };

        it('should correctly generate the html report for collection' +
        'name (' + collectionFile.info.name + ')', function (done) {
            newman.run({
                collection: invalidCollectionNameFolder + '/' + file,
                reporters: ['htmlextra'],
                reporter: { htmlextra: { } }
            // eslint-disable-next-line consistent-return
            }, function (err, summary) {
                if (err) { return done(err); }
                let outputFile = fs.readdirSync('newman'),
                    name = collectionFile.info.name,
                    status = (name).match(pattern) === null ?
                        checkFileExistance('newman_htmlextra', outputFile) :
                        checkFileExistance(name, outputFile);

                expect(outputFile[0]).to.include(status);
                expect(summary.collection.name).to.equal(name);
                expect(summary.run.stats.iterations.total).to.equal(1);
                done();
            });
        });
    });

    it('should correctly generate the html report for a successful run', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-get-request');
            expect(summary.run.stats.iterations.total).to.equal(1);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate html report for a formdata POST request', function (done) {
        newman.run({
            collection: 'test/requests/simple-post-request-with-formdata.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-post-request-with-formdata');
            expect(summary.run.stats.iterations.total).to.equal(1);
            expect(summary.run.executions[0].item.request.body.formdata.members[0].key).to.equal('myKey');
            expect(summary.run.executions[0].item.request.body.formdata.members[0].value).to.equal('myValue');
            expect(summary.run.executions[0].item.request.body.formdata.members[0].src).to.be.undefined;
            expect(summary.run.executions[0].item.request.body.formdata.members[1].key).to.equal('anotherKey');
            expect(summary.run.executions[0].item.request.body.formdata.members[1].value).to.equal('anotherValue');
            expect(summary.run.executions[0].item.request.body.formdata.members[1].src).to.be.undefined;
            expect(summary.run.executions[0].item.request.body.formdata.members[2].key).to.equal('demoFile');
            expect(summary.run.executions[0].item.request.body.formdata.members[2].src).to.equal('demoFile.jpg');
            expect(summary.run.executions[0].item.request.body.formdata.members).to.have.lengthOf(3);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate html report for a urlencoded POST request', function (done) {
        newman.run({
            collection: 'test/requests/simple-post-request-with-urlencoded.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-post-request-with-urlencoded');
            expect(summary.run.stats.iterations.total).to.equal(1);
            expect(summary.run.executions[0].item.request.body.urlencoded.members[0].key).to.equal('myKey');
            expect(summary.run.executions[0].item.request.body.urlencoded.members[0].value).to.equal('myValue');
            expect(summary.run.executions[0].item.request.body.urlencoded.members).to.have.lengthOf(1);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report with a new title for a successful run', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile, title: 'My new report title' } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-get-request');
            expect(summary.run.stats.iterations.total).to.equal(1);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report with test pagination for a successful run', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile, testPaging: true } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-get-request');
            expect(summary.run.stats.iterations.total).to.equal(1);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report for a successful run with more than 1 iteration', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request.json',
            iterationCount: 2,
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-get-request');
            expect(summary.run.stats.iterations.total).to.equal(2);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report for a runs using an environment file', function (done) {
        newman.run({
            collection: 'test/requests/simple-request-with-env.json',
            environment: 'test/requests/simple-env.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            expect(summary.collection.name).to.equal('simple-request-with-env');
            expect(summary.environment.name).to.equal('simple-env');
            expect(summary.run.stats.assertions.total, 'should have 1 assertion').to.equal(1);
            expect(summary.run.stats.assertions.failed, 'should have 0 failed assertions').to.equal(0);
            fs.stat(outFile, done);
        });
    });

    it('should correctly produce the html report for a collection with an environment values shown', function (done) {
        newman.run({
            collection: 'test/requests/simple-request-with-env.json',
            environment: 'test/requests/simple-env.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile, showEnvironmentData: true } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            expect(summary.collection.name).to.equal('simple-request-with-env');
            expect(summary.environment.name).to.equal('simple-env');
            expect(summary.run.stats.assertions.total, 'should have 1 assertion').to.equal(1);
            expect(summary.run.stats.assertions.failed, 'should have 0 failed assertions').to.equal(0);
            fs.stat(outFile, done);
        });
    });

    // eslint-disable-next-line max-len
    it('should correctly produce the html report for a collection with an environment values and hide the specified variable', function (done) {
        newman.run({
            collection: 'test/requests/simple-request-with-env.json',
            environment: 'test/requests/simple-env.json',
            reporters: ['htmlextra'],
            // eslint-disable-next-line max-len
            reporter: { htmlextra: { export: outFile, showEnvironmentData: true, skipEnvironmentVars: ['secretVariable'] } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            expect(summary.collection.name).to.equal('simple-request-with-env');
            expect(summary.environment.name).to.equal('simple-env');
            expect(summary.run.stats.assertions.total, 'should have 1 assertion').to.equal(1);
            expect(summary.run.stats.assertions.failed, 'should have 0 failed assertions').to.equal(0);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report for a failed run', function (done) {
        newman.run({
            collection: 'test/requests/simple-failing-request.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            expect(summary.run.stats.assertions.failed, 'should have 2 failed assertions').to.equal(2);
            expect(summary.run.failures, 'should have 2 failures').to.have.lengthOf(2);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report with only the requests that have test failures', function (done) {
        newman.run({
            collection: 'test/requests/simple-failing-request.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile, showOnlyFails: true } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            expect(summary.run.stats.assertions.failed, 'should have 2 failed assertions').to.equal(2);
            expect(summary.run.failures, 'should have 2 failures').to.have.lengthOf(2);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the dark html report with only the requests that have test fails', function (done) {
        newman.run({
            collection: 'test/requests/simple-failing-request.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile, showOnlyFails: true } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            expect(summary.run.stats.assertions.failed, 'should have 2 failed assertions').to.equal(2);
            expect(summary.run.failures, 'should have 2 failures').to.have.lengthOf(2);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report for a run with skipped Tests', function (done) {
        newman.run({
            collection: 'test/requests/simple-skipped-request.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            expect(summary.skippedTests, 'should have 2 skipped tests').to.have.lengthOf(2);
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report for a run with console logs', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request-with-log-messages.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile, logs: true } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            let key = Object.keys(summary.consoleLogs);

            expect(err).to.be.null;
            expect(summary.consoleLogs[key], 'should have 2 console log messages').to.have.lengthOf(2);
            fs.stat(outFile, done);
        });
    });

    it('should correctly produce the html report for a run with all test types', function (done) {
        newman.run({
            collection: 'test/requests/simple-request-with-all-test-types.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            // check that the collection doesn't contain any console logs
            expect(summary.consoleLogs, 'should have no console log messages').to.be.undefined;
            // individual request data
            expect(summary.run.executions[0].assertions[0].assertion).to.equal('This is a passing test');
            expect(summary.run.executions[0].assertions[0].skipped).to.be.false;
            expect(summary.run.executions[0].assertions[0].error).to.be.undefined;
            expect(summary.run.executions[0].assertions[1].assertion).to.equal('This is a failing test');
            expect(summary.run.executions[0].assertions[1].skipped).to.be.false;
            // eslint-disable-next-line max-len
            expect(summary.run.executions[0].assertions[1].error.message).to.equal('expected response to have status code 201 but got 200');
            expect(summary.run.executions[0].assertions[2].assertion).to.equal('This is a skipped test');
            expect(summary.run.executions[0].assertions[2].skipped).to.be.true;
            expect(summary.run.executions[0].assertions[2].error).to.be.undefined;
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report for a successful run and remove a single header', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request-with-headers.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { skipHeaders: 'testHeader', export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-get-request-with-headers');
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report for a successful run and remove multiple headers', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request-with-headers.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { skipHeaders: ['testHeader', 'host', 'User-Agent'], export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-get-request-with-headers');
            fs.stat(outFile, done);
        });
    });

    it('should correctly generate the html report for a successful run and remove all headers', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request-with-headers.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { omitHeaders: true, export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-get-request-with-headers');
            fs.stat(outFile, done);
        });
    });
});

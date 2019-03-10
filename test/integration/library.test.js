var fs = require('fs');

describe('Newman and htmlextra run from a script', function () {
    var outFile = 'out/newman-report.htmlextra';

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
        // eslint-disable-next-line consistent-return
        fs.stat(outFile, function (err) {
            if (err) {
                return done();
            }

            fs.unlink(outFile, done);
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

    it('should correctly generate the dark theme html report for a successful run', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile, darkTheme: true } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(summary.collection.name).to.equal('simple-get-request');
            expect(summary.run.stats.iterations.total).to.equal(1);
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
            reporter: { htmlextra: { export: outFile, showOnlyFails: true, darkTheme: true } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            expect(summary.run.stats.assertions.failed, 'should have 2 failed assertions').to.equal(2);
            expect(summary.run.failures, 'should have 2 failures').to.have.lengthOf(2);
            fs.stat(outFile, done);
        });
    });

    it('should correctly produce the html report for a run with skipped Tests', function (done) {
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

    it('should correctly produce the html report for a run with console logs', function (done) {
        newman.run({
            collection: 'test/requests/simple-get-request-with-log-messages.json',
            reporters: ['htmlextra'],
            reporter: { htmlextra: { export: outFile } }
        // eslint-disable-next-line consistent-return
        }, function (err, summary) {
            if (err) { return done(err); }
            expect(err).to.be.null;
            expect(summary.consoleLogs, 'should have 2 console log messages').to.have.lengthOf(2);
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
});

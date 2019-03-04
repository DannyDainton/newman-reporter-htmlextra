/* eslint-disable consistent-return */
const fs = require('fs');

describe('Newman and htmlextra run from the CLI', function () {
    const outFile = 'out/newman-report.html',
        newman = 'node ./.temp/node_modules/newman/bin/newman.js';

    beforeEach(function (done) {
        fs.stat('out', function (err) {
            if (err) {
                return fs.mkdir('out', done);
            }

            done();
        });
    });

    afterEach(function (done) {
        fs.stat(outFile, function (err) {
            if (err) {
                return done();
            }

            fs.unlink(outFile, done);
        });
    });

    it('should correctly generate the html report for a successful run', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-darkTheme --reporter-htmlextra-title "My new report title"`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });

    it('should correctly generate the dark theme html report for a successful run', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-darkTheme`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });

    it('should correctly generate the html report with a new title for a successful run', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-title "My new report title"`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });


    it('should correctly generate the html report for a failed run', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-failing-request.json -r htmlextra --reporter-htmlextra-export ${outFile}`,
            function (code) {
                expect(code, 'should have exit code of 1').to.equal(1);
                fs.stat(outFile, done);
            });
    });

    it('should correctly generate the html report showing only the requests with failed tests', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-failing-request.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-showOnlyFails`,
            function (code) {
                expect(code, 'should have exit code of 1').to.equal(1);
                fs.stat(outFile, done);
            });
    });

    it('should correctly produce the html report for a collection with an environment file', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-request-with-env.json -e test/requests/simple-env.json -r htmlextra --reporter-htmlextra-export ${outFile}`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });

    it('should correctly generate the html report for a collection run for more that 1 iteration', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request.json -r htmlextra --reporter-htmlextra-export ${outFile} -n 3`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });
});

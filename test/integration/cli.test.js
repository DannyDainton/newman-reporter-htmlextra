/* eslint-disable max-len */
/* eslint-disable consistent-return */
const fs = require('fs'),
    _ = require('lodash'),

    //  File name validation regex from owasp https://owasp.org/www-community/OWASP_Validation_Regex_Repository
    pattern = new RegExp('^(([a-zA-Z]:|\\\\)\\\\)?(((\\.)|' +
     '(\\.\\.)|([^\\\\/:*?"|<>. ](([^\\\\/:*?"|<>. ])|' +
     '([^\\\\/:*?"|<>]*[^\\\\/:*?"|<>. ]))?))' +
     '\\\\)*[^\\\\/:*?"|<>. ](([^\\\\/:*?"|<>. ])' +
     '|([^\\\\/:*?"|<>]*[^\\\\/:*?"|<>. ]))?$');

describe('Newman and htmlextra run from the CLI', function () {
    const outFile = 'out/newman-report.html',
        newman = 'node ./.temp/node_modules/newman/bin/newman.js',
        invalidCollectionNameFolder = 'test/requests/collection_with_name_containing_invalid_characters';
    let files = fs.readdirSync(invalidCollectionNameFolder);

    beforeEach(function (done) {
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
            // eslint-disable-next-line max-len
            let collection = invalidCollectionNameFolder + '/' + file;

            exec(`${newman} run ${collection} -r htmlextra`,
                function (code) {
                    expect(code, 'should have exit code of 0').to.equal(0);
                    let outputFile = fs.readdirSync('newman'),
                        name = collectionFile.info.name,
                        status = (name).match(pattern) === null ?
                            checkFileExistance('newman_htmlextra', outputFile) :
                            checkFileExistance(name, outputFile);

                    expect(outputFile[0]).to.include(status);
                    done();
                });
        });
    });

    it('should correctly generate the html report for a successful run', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-displayProgressBar`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });

    it('should correctly generate html report for a formdata POST request', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-post-request-with-formdata.json -r htmlextra --reporter-htmlextra-export ${outFile}`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });

    it('should correctly generate html report for a urlencoded POST request', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-post-request-with-urlencoded.json -r htmlextra --reporter-htmlextra-export ${outFile}`,
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

    it('should correctly generate the html report with test pagination for a successful run', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-testPaging`,
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

    it('should correctly produce the html report for a collection with an environment values shown', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-request-with-env.json -e test/requests/simple-env.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-showEnvironmentData`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });

    // eslint-disable-next-line max-len
    it('should correctly produce the html report for a collection with an environment values and hide the specified variable', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-request-with-env.json -e test/requests/simple-env.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-showEnvironmentData --reporter-htmlextra-skipEnvironmentVars secretVariable`,
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

    it('should correctly generate the html report for a successful run and remove a single header', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request-with-headers.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-skipHeaders testHeader`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });
    it('should correctly generate the html report for a successful run and remove multiple headers', function (done) {
        exec(`${newman} run test/requests/simple-get-request-with-headers.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-skipHeaders Testheader,host,ACCEPT`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });
    it('should correctly generate the html report when a header is not specified', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request-with-headers.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-skipHeaders`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });
    it('should correctly generate the html report for a successful run and remove all headers', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request-with-headers.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-omitHeaders`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });
    it('should correctly generate the html report when a request name is not specified', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-hideResponseBody`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });
    it('Should correctly generate report for skip folder', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-skipped-folder.json -r htmlextra  --reporter-htmlextra-export ${outFile} --reporter-htmlextra-showFolderDescription  --reporter-htmlextra-skipFolders "folder1,folder4" --iteration-count 10`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });
    it('Should correctly geenrate report for skip requests', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-skipped-folder.json -r htmlextra  --reporter-htmlextra-export ${outFile} --reporter-htmlextra-showFolderDescription  --reporter-htmlextra-skipRequests "request1,request2" --iteration-count 10`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });
});

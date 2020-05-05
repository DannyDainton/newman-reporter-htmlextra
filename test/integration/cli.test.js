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

        // delete newman folder content
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

    // For each collection run newman and validate output
    files.forEach(function (file) {
        // Get collection file as JSON and get collection name as obj.info.name
        let obj = JSON.parse(fs.readFileSync(invalidCollectionNameFolder + '/' + file, 'utf8'));

        it('should correctly generate the dark theme html report for collection' +
        'name (' + obj.info.name + ')', function (done) {
            let collection = invalidCollectionNameFolder + '/' + file;

            exec(`${newman} run ${collection} -r htmlextra  --reporter-htmlextra-darkTheme`,
                function (code) {
                    expect(code, 'should have exit code of 0').to.equal(0);

                    // output will be stored to newman folder , read the output files
                    let outputFile = fs.readdirSync('newman'),
                        name = obj.info.name;

                    /* If the file is for invalid character then ,
                    validate the html file name to be newman_htmlextra-{timestamp}.html*/
                    if ((obj.info.name).match(pattern) === null) {
                        name = 'newman_htmlextra';
                        if (outputFile.length !== 0) {
                            name = (outputFile[0])
                                .match(new RegExp('^(' + _.escapeRegExp(name) +
                                ')-\\d{4}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{3}-\\d.html$'));
                            name === null ? expect
                                .fail('File name was ' + outputFile[0]) : expect(outputFile[0]).to.equal(name[0]);
                        }
                        else if (outputFile.length === 0) {
                            expect.fail('No output files were created');
                        }
                    }
                    else {
                        /* If the file is for invalid character then validate the html file name to be,
                        collectionname-{timestamp}.html.
                        if collection name is in format test\\test2 then consider only test2*/

                        name = (name).includes('\\') ? (name).split('\\').slice(-1)[0] : name;
                        if (outputFile.length !== 0) {
                            name = (outputFile[0])
                                .match(new RegExp('^(' + _.escapeRegExp(name) +
                                ')-\\d{4}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{3}-\\d.html$'));
                            name === null ? expect
                                .fail('File name was ' + outputFile[0]) : expect(outputFile[0]).to.equal(name[0]);
                        }
                        else if (outputFile.length === 0) {
                            expect.fail('No output files were created');
                        }
                    }
                    done();
                });
        });
    });

    // For each collection run newman and validate output
    files.forEach(function (file) {
        // Get collection file as JSON and get collection name as obj.info.name
        let obj = JSON.parse(fs.readFileSync(invalidCollectionNameFolder + '/' + file, 'utf8'));

        it('should correctly generate the html report for collection' +
        'name (' + obj.info.name + ')', function (done) {
            let collection = invalidCollectionNameFolder + '/' + file;

            exec(`${newman} run ${collection} -r htmlextra`,
                function (code) {
                    expect(code, 'should have exit code of 0').to.equal(0);

                    // output will be stored to newman folder , read the output files
                    let outputFile = fs.readdirSync('newman'),
                        name = obj.info.name;

                    /* If the file is for invalid character then ,
                    validate the html file name to be newman_htmlextra-{timestamp}.html*/
                    if ((obj.info.name).match(pattern) === null) {
                        name = 'newman_htmlextra';
                        if (outputFile.length !== 0) {
                            name = (outputFile[0])
                                .match(new RegExp('^(' + _.escapeRegExp(name) +
                                ')-\\d{4}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{3}-\\d.html$'));
                            name === null ? expect
                                .fail('File name was ' + outputFile[0]) : expect(outputFile[0]).to.equal(name[0]);
                        }
                        else if (outputFile.length === 0) {
                            expect.fail('No output files were created');
                        }
                    }
                    else {
                        /* If the file is for invalid character then validate the html file name to be,
                        collectionname-{timestamp}.html.
                        if collection name is in format test\\test2 then consider only test2*/

                        name = (name).includes('\\') ? (name).split('\\').slice(-1)[0] : name;
                        if (outputFile.length !== 0) {
                            name = (outputFile[0])
                                .match(new RegExp('^(' + _.escapeRegExp(name) +
                                ')-\\d{4}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{3}-\\d.html$'));
                            name === null ? expect
                                .fail('File name was ' + outputFile[0]) : expect(outputFile[0]).to.equal(name[0]);
                        }
                        else if (outputFile.length === 0) {
                            expect.fail('No output files were created');
                        }
                    }
                    done();
                });
        });
    });

    it('should correctly generate the html report for a successful run', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request.json -r htmlextra --reporter-htmlextra-export ${outFile}`,
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

    it('should correctly generate the dark html report showing only the requests with failed tests', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-failing-request.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-showOnlyFails --reporter-htmlextra-darkTheme`,
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

    it('should correctly generate the html report for a successful run and remove a single header', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request-with-headers.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-skipHeaders testHeader`,
            function (code) {
                expect(code, 'should have exit code of 0').to.equal(0);
                fs.stat(outFile, done);
            });
    });
    it('should correctly generate the html report for a successful run and remove a multiple headers', function (done) {
        // eslint-disable-next-line max-len
        exec(`${newman} run test/requests/simple-get-request-with-headers.json -r htmlextra --reporter-htmlextra-export ${outFile} --reporter-htmlextra-skipHeaders Testheader,host,ACCEPT`,
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
});

/**
 * @fileOverview This test specs runs tests on the package.json file of repository. It has a set of strict tests on the
 * content of the file as well. Any change to package.json must be accompanied by valid test case in this spec-sheet.
 */
var fs = require('fs'),
    _ = require('lodash'),
    expect = require('chai').expect,
    parseIgnore = require('parse-gitignore');

describe('project repository', function () {
    describe('package.json', function () {
        var content,
            json;

        try {
            content = fs.readFileSync('./package.json').toString();
            json = JSON.parse(content);
        }
        catch (e) {
            console.error(e);
            content = '';
            json = {};
        }

        it('should have readable JSON content', function () {
            expect(content).to.be.ok;
            expect(json).to.not.eql({});
        });

        describe('package.json JSON data', function () {
            it('should have valid name, description and author', function () {
                expect(json).to.have.property('name', 'newman-reporter-htmlextra');
                // eslint-disable-next-line max-len
                expect(json).to.have.property('description', 'A newman reporter with added handlebars helpers and separated request iterations');
                expect(json).to.have.property('author', 'Danny Dainton');
                expect(json).to.have.property('license', 'Apache-2.0');
                // eslint-disable-next-line max-len
                expect(json).to.have.property('bugs', 'https://github.com/DannyDainton/newman-reporter-htmlextra/issues');

                expect(json).to.have.property('repository');
                expect(json.repository).to.eql({
                    type: 'git',
                    url: 'https://github.com/DannyDainton/newman-reporter-htmlextra.git'
                });

                expect(json).to.have.property('keywords');
                expect(json.keywords).to.eql(['newman', 'reporter', 'html', 'htmlextra']);

                expect(json).to.have.property('engines');
                expect(json.engines).to.eql({ node: '>=6' });
            });

            it('should have a valid version string in form of <major>.<minor>.<revision>', function () {
                // eslint-disable-next-line max-len
                expect(json.version).to.match(/^((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?(?:\+([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/);
            });
        });

        describe('script definitions', function () {
            it('should exist', function () {
                expect(json.scripts).to.be.an('object');
            });

            describe('dependencies', function () {
                it('should exist', function () {
                    expect(json.dependencies).to.be.an('object');
                });
            });

            describe('devDependencies', function () {
                it('should exist', function () {
                    expect(json.devDependencies).to.be.an('object');
                });

                it('should not overlap devDependencies', function () {
                    var clean = [];

                    json.devDependencies && Object.keys(json.devDependencies).forEach(function (item) {
                        !json.dependencies[item] && clean.push(item);
                    });

                    expect(Object.keys(json.devDependencies)).to.eql(clean);
                });
            });

            describe('main entry script', function () {
                it('should point to a valid file', function (done) {
                    expect(json.main).to.equal('index.js');
                    fs.stat(json.main, done);
                });
            });
        });

        describe('README.md', function () {
            it('should exist', function (done) {
                fs.stat('./README.md', done);
            });
        });

        describe('.ignore files', function () {
            var gitignorePath = '.gitignore',
                npmignorePath = '.npmignore',
                npmignore = parseIgnore(fs.readFileSync(npmignorePath, 'utf8')),
                gitignore = parseIgnore(fs.readFileSync(gitignorePath, 'utf8'));

            describe(gitignorePath, function () {
                it('should exist', function (done) {
                    fs.stat(gitignorePath, done);
                });

                it('should have valid content', function () {
                    expect(gitignore).to.not.be.empty;
                });
            });

            describe(npmignorePath, function () {
                it('should exist', function (done) {
                    fs.stat(npmignorePath, done);
                });

                it('should have valid content', function () {
                    expect(npmignore).to.not.be.empty;
                });
            });

            it('should have .gitignore coverage to be a subset of .npmignore coverage', function () {
                expect(_.intersection(gitignore, npmignore)).to.eql(gitignore);
            });
        });

        describe('.eslintrc', function () {
            it('should exist', function (done) {
                fs.stat('./.eslintrc', done);
            });

            it('should have readable content', function () {
                expect(fs.readFileSync('./.eslintrc').toString()).to.be.ok;
            });
        });

        describe('CHANGELOG.md', function () {
            it('should exist', function (done) {
                fs.stat('./CHANGELOG.md', done);
            });
        });
    });
});

#!/usr/bin/env node
/* global exit */
require('shelljs/global');
require('colors');

var async = require('async'),
    expect = require('chai').expect,
    Mocha = require('mocha'),
    recursive = require('recursive-readdir'),

    /**
     * The source directory for system test specs.
     *
     * @type {String}
     */
    SPEC_SOURCE_DIR = './test/system';

module.exports = function (exit) {
    // banner line
    console.info('\nRunning system tests...\n'.yellow.bold);

    async.series([

        /**
         * Runs system tests on SPEC_SOURCE_DIR using Mocha.
         *
         * @param {Function} next - The callback invoked to mark the completion of the test run.
         * @returns {*}
         */
        function (next) {
            console.info('\nrunning system specs using mocha...');

            var mocha = new Mocha();

            // eslint-disable-next-line consistent-return
            recursive(SPEC_SOURCE_DIR, function (err, files) {
                if (err) {
                    console.error(err);

                    return exit(1);
                }

                files.filter(function (file) {
                    return (file.substr(-8) === '.test.js');
                }).forEach(function (file) {
                    mocha.addFile(file);
                });

                // start the mocha run
                global.expect = expect; // for easy reference

                mocha.run(function (err) {
                    // clear references and overrides
                    delete global.expect;
                    next(err);
                });
                mocha = null; // cleanup
            });
        }

    ], exit);
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(exit);

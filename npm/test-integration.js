#!/usr/bin/env node
/* global exit */
require('shelljs/global');
require('colors');

var fs = require('fs'),
    path = require('path'),
    Mocha = require('mocha'),
    shell = require('shelljs'),
    expect = require('chai').expect,
    recursive = require('recursive-readdir'),

    /**
     * The directory containing integration test specs.
     *
     * @type {String}
     */
    SPEC_SOURCE_DIR = './test/integration';

module.exports = function (exit) {
    console.info('Running Integration tests...'.yellow.bold);

    var mocha = new Mocha({ timeout: 60000 }),
        tempDir = path.join(__dirname, '..', '.temp'),
        newmanPkg,
        reporterPkg;

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

        // create a temp directory to test the reporter with newman
        fs.existsSync(tempDir) && shell.rm('-rf', tempDir);
        fs.mkdirSync(tempDir);

        console.info('\n  Installing newman & newman-reporter-htmlextra into the temp directory'.gray);
        newmanPkg = shell.exec('npm pack ../node_modules/newman', { cwd: tempDir, silent: true }).stdout.trim();
        reporterPkg = shell.exec('npm pack ../', { cwd: tempDir, silent: true }).stdout.trim();
        shell.exec(`npm i --prefix . ${newmanPkg}`, { cwd: tempDir, silent: true });
        shell.exec(`npm i --prefix . ${reporterPkg}`, { cwd: tempDir, silent: true });

        // start the mocha run
        global.expect = expect;
        // eslint-disable-next-line security/detect-non-literal-require
        global.newman = require(path.join(tempDir, 'node_modules', 'newman'));

        mocha.run(function (err) {
            // remove temp directory
            shell.rm('-rf', tempDir);

            // clear references and overrides
            delete global.expect;
            delete global.newman;

            exit(err);
        });
        mocha = null;
    });
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(exit);

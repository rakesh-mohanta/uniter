/*
 * Uniter - JavaScript PHP interpreter
 * Copyright 2013 Dan Phillimore (asmblah)
 * http://asmblah.github.com/uniter/
 *
 * Released under the MIT license
 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
 */

/*global define */
define([
    '../tools',
    '../../tools',
    'js/util',
    'js/Exception'
], function (
    engineTools,
    phpTools,
    util,
    Exception
) {
    'use strict';

    describe('PHP Engine require_once(...) expression integration', function () {
        var engine;

        function check(scenario) {
            engineTools.check(function () {
                return {
                    engine: engine
                };
            }, scenario);
        }

        beforeEach(function () {
            engine = phpTools.createEngine();
        });

        util.each({
            'requiring a file where include transport resolves promise with empty string': {
                code: util.heredoc(function (/*<<<EOS
<?php
    require_once 'test_file.php';

EOS
*/) {}),
                options: {
                    include: function (path, promise) {
                        promise.resolve('');
                    }
                },
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: ''
            },
            'requiring a file where no include transport is specified': {
                code: util.heredoc(function (/*<<<EOS
<?php
    require_once 'test_file.php';

EOS
*/) {}),
                expectedException: {
                    instanceOf: Exception,
                    match: /^requireOnce\(\) :: No "include" transport is available for loading the module\.$/
                },
                expectedStderr: '',
                expectedStdout: ''
            },
            'requiring a file where include transport resolves promise with code that just contains inline HTML': {
                code: util.heredoc(function (/*<<<EOS
<?php
    require_once 'print_hello_world.php';

EOS
*/) {}),
                options: {
                    include: function (path, promise) {
                        // Note that the path is passed back for testing
                        promise.resolve('hello world from ' + path + '!');
                    }
                },
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: 'hello world from print_hello_world.php!'
            },
            'requiring a file where include transport resolves promise with code that contains PHP code to echo a string': {
                code: util.heredoc(function (/*<<<EOS
<?php
    require_once 'print_hello.php';

EOS
*/) {}),
                options: {
                    include: function (path, promise) {
                        // Note that the path is passed back for testing
                        promise.resolve('<?php echo "hello from ' + path + '!";');
                    }
                },
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: 'hello from print_hello.php!'
            },
            'requiring a file where include transport resolves promise with code that returns a string': {
                code: util.heredoc(function (/*<<<EOS
<?php
    print 'and ' . (require_once 'print_hello.php') . '!';

EOS
*/) {}),
                options: {
                    include: function (path, promise) {
                        // Note that the path is passed back for testing
                        promise.resolve('<?php return "welcome back";');
                    }
                },
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: 'and welcome back!'
            }
        }, function (scenario, description) {
            describe(description, function () {
                check(scenario);
            });
        });
    });
});

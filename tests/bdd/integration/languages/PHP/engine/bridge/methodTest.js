/*
 * Uniter - JavaScript PHP interpreter
 * Copyright 2013 Dan Phillimore (asmblah)
 * http://asmblah.github.com/uniter/
 *
 * Released under the MIT license
 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
 */

/*global define, setTimeout */
define([
    '../tools',
    '../../tools',
    'js/util'
], function (
    engineTools,
    phpTools,
    util
) {
    'use strict';

    describe('PHP Engine object method bridge integration', function () {
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

        describe('exposing as global PHP variables', function () {
            util.each({
                'plain object from JavaScript with instance method': {
                    code: util.heredoc(function (/*<<<EOS
<?php
    return $tools->getValue();
EOS
*/) {}),
                    expose: {
                        'tools': {
                            getValue: function () {
                                return 21;
                            }
                        }
                    },
                    expectedResult: 21,
                    expectedResultType: 'integer',
                    expectedStderr: '',
                    expectedStdout: ''
                },
                'plain object from JavaScript with instance method that asynchronously returns a result': {
                    code: util.heredoc(function (/*<<<EOS
<?php
    return $tools->getValue();
EOS
*/) {}),
                    expose: {
                        'tools': {
                            getValue: function () {
                                var deferment = engine.getEnvironment().createDeferment();

                                setTimeout(function () {
                                    deferment.resolve(23);
                                });

                                throw deferment;
                            }
                        }
                    },
                    expectedResult: 23,
                    expectedResultType: 'integer',
                    expectedStderr: '',
                    expectedStdout: ''
                },
                'plain object from JavaScript with expression containing instance method that asynchronously returns a result': {
                    code: util.heredoc(function (/*<<<EOS
<?php
    return 7 + $tools->getValue();
EOS
*/) {}),
                    expose: {
                        'tools': {
                            getValue: function () {
                                var deferment = engine.getEnvironment().createDeferment();

                                setTimeout(function () {
                                    deferment.resolve(23);
                                });

                                throw deferment;
                            }
                        }
                    },
                    expectedResult: 30,
                    expectedResultType: 'integer',
                    expectedStderr: '',
                    expectedStdout: ''
                },
                'plain object from JavaScript with prototype method': {
                    code: util.heredoc(function (/*<<<EOS
<?php
    return $tools->getValue();
EOS
*/) {}),
                    expose: {
                        'tools': Object.create({
                            getValue: function () {
                                return 'me';
                            }
                        })
                    },
                    expectedResult: 'me',
                    expectedResultType: 'string',
                    expectedStderr: '',
                    expectedStdout: ''
                }
            }, function (scenario, description) {
                describe(description, function () {
                    check(scenario);
                });
            });
        });
    });
});

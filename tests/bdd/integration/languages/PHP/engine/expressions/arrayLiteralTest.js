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
    'js/util'
], function (
    engineTools,
    phpTools,
    util
) {
    'use strict';

    describe('PHP Engine array literal expression integration', function () {
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
            'empty array': {
                code: '<?php var_dump(array());',
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: util.heredoc(function (/*<<<EOS
array(0) {
}

EOS
*/) {})
            },
            'array with one auto-indexed element': {
                code: '<?php var_dump(array(2));',
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: util.heredoc(function (/*<<<EOS
array(1) {
  [0]=>
  int(2)
}

EOS
*/) {})
            },
            'array with one explicitly-indexed element': {
                code: '<?php var_dump(array(7 => 4));',
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: util.heredoc(function (/*<<<EOS
array(1) {
  [7]=>
  int(4)
}

EOS
*/) {})
            },
            'array with one explicitly-indexed element used as base for next implicitly-indexed element': {
                code: '<?php var_dump(array(7 => "a", "b"));',
                expectedResult: null,
                expectedStderr: '',
                expectedStdout: util.heredoc(function (/*<<<EOS
array(2) {
  [7]=>
  string(1) "a"
  [8]=>
  string(1) "b"
}

EOS
*/) {})
            }
        }, function (scenario, description) {
            describe(description, function () {
                check(scenario);
            });
        });
    });
});

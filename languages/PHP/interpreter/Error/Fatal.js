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
    'js/util',
    '../Error',
], function (
    util,
    PHPError
) {
    'use strict';

    var MESSAGE_PREFIXES = {
            1: 'Unsupported operand types',
            2: 'Call to undefined function ${name}()',
            3: 'Class \'${name}\' not found',
            4: 'Call to undefined method ${className}::${methodName}()',
            5: '\'goto\' into loop or switch statement is disallowed',
            6: '${name}() must take exactly 1 argument',
            7: 'Maximum execution time of ${seconds} second${suffix} exceeded'
        };

    function PHPFatalError(code, variables) {
        PHPError.call(this, PHPError.E_FATAL, util.stringTemplate(MESSAGE_PREFIXES[code], variables));
    }

    util.inherit(PHPFatalError).from(PHPError);

    util.extend(PHPFatalError, {
        UNSUPPORTED_OPERAND_TYPES: 1,
        CALL_TO_UNDEFINED_FUNCTION: 2,
        CLASS_NOT_FOUND: 3,
        UNDEFINED_METHOD: 4,
        GOTO_DISALLOWED: 5,
        EXPECT_EXACTLY_1_ARG: 6,
        MAX_EXEC_TIME_EXCEEDED: 7
    });

    return PHPFatalError;
});

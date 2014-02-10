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
    './functions/array',
    './functions/option',
    './classes/stdClass',
    './functions/string',
    './functions/variableHandling'
], function (
    arrayFunctions,
    optionFunctions,
    stdClass,
    stringFunctions,
    variableHandlingFunctions
) {
    'use strict';

    return {
        classes: {
            'stdClass': stdClass
        },
        functionGroups: [
            arrayFunctions,
            optionFunctions,
            stringFunctions,
            variableHandlingFunctions
        ]
    };
});

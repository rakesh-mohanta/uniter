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
    './Deferment'
], function (
    util,
    Deferment
) {
    'use strict';

    function PHPEnvironment(state) {
        this.state = state;
    }

    util.extend(PHPEnvironment.prototype, {
        createDeferment: function () {
            return new Deferment(new Error());
        },

        getGlobalScope: function () {
            return this.state.getGlobalScope();
        }
    });

    return PHPEnvironment;
});

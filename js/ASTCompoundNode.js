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
    'js/util'
], function (
    util
) {
    'use strict';

    function ASTCompoundNode() {

    }

    util.extend(ASTCompoundNode.prototype, {
        each: function (iterator) {
            util.each(this.children, iterator);
        }
    });

    return ASTCompoundNode;
});
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
    'js/Promise'
], function (
    util,
    Promise
) {
    'use strict';

    function Deferment(error) {
        Promise.call(this);

        this.error = error;
    }

    util.inherit(Deferment).from(Promise);

    util.extend(Deferment.prototype, {
        getStackASTNodes: function (rowColumnToNodeMap) {
            var stack = this.error.stack,
                lines = stack.split('\n'),
                nodes = [];

            util.each(lines, function (line) {
                var column,
                    match,
                    node,
                    row;

                if (/^\s+at eval \(/.test(line)) {
                    match = line.match(/:(\d+):(\d+)\)$/);

                    if (match) {
                        row = match[1] * 1 - 2;
                        column = match[2] * 1;
                    }

                    node = rowColumnToNodeMap[row + ',' + column];
                    nodes.unshift(node);
                }
            });

            return nodes;
        }
    });

    return Deferment;
});

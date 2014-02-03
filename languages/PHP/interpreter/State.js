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
    './CallStack',
    './Namespace',
    './ReferenceFactory',
    './Scope',
    './Timer',
    './ValueFactory'
], function (
    util,
    CallStack,
    Namespace,
    ReferenceFactory,
    Scope,
    Timer,
    ValueFactory
) {
    'use strict';

    function PHPState(stderr) {
        var callStack = new CallStack(stderr),
            timer = new Timer(),
            valueFactory = new ValueFactory(callStack);

        this.callStack = callStack;
        this.globalNamespace = new Namespace(callStack, valueFactory, null, '');
        this.globalScope = new Scope(callStack, valueFactory, null);
        this.maxSeconds = 1;
        this.referenceFactory = new ReferenceFactory(valueFactory);
        this.callStack = callStack;
        this.timeoutTime = timer.getMilliseconds() + 1000;
        this.timer = timer;
        this.valueFactory = valueFactory;
    }

    util.extend(PHPState.prototype, {
        getCallStack: function () {
            return this.callStack;
        },

        getGlobalNamespace: function () {
            return this.globalNamespace;
        },

        getGlobalScope: function () {
            return this.globalScope;
        },

        getMaxSeconds: function () {
            return this.maxSeconds;
        },

        getReferenceFactory: function () {
            return this.referenceFactory;
        },

        getTimeoutTime: function () {
            return this.timeoutTime;
        },

        getTimer: function () {
            return this.timer;
        },

        getValueFactory: function () {
            return this.valueFactory;
        },

        setTimeLimit: function (maxSeconds) {
            var state = this;

            state.maxSeconds = maxSeconds;
            state.timeoutTime = state.timer.getMilliseconds() + maxSeconds * 1000;
        }
    });

    return PHPState;
});

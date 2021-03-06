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
    './Error',
    './Error/Fatal'
], function (
    util,
    PHPError,
    PHPFatalError
) {
    'use strict';

    var MAGIC_AUTOLOAD_FUNCTION = '__autoload',
        hasOwn = {}.hasOwnProperty;

    function Namespace(callStack, valueFactory, parent, name) {
        this.callStack = callStack;
        this.children = {};
        this.classes = {};
        this.functions = {};
        this.name = name;
        this.parent = parent;
        this.valueFactory = valueFactory;
    }

    util.extend(Namespace.prototype, {
        defineClass: function (name, definition) {
            var constructorName = null,
                namespace = this;

            function Class() {
                var instance = this;

                if (definition.superClassData) {
                    definition.superClassData.Class.call(this);
                }

                util.each(definition.properties, function (value, name) {
                    instance[name] = value;
                });
            }

            if (definition.superClassData) {
                Class.prototype = Object.create(definition.superClassData.Class.prototype);
            }

            util.each(definition.methods, function (method, methodName) {
                // PHP5-style __construct magic method takes precedence
                if (methodName === '__construct') {
                    if (constructorName) {
                        namespace.callStack.raiseError(PHPError.E_STRICT, 'Redefining already defined constructor for class ' + name);
                    }

                    constructorName = methodName;
                }

                if (!constructorName && methodName === name) {
                    constructorName = methodName;
                }

                Class.prototype[methodName] = method;
            });

            namespace.classes[name.toLowerCase()] = {
                constructorName: constructorName,
                name: namespace.getPrefix() + name,
                Class: Class
            };
        },

        defineFunction: function (name, func) {
            var namespace = this;

            if (namespace.name === '') {
                if (/__autoload/i.test(name) && func.length !== 1) {
                    throw new PHPFatalError(PHPFatalError.EXPECT_EXACTLY_1_ARG, {name: name.toLowerCase()});
                }
            }

            namespace.functions[name] = func;
        },

        getClass: function (name) {
            var globalNamespace,
                lowerName = name.toLowerCase(),
                namespace = this;

            if (!hasOwn.call(namespace.classes, lowerName)) {
                globalNamespace = namespace.getGlobal();

                if (hasOwn.call(globalNamespace.functions, MAGIC_AUTOLOAD_FUNCTION)) {
                    globalNamespace.functions[MAGIC_AUTOLOAD_FUNCTION](namespace.valueFactory.createString(namespace.getPrefix() + name));
                }

                if (!hasOwn.call(namespace.classes, lowerName)) {
                    throw new PHPFatalError(PHPFatalError.CLASS_NOT_FOUND, {name: name});
                }
            }

            return namespace.classes[lowerName];
        },

        getDescendant: function (name) {
            var namespace = this;

            util.each(name.split('\\'), function (part) {
                if (!hasOwn.call(namespace.children, part)) {
                    namespace.children[part] = new Namespace(namespace.callStack, namespace.valueFactory, namespace, part);
                }

                namespace = namespace.children[part];
            });

            return namespace;
        },

        getFunction: function (name) {
            var namespace = this;

            if (util.isFunction(name)) {
                return name;
            }

            while (namespace && !hasOwn.call(namespace.functions, name)) {
                namespace = namespace.getParent();
            }

            if (!namespace) {
                throw new PHPFatalError(PHPFatalError.CALL_TO_UNDEFINED_FUNCTION, {name: name});
            }

            return namespace.functions[name];
        },

        getGlobal: function () {
            var namespace = this;

            return namespace.name === '' ? namespace : namespace.getParent().getGlobal();
        },

        getParent: function () {
            return this.parent;
        },

        getPrefix: function () {
            var namespace = this;

            if (namespace.name === '') {
                return '';
            }

            return (namespace.parent ? namespace.parent.getPrefix() : '') + namespace.name + '\\';
        }
    });

    return Namespace;
});

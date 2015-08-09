var CTW2Plugin = CTW2Plugin || {};

CTW2Plugin.Validator = (function() {
    'use strict';

    var _version   = '1.0.0';
    var _namespace = 'CTW2.Plugin.Validator';

    function Validator() {
    }

    Validator.prototype.getVersion = function() {
        return _version;
    };

    Validator.prototype.getNamespace = function() {
        return _namespace;
    };

    Validator.prototype.run = function() {
        if (!this.isValid(this)) {
            throw 'The core validator doesn\'t seem to be valid. This should never happen...';
        }
    };

    Validator.prototype.stop = function() {
        // we cannot stop the validator
    };

    Validator.prototype.isValid = function(plugin) {
        if (typeof plugin.getVersion !== 'function') {
            return false;
        }

        if (typeof plugin.getNamespace !== 'function') {
            return false;
        }

        if (typeof plugin.run !== 'function') {
            return false;
        }

        if (typeof plugin.stop !== 'function') {
            return false;
        }

        return true;
    };

    return Validator;
}());

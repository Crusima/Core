var CTW2 = (function() {
    'use strict';

    var _name      = 'Crusima\'s Tribal Wars 2 Plugin';
    var _version   = '0.6.1';
    var _validator = null;

    var _storageKey    = 'CTW2Plugins';
    var _storedPlugins = {};

    var _plugins = {};

    function compare(v1, v2, options) {
        var lexicographical = options && options.lexicographical,
            zeroExtend = options && options.zeroExtend,
            v1parts = v1.split('.'),
            v2parts = v2.split('.');

        function isValidPart(x) {
            return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
        }

        if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
            return NaN;
        }

        if (zeroExtend) {
            while (v1parts.length < v2parts.length) v1parts.push("0");
            while (v2parts.length < v1parts.length) v2parts.push("0");
        }

        if (!lexicographical) {
            v1parts = v1parts.map(Number);
            v2parts = v2parts.map(Number);
        }

        for (var i = 0; i < v1parts.length; ++i) {
            if (v2parts.length == i) {
                return 1;
            }

            if (v1parts[i] == v2parts[i]) {
                continue;
            } else if (v1parts[i] > v2parts[i]) {
                return 1;
            } else {
                return -1;
            }
        }

        if (v1parts.length != v2parts.length) {
            return -1;
        }

        return 0;
    }

    function matches(v1, v2, options){
        return compare(v1, v2, options) === 0;
    }

    function gt(v1, v2, options){
        return compare(v1, v2, options) > 0;
    }

    function gte(v1, v2, options){
        return compare(v1, v2, options) >= 0;
    }

    function lt(v1, v2, options){
        return compare(v1, v2, options) < 0;
    }

    function lte(v1, v2, options){
        return compare(v1, v2, options) <= 0;
    }

    function CTW2() {
    }

    CTW2.prototype.getName = function() {
        return _name;
    };

    CTW2.prototype.getVersion = function() {
        return _version;
    };

    CTW2.prototype.store = function(name, code) {
        _storedPlugins[name] = code;

        localStorage.setItem(_storageKey, JSON.stringify(_storedPlugins));
    };

    CTW2.prototype.register = function(plugin) {
        if (plugin.getNamespace() === 'CTW2.Plugin.Validator') {
            _validator = plugin;
        }

        if (_validator !== null && !_validator.isValid(plugin)) {
            console.log('Trying to register an invalid plugin (' + plugin.getNamespace() + ')!');

            return false;
        }

        _plugins[plugin.getNamespace()] = plugin;

        var pluginRow  = document.querySelector('[data-pluginrow="' + plugin.getNamespace() + '"]');
        var pluginInfo = document.querySelector('[data-pluginrow="' + plugin.getNamespace() + '"] .plugin-name-and-version');
        var pluginList = document.querySelector('.plugin-list tbody');

        if (pluginInfo) {
            pluginInfo.textContent = plugin.getNamespace() + ' ' + plugin.getVersion();
        } else if (pluginList) {
            var _pluginHtml = '';

            _pluginHtml += '<tr data-pluginrow="' + plugin.getNamespace() + '" class="new-plugin-row">';
            _pluginHtml += '    <td colspan="2">';
            _pluginHtml += '        <span class="ff-cell-fix ng-binding plugin-name-and-version">' + plugin.getNamespace() + ' ' + plugin.getVersion() +  '</span>';
            _pluginHtml += '    </td>';
            _pluginHtml += '</tr>';

            var parser = new DOMParser();
            var doc    = parser.parseFromString(_pluginHtml, 'text/xml');

            pluginList.appendChild(doc.documentElement);

            document.querySelector('.new-plugin-row').removeAttribute('class');
        }

        return true;
    };

    CTW2.prototype.registerAndRun = function(plugin) {
        if (!_validator.isValid(plugin)) {
            alert('Plugin is not valid!');

            return;
        }

        if (this.isPluginRegistered(plugin.getNamespace())) {
            var loadedPlugin = this.getRegisteredPlugin(plugin.getNamespace());

            if (matches(loadedPlugin.getVersion(), plugin.getVersion())) {
                alert('Plugin already loaded');

                return;
            }

            if (gt(loadedPlugin.getVersion(), plugin.getVersion())) {
                if (!confirm('Are you sure you want to downgrade this plugin?')) {
                    return;
                }

                loadedPlugin.stop();
            }

            if (lt(loadedPlugin.getVersion(), plugin.getVersion())) {
                if (!confirm('Are you sure you want to upgrade this plugin?')) {
                    return;
                }

                loadedPlugin.stop();
            }
        }

        this.register(plugin)

        plugin.run();
    };

    CTW2.prototype.unregister = function(name) {
        if (!this.isPluginRegistered(name)) {
            return;
        }

        var plugin = this.getRegisteredPlugin(name);

        plugin.stop();

        delete _storedPlugins[name];

        localStorage.setItem(_storageKey, JSON.stringify(_storedPlugins));
    };

    CTW2.prototype.isPluginRegistered = function(name) {
        return _plugins.hasOwnProperty(name);
    };

    CTW2.prototype.getRegisteredPlugins = function() {
        return _plugins;
    };

    CTW2.prototype.getRegisteredPlugin = function(name) {
        for (var key in _plugins) {
            if (!_plugins.hasOwnProperty(key)) {
                continue;
            }

            if (_plugins[key].getNamespace() === name) {
                return _plugins[key];
            }
        }
    };

    CTW2.prototype.run = function() {
        setTimeout(function() {
            if (!document.getElementById('resource-bar')) {
                this.run();

                return;
            }

            this.load();
        }.bind(this), 2000);
    };

    CTW2.prototype.load = function() {
        for (var name in _plugins) {
            if (!_plugins.hasOwnProperty(name)) {
                continue;
            }

            _plugins[name].run();
        }

        var storedPlugins = localStorage.getItem(_storageKey);

        if (storedPlugins) {
            storedPlugins = JSON.parse(storedPlugins);

            for (var key in storedPlugins) {
                if (!storedPlugins.hasOwnProperty(key)) {
                    continue;
                }

                var newPluginName = null;
                var _mainPlugin   = this;

                eval("'use strict'; " + storedPlugins[key]);

                _storedPlugins[newPluginName] = storedPlugins[key];
            }
        }
    };

    return CTW2;
}());

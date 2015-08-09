// ==UserScript==
// @name       Crusima's Tribal Wars 2 Plugin
// @namespace
// @author     Crusima
// @version    0.6.1
// @description  This plugin helps people better manage their villages and tribe
// @match      https://en.tribalwars2.com/game.php?world=*
// @copyright  2015, Crusima
// ==/UserScript==

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

var CTW2Plugin = CTW2Plugin || {};

CTW2Plugin.Version = (function() {
    'use strict';

    var _version   = '1.0.0';
    var _namespace = 'CTW2.Plugin.Version';

    var _mainVersion = null;
    var _mainName    = null;

    function Version(mainVersion, mainName) {
        _mainVersion = mainVersion;
        _mainName    = mainName;
    }

    Version.prototype.getVersion = function() {
        return _version;
    };

    Version.prototype.getNamespace = function() {
        return _namespace;
    };

    Version.prototype.run = function() {
        var versionDiv = document.createElement('div');

        versionDiv.setAttribute('id', 'plugin-version');
        versionDiv.appendChild(document.createTextNode(_mainName + ' (v' + _mainVersion + ')'));

        versionDiv.style.position = 'absolute';
        versionDiv.style.left     = '490px';
        versionDiv.style.top      = '12px';

        document.getElementById('top-wrapper').appendChild(versionDiv);
    };

    Version.prototype.stop = function() {
        document.getElementById('plugin-version').parentNode.removeChild(document.getElementById('plugin-version'));
    }

    return Version;
}());

var CTW2Plugin = CTW2Plugin || {};

CTW2Plugin.Settings = (function() {
    'use strict';

    var _version   = '0.6.0';
    var _namespace = 'CTW2.Plugin.Settings';

    var _mainVersion = null;
    var _mainName    = null;
    var _mainPlugin  = null;

    var _corePlugins = ['CTW2.Plugin.Validator', 'CTW2.Plugin.Version', 'CTW2.Plugin.Settings'];

    var _modalHtml = '';

    _modalHtml += '<section class="screen-settings twx-window screen left plugin-modal">';
    _modalHtml += '    <div id="settings" class="win-content ng-scope">';
    _modalHtml += '        <header class="win-head">';
    _modalHtml += '            <h2 class="ng-binding">{{title}}</h2>';
    _modalHtml += '            <ul class="list-btn">';
    _modalHtml += '                <li><a href="#" class="size-34x34 btn-red icon-26x26-close plugin-close-modal"></a></li>';
    _modalHtml += '            </ul>';
    _modalHtml += '        </header>';
    _modalHtml += '{{content}}';
    _modalHtml += '    </div>';
    _modalHtml += '</section>';

    var _template = '';

    _template += '        <div class="win-main jssb-applied jssb-scrolly" scrollbar="" style="position: relative;">';
    _template += '            <div class="tabs tabs-bg tab-icons">';
    _template += '                <div class="tabs-eight-col">';

    _template += '                    <div class="tab ng-scope tab-active activate-tab-modules">';
    _template += '                        <div class="tab-inner" tooltip="" tooltip-content="Modules">';
    _template += '                            <div class="settings-border box-border-light">';
    _template += '                                <div class="button-wrap">';
    _template += '                                    <a href="#" class="btn-icon btn-orange plugin-settings-modules" data-pluginitem="modules">';
    _template += '                                        <span style="top: 9px; position: relative; color: white;">Modules</span>';
    _template += '                                    </a>';
    _template += '                                </div>';
    _template += '                            </div>';
    _template += '                        </div>';
    _template += '                    </div>';

    _template += '                </div>';
    _template += '            </div>';

    // chat settings
    _template += '            <div class="box-paper tabs-icons" style="overflow-y: auto;">';
    _template += '                <div class="scroll-wrap">';

    _template += '                    <div class="ng-scope plugin-settings-tab-data tab-modules">';
    _template += '                        <form name="changePluginSettings" class="ng-pristine ng-valid-email ng-invalid ng-invalid-required">';
    _template += '                            <table class="tbl-border-light tbl-content tbl-medium-height plugin-list">';
    _template += '                                <colgroup><col></col><col width="32px"></col></colgroup>';
    _template += '                                <tbody>';
    _template += '                                    <tr>';
    _template += '                                        <th colspan="2" class="ng-binding">Registered modules</th>';
    _template += '                                    </tr>';

    _template += '{{plugins}}';

    _template += '                                </tbody>';
    _template += '                            </table>';
    _template += '                        </form>';
    _template += '                    </div>';

    _template += '                    <div class="ng-scope plugin-settings-tab-data tab-load">';
    _template += '                        <form name="changePluginSettings" class="ng-pristine ng-valid-email ng-invalid ng-invalid-required">';
    _template += '                            <table class="tbl-border-light tbl-content tbl-medium-height">';
    _template += '                                <colgroup><col></col><col width="32px"></col></colgroup>';
    _template += '                                <tbody>';
    _template += '                                    <tr>';
    _template += '                                        <th colspan="2" class="ng-binding">Register new module</th>';
    _template += '                                    </tr>';

    _template += '                                    <tr>';
    _template += '                                        <td colspan="2">';
    _template += '                                            <span class="ff-cell-fix ng-binding">Paste the new module below:</span>';
    _template += '                                        </td>';
    _template += '                                    </tr>';
    _template += '                                    <tr>';
    _template += '                                        <td colspan="2">';
    _template += '                                            <textarea id="plugin-settings-modules-load" type="checkbox" class="ng-pristine ng-untouched ng-valid" style="width: 100%; height: 100px; color: white;"></textarea>';
    _template += '                                        </td>';
    _template += '                                    </tr>';
    _template += '                                    <tr>';
    _template += '                                        <td colspan="2">';
    _template += '                                            <a href="#" class="btn-border btn-orange ng-binding load-module-button" tooltip="" tooltip-content="Load">Load</a>';
    _template += '                                        </td>';
    _template += '                                    </tr>';

    _template += '                                </tbody>';
    _template += '                            </table>';
    _template += '                        </form>';
    _template += '                    </div>';

    _template += '                    <div class="ng-scope plugin-settings-tab-data tab-unload">';
    _template += '                        <form name="changePluginSettings" class="ng-pristine ng-valid-email ng-invalid ng-invalid-required">';
    _template += '                            <table class="tbl-border-light tbl-content tbl-medium-height">';
    _template += '                                <colgroup><col></col><col width="32px"></col></colgroup>';
    _template += '                                <tbody>';
    _template += '                                    <tr>';
    _template += '                                        <th colspan="2" class="ng-binding">Unregister a module</th>';
    _template += '                                    </tr>';

    _template += '                                    <tr>';
    _template += '                                        <td colspan="2">';
    _template += '                                            <span class="ff-cell-fix ng-binding">Type the name of the module to unregister:</span>';
    _template += '                                        </td>';
    _template += '                                    </tr>';
    _template += '                                    <tr>';
    _template += '                                        <td colspan="2">';
    _template += '                                            <input type="text" id="plugin-settings-modules-unload" class="ng-pristine ng-untouched ng-valid" style="color: white;">';
    _template += '                                        </td>';
    _template += '                                    </tr>';
    _template += '                                    <tr>';
    _template += '                                        <td colspan="2">';
    _template += '                                            <a href="#" class="btn-border btn-orange ng-binding unload-module-button" tooltip="" tooltip-content="Unregister">Unregister</a>';
    _template += '                                        </td>';
    _template += '                                    </tr>';

    _template += '                                </tbody>';
    _template += '                            </table>';
    _template += '                        </form>';
    _template += '                    </div>';

    _template += '                </div>';
    _template += '            </div>';

    _template += '        </div>';

    function createModal(html) {
        var parser = new DOMParser();
        var doc    = parser.parseFromString(html, 'text/html');

        return doc.documentElement.querySelector('.plugin-modal');
    }

    function addPlugins() {
        var registeredPlugins = _mainPlugin.getRegisteredPlugins();

        var _plugins = '';

        for (var key in registeredPlugins) {
            if (!registeredPlugins.hasOwnProperty(key)) {
                continue;
            }

            var isCore = '';

            if (isCorePlugin(registeredPlugins[key].getNamespace())) {
                isCore = '(Core)';
            }

            _plugins += '                                    <tr data-pluginrow="' + registeredPlugins[key].getNamespace() + '">';
            _plugins += '                                        <td colspan="2">';
            _plugins += '                                            <span class="ff-cell-fix ng-binding plugin-name-and-version">' + registeredPlugins[key].getNamespace() + ' ' + registeredPlugins[key].getVersion() +  ' ' + isCore + '</span>';
            _plugins += '                                        </td>';
            _plugins += '                                    </tr>';
        }

        return _plugins;
    }

    function openModal() {
        var mainTemplate = _modalHtml;

        mainTemplate = mainTemplate.replace('{{title}}', _mainName);
        mainTemplate = mainTemplate.replace('{{content}}', _template);
        mainTemplate = mainTemplate.replace('{{plugins}}', addPlugins());

        document.getElementById('wrapper').appendChild(createModal(mainTemplate));

        document.querySelector('.plugin-close-modal').addEventListener('click', closeModal);

        document.querySelector('.load-module-button').addEventListener('click', function(e) {
            e.preventDefault();

            var newPluginName = null;

            eval("'use strict'; " + document.getElementById('plugin-settings-modules-load').value);

            _mainPlugin.store(newPluginName, document.getElementById('plugin-settings-modules-load').value);

            document.getElementById('plugin-settings-modules-load').value = '';
        });

        document.querySelector('.unload-module-button').addEventListener('click', function(e) {
            e.preventDefault();

            _mainPlugin.unregister(document.getElementById('plugin-settings-modules-unload').value);

            alert('Plugin unregistered');
        });
    }

    function closeModal() {
        var modal = document.querySelector('.plugin-modal');

        modal.parentNode.removeChild(modal);
    }

    function isCorePlugin(name) {
        for (var i = 0, l = _corePlugins.length; i < l; i++) {
            if (_corePlugins[i] === name) {
                return true;
            }
        }

        return false;
    }

    function Settings(mainVersion, mainName, mainPlugin) {
        _mainVersion = mainVersion;
        _mainName    = mainName;
        _mainPlugin  = mainPlugin;
    }

    Settings.prototype.getVersion = function() {
        return _version;
    };

    Settings.prototype.getNamespace = function() {
        return _namespace;
    };

    Settings.prototype.run = function() {
        var versionDiv = document.getElementById('plugin-version');

        versionDiv.style.cursor = 'pointer';

        versionDiv.addEventListener('click', openModal);
    };

    Settings.prototype.stop = function() {
        var versionDiv = document.getElementById('plugin-version');

        versionDiv.style.removeProperty('cursor');

        versionDiv.removeEventListener('click', openModal);
    };

    return Settings;
}());

(function(Plugin, Plugins) {
    var plugin    = new Plugin();
    var validator = new Plugins.Validator();
    var version   = new Plugins.Version(plugin.getVersion(), plugin.getName());
    var settings  = new Plugins.Settings(plugin.getVersion(), plugin.getName(), plugin);

    plugin.register(validator);
    plugin.register(version);
    plugin.register(settings);

    plugin.run();
}(CTW2, CTW2Plugin));

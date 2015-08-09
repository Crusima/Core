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

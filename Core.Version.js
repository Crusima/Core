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

# Core

This repository contains alls the core files for Crusima's Tribal Wars 2 plugin.

## Installation

1. Install the tampermonkey plugin for [Chrome][chromemonkey], [Firefox][firefoxmonkey] or [Opera][operamonkey]
2. Add the [main plugin file][maincore] to tamper/greasemonkey

## Usage

### Basic operation

Once the core plugin code is installed the version will be displayed at the top of the game window once logged in:

![title](https://cloud.githubusercontent.com/assets/13717315/9154810/02d9b664-3ea2-11e5-8356-2c3d288a40bb.png)

Clicking on the plugin title will show the plugin panel. The plugin panel will list the currently installed modules, allows you to install a new module and allows you to unregister an installed module:

![plugin panel](https://cloud.githubusercontent.com/assets/13717315/9154809/02d93d10-3ea2-11e5-9809-169c6d78fbe2.png)

*Note: after you install the core plugin it might be needed to close and re-open the tribal wars screen. Modules will be active immediately.*

### Installing modules

Once you have installed the core plugin, you want to install modules. Modules do the actual work in the plugin. The core plugin just keeps track of installed modules, handles versioning of modules and validated modules.

To install a module get the minified version (often denoted by the word min in the filename, e.g. `Example.Plugin.min.js`) of the module file and paste the contents in the "register new module" field and click on "Load".

For a list of currently available modules check my [main page][mainpage].

### Updating modules

Updating (or downgrading) modules work in exactly the same way as installing modules. Just get the minified version of the module file, paste it in the "register new module" field and click "Load". The plugin will automaticaly check the version of the module.

### 3rd party modules

The core plugin also provides a way for 3rd parties to develop modules. For more information about developing your own module see the [example repository][example].

*Note on using 3rd pary modules: because there is no way for me to know what a certain 3rd pary module does you should always make sure the module is not malicious. You are basically running random code on your local machine.*

## Supported browsers

Currently the plugin (and modules) are only tested on Chrome (unless noted otherwise). Because of the way the plugin works it should also work in both Opera and FireFox. If you are running the plugin (and modules) on one of these browsers please let me know whether it works or not, so that I can either fix it or add the browser to the list of tested browsers.

[chromemonkey]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
[firefoxmonkey]: https://addons.mozilla.org/nl/firefox/addon/greasemonkey/
[operamonkey]: https://addons.opera.com/nl/extensions/details/tampermonkey-beta/?display=en
[maincore]: https://github.com/Crusima/Core/blob/master/Plugin.js
[mainpage]: https://github.com/Crusima?tab=repositories
[example]: https://github.com/Crusima/ExamplePlugin

# Core

This repository contains alls the core files for Crusima's Tribal Wars 2 plugin.

## Installation

1. Install the tampermonkey plugin for [Chrome][chromemonkey], [Firefox][firefoxmonkey] or [Opera][operamonkey]
2. Add the [minified core script][mincore] to tamper/greasemonkey

## Usage

Once the core plugin code is installed the version will be displayed at the top of the game window once logged in:

![title](https://cloud.githubusercontent.com/assets/13717315/9154810/02d9b664-3ea2-11e5-8356-2c3d288a40bb.png)

Clicking on the plugin title will show the plugin panel. The plugin panel will list the currently installed modules, allows you to install a new module and allows you to unregister an installed module:

![plugin panel](https://cloud.githubusercontent.com/assets/13717315/9154809/02d93d10-3ea2-11e5-9809-169c6d78fbe2.png)

*Note: after you install the core plugin it might be needed to close and re-open the tribal wars screen. Modules will be active immediately.*

Once you have installed the core plugin, you want to install modules. Modules do the actual work in the plugin. The core plugin just keeps track of installed modules, handles versioning of modules and validated modules.

For a list of currently available modules check my [main page][mainpage].

The core plugin also provides a way for 3rd parties to develop modules. For more information about developing your own module see the [example repository][example].

*Note on using 3rd pary modules: because there is no way for me to know what a certain 3rd pary module does you should always make sure the module is not malicious. You are basically running random code on your local machine.*

[chromemonkey]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
[firefoxmonkey]: https://addons.mozilla.org/nl/firefox/addon/greasemonkey/
[operamonkey]: https://addons.opera.com/nl/extensions/details/tampermonkey-beta/?display=en
[mincore]: http://google.com
[mainpage]: https://github.com/Crusima
[example]: https://github.com/Crusima/ExamplePlugin

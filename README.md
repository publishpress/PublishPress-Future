# PublishPress-Future-Pro

## Installation

:warning: **Warning! This plugin requires to be built before being installed!**

This repository doesn't store external dependencies required by the plugin. It's not possible to simply clone or download the repository code and have a working WordPress plugin.

We aim to follow good practices on development, and we are using Composer as dependency manager, which recommends to not add external dependencies into the repository. You can find more information on their documentation page: [Should I commit the dependencies in my vendor directory?](https://getcomposer.org/doc/faqs/should-i-commit-the-dependencies-in-my-vendor-directory.md)

### How to install?

You can download a built package from [releases page](/releases/) and install it on your WordPress sites by uploading the zip file.

## How to build a package?

Please, check our Slab documentation for more information about how to build a package: [How to build a package](https://rambleventures.slab.com/posts/building-plugin-packages-odg3nll2)

## How to analyse webpack bundle?

```bash
./node_modules/.bin/webpack --profile --json > webpack-bundle-stats.json
```

Then load `https://127.0.0.1:8888` in the browser.

Please, note this do not work inside the dev-workflow for now.

### Another option is analysing the source map files

```bash
./node_modules/.bin/source-map-explorer ./src/assets/js/workflow-editor.js
```

It will open an HTML page with the analysis of the source map file in the browser.
Please, note this do not work inside the dev-workflow for now.

## License

License: [GPLv2 or later](http://www.gnu.org/licenses/gpl-2.0.html)

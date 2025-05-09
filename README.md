# PublishPress-Future

[![VIP Scans and other code checks](https://github.com/publishpress/PublishPress-Future/actions/workflows/code-check.yml/badge.svg)](https://github.com/publishpress/PublishPress-Future/actions/workflows/code-check.yml) [![Unit and Integration Tests](https://github.com/publishpress/PublishPress-Future/actions/workflows/code-test.yml/badge.svg?branch=develop)](https://github.com/publishpress/PublishPress-Future/actions/workflows/code-test.yml)

## Installation

:warning: **Warning! This plugin requires to be built before being installed!**

This repository doesn't store external dependencies required by the plugin. It's not possible to simply clone or download the repository code and have a working WordPress plugin.

We aim to follow good practices on development, and we are using Composer as dependency manager, which recommends to not add external dependencies into the repository. You can find more information on their documentation page: [Should I commit the dependencies in my vendor directory?](https://getcomposer.org/doc/faqs/should-i-commit-the-dependencies-in-my-vendor-directory.md)

### How to install?

You can download a built package from [releases page](/releases/) and install it on your WordPress sites by uploading the zip file.

## How to build a package?

Please, check our Slab documentation for more information about how to build a package: [How to build a package](https://rambleventures.slab.com/posts/building-plugin-packages-odg3nll2)

## Testing

### Create a symlink for the plugin folder in the test environment

Always use the full path for the source folder.

```bash
ln -s /Users/andersonmartins/Projects/git/publishpress/publishpress-future/ ./tests/_wordpress/wp-content/plugins/post-expirator
```

### Start the dev server

```bash
composer tests:dev-start
```

### Run the tests

```bash
composer tests:run
composer tests:integration
composer tests:e2e
```

## License

License: [GPLv2 or later](http://www.gnu.org/licenses/gpl-2.0.html)

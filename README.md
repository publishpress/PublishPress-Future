# PublishPress-Future

## Installation

:warning: **Warning! This plugin requires to be built before being installed!**

This repository doesn't store external dependencies required by the plugin. It's not possible to simply clone or download the repository code and have a working WordPress plugin.

We aim to follow good practices on development, and we are using Composer as dependency manager, which recommends to not add external dependencies into the repository. You can find more information on their documentation page: [Should I commit the dependencies in my vendor directory?](https://getcomposer.org/doc/faqs/should-i-commit-the-dependencies-in-my-vendor-directory.md)

### How to install?

You can download a built package from [releases page](/releases/) and install it on your WordPress sites by uploading the zip file.

## How to build a package?

Please, check the instructions on our [documentation pages](https://publishpress.github.io/docs/deployment/building).

## How to run CLI command from inside Docker

```bash
docker exec -it devkinsta_fpm wp --allow-root --path=/www/kinsta/public/plugindev  publishpress-future expire-post <post_id>
```

## License

License: [GPLv2 or later](http://www.gnu.org/licenses/gpl-2.0.html)

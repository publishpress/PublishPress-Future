# PublishPress-Future Builder

## Builder

```bash
docker build -t ppbuilder builder/docker
docker run -it --rm -v $PWD:/app ppbuilder

builder/docker/scripts/build build
builder/docker/scripts/build build-dir
```

If you prefer you can run the js scripts:

```bash
yarn run build
yarn run build:dir
yarn run build:clean
```

## Build Assets

```bash
yarn run jsbuild
yarn run jsbuild:dev
yarn run jsbuild:watch
```

## Tests

Available versions: php5.6, php7.4, php8.0, php8.1, php8.2

```bash
tests/bin/tests php5.6 start
tests/bin/tests php5.6 stop
tests/bin/tests php5.6 run tests/codeception/acceptance/features/settings.feature
```

If you prefer you can run the yarn scripts:

```bash
yarn run tests:start
yarn run tests:stop
yarn run tests:run unit
yarn run tests:run wordpress
yarn run tests:run acceptance
yarn run tests:run tests/codeception/acceptance/features/settings.feature
yarn run tests:build:run wordpress
yarn run tests:build:run acceptance
yarn run tests:build:run tests/codeception/acceptance/features/settings.feature
```

The command `tests:build:run` run the PHP build process before running the tests. Use that if you are testing code that was recently modified. If you wan't to just repeat the tests without building (when no change was done in the plugin code) you can add a `-` to the end of the command: `tests:run`.

After `tests:build:run` or `tests:run` you can pass any codeception argument you would normally pass: the suite name, a test file etc.

## Running WP CLI on devkinsta

```bash
yarn run wp
```

You can pass arguments after the command, normally. But for passing named arguments you need to pass the `--` argument before them, otherwise those named arguments won't bypass and `npm` will interpret them instead. For example:

```bash
yarn run wp cron event run -- --due-now
```

## TODO

* [ ] Wrap all dev dependencies in the docker container, and build scripts;
* [ ] Make the phpbuilder container use cache for composer and other;
* [ ] Show how to add SSH keys for using composer and git;
* [ ] Fix permissions on dist files when builder ran inside the container;

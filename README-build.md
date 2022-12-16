# PublishPress-Future Builder

## Builder

```bash
docker build -t ppbuilder builder/docker
docker run -it --rm -v $PWD:/app ppbuilder

builder/docker/scripts/build build
builder/docker/scripts/build build-dir
```

If you prefer you can run the npm scripts:

```bash
npm run build
npm run build:dir
npm run build:clean
```

## Build Assets

```bash
npm run jsbuild
npm run jsbuild:dev
npm run jsbuild:watch
```

## Tests

Available versions: php5.6, php7.4, php8.0, php8.1, php8.2

```bash
tests/bin/tests php5.6 start
tests/bin/tests php5.6 stop
tests/bin/tests php5.6 run tests/codeception/acceptance/features/settings.feature
```

If you prefer you can run the npm scripts:

```bash
npm run tests:start
npm run tests:stop
npm run tests:run unit
npm run tests:run wordpress
npm run tests:run acceptance
npm run tests:run tests/codeception/acceptance/features/settings.feature
npm run tests:build:run wordpress
npm run tests:build:run acceptance
npm run tests:build:run tests/codeception/acceptance/features/settings.feature
```

The command `tests:build:run` run the PHP build process before running the tests. Use that if you are testing code that was recently modified. If you wan't to just repeat the tests without building (when no change was done in the plugin code) you can add a `-` to the end of the command: `tests:run`.

After `tests:build:run` or `tests:run` you can pass any codeception argument you would normally pass: the suite name, a test file etc.

## TODO

* [ ] Wrap all dev dependencies in the docker container, and build scripts;
* [ ] Make the phpbuilder container use cache for composer and other;
* [ ] Show how to add SSH keys for using composer and git;
* [ ] Fix permissions on dist files when builder ran inside the container;

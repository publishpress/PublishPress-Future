# PublishPress-Future Builder

## Builder

```bash
docker build -t ppbuilder builder/docker
docker run -it --rm -v $PWD:/app ppbuilder

builder/docker/scripts/build build
builder/docker/scripts/build build-dir



```

## Tests

Available versions: php5.6, php7.4, php8.0, php8.1

```bash
tests/bin/tests php5.6 start
tests/bin/tests php5.6 stop
tests/bin/tests php5.6 run tests/codeception/acceptance/features/settings.feature
```

## TODO

* [ ] Wrap all dev dependencies in the docker container, and build scripts;
* [ ] Make the phpbuilder container use cache for composer and other;
* [ ] Show how to add SSH keys for using composer and git;
* [ ] Fix permissions on dist files when builder ran inside the container;

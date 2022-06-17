# PublishPress-Future Builder

## Builder

```bash
docker build -t ppbuilder bin/docker
docker run -it --rm -v $PWD:/app ppbuilder

```

## Tests

Available versions: php5.6, php7.4, php8.0, php8.1

```bash
composer tests stop php5.6
composer tests start php5.6
vendor/bin/codecept run acceptance --env php5.6
```

## TODO

* [ ] Wrap all dev dependencies in the docker container, and build scripts;
* [ ] Make the phpbuilder container use cache for composer and other;
* [ ] Show how to add SSH keys for using composer and git;
* [ ] Fix permissions on dist files when builder ran inside the container;

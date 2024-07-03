# Testing the plugin

We use Codeception and WPBrowser to test the plugin. The tests are located in the `tests` directory.

## Starting the test environment

All the commands to interact with the test environment should not be executed from inside the dev-workspace container.
That is because the test environment requires ChromeDriver which is not installed in the dev-workspace container but locally.

To start the test environment, execute the following command:

```bash
composer tests:dev-start
```

Check the test environment information by executing the following command:

```bash
composer tests:dev-info
```

Copy the file `tests/.env-dist` as  `tests/.env` and update it according to the test environment information.

## Running the tests

The default configuration for the tests is to use the WPBrowser builtin PHP server and a SQLite database. To run the tests, execute the following command:

```bash
vendor/bin/codecept run
```

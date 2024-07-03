# Testing the plugin

We use Codeception and WPBrowser to test the plugin. The tests are located in the `tests` directory.

## Installation

Make sure all the required packages are installed by executing the following command:

```bash
composer install
```

The tests require the WordPress core files to be downloaded in the folder `tests/_wordpress`.
To download and prepare the WordPress core files, execute the following command:

```bash
composer tests:dev-install
```

Install ChromeDriver on your machine. You can do this by downloading directly from
https://googlechromelabs.github.io/chrome-for-testing/#stable according to your current platform, and extracting the binary to a known path in your system.
Or if you prefer you can install it using `apt` or `brew`.

After installing it, update the `tests/.env` file with the path to the ChromeDriver binary:

```ini
CHROMEDRIVER_BINARY=/opt/homebrew/bin/chromedriver
```

Copy the file `tests/.env-dist` as  `tests/.env` and only update its data if needed. The default values should work for most cases.
The variables that usually need to be updated are: CHROMEDRIVER_BINARY, CHROMEDRIVER_PORT and BUILTIN_SERVER_PORT, in case the default ports
are already in use or you installed chromedriver on a different path.

## Starting the test environment

All the commands to interact with the test environment "should not be executed from inside the dev-workspace container".
That is because the test environment requires ChromeDriver which is not installed in the dev-workspace container but locally.

To start the test environment, execute the following command:

```bash
composer tests:dev-start
```

Check the test environment information by executing the following command:

```bash
composer tests:dev-info
```

## Running the tests

The default configuration for the tests is to use the WPBrowser builtin PHP server and a SQLite database. To run the tests, execute the following command:

```bash
vendor/bin/codecept run
```

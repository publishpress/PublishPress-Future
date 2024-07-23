# Testing the plugin

We use Codeception and WPBrowser to test the plugin. The tests are located in the `tests` directory.

## Installation

Make sure all the required packages are installed by executing the following command **inside the dev-workspace terminal**:

```bash
composer install
```

Exit the dev-workspace terminal and run the following commands **outside the dev-workspace terminal**.

Install ChromeDriver on your machine. You can do this by downloading directly from
https://googlechromelabs.github.io/chrome-for-testing/#stable according to your current platform, and extracting the binary to a known path in your system.
Or if you prefer you can install it using `apt` or `brew`.

After installing it, update the `tests/.env` file with the path to the ChromeDriver binary:

```ini
CHROMEDRIVER_BINARY=/opt/homebrew/bin/chromedriver
```

Copy the file `dev-workspace/.env-example` as  `dev-workspace/.env` and customize its data. The default values should work for most cases.
The variables that usually need to be updated are: CHROMEDRIVER_BINARY, CHROMEDRIVER_PORT and BUILTIN_SERVER_PORT, in case the default ports
are already in use or you installed chromedriver on a different path.

## Linking the plugin

To run the tests, the plugin must be linked to the WordPress installation. To do this, execute the following command:

```bash
composer tests:link
```

## Start the ChromeDriver

Run the ChromeDriver binary in a separate terminal:

```bash
chromedriver --port=9515
```

## Running the tests

The default configuration for the tests is to use the WPBrowser builtin PHP server and a SQLite database. To run the tests, execute the following command:

```bash
vendor/bin/codecept run
```

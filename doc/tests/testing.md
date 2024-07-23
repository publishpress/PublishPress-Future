# Testing the plugin

We use WPBrowser (built on top of Codeception), and Docker to test the plugin. The tests are located in the `tests` directory.

## Installation

Make sure all the required packages are installed by executing the following command **inside the dev-workspace terminal**:

```bash
composer install
```

**Exit** the dev-workspace terminal and run the test commands **outside the dev-workspace terminal**.

Install ChromeDriver on your machine. You can do this by downloading directly from
https://googlechromelabs.github.io/chrome-for-testing/#stable according to your current platform, and extracting the binary to a known path in your system.
Or if you prefer you can install it using `apt` or `brew`.

## Configuring

It is required to have `tests/.env` file. Create it running the following content:

```bash
composer tests:env
```

Open the file `tests/.env` and edit the ChromeDriver binary path, according to the path you installed it:

```ini
CHROMEDRIVER_BINARY=/opt/homebrew/bin/chromedriver
```

## Plugin code

The plugin will be automatically symlinked into the test container, reflecting the current state.
You don't need to do anything.

## Start the ChromeDriver

Run the ChromeDriver binary in a separate terminal:

```bash
composer tests:chromedriver
```

You need to have the ChromeDriver server running to perform end-to-end tests.
Start the ChromeDriver server using the `composer tests:chromedriver` command, which will use the port specified in
your `tests/.env` file.

Remember, you can’t run the ChromeDriver server in the `dev-workspace` terminal.

Only one instance of the server is required for all tests, even if you’re testing different plugins.

Keep the server running until you’ve completed all your tests.

## Starting the test environment

To start the test environment, run the following command:

```bash
composer tests:up
```

## Stopping the test environment

To stop the test environment, run the following command:

```bash
composer tests:stop
```

## Removing test environment containers

To remove the test environment containers, run the following command:

```bash
composer tests:down
```

## Cleaning up the test environment

To clean up the test environment, run the following command:

```bash
composer tests:clean
```

## View the test environment information

To view the test environment information, run the following command:

```bash
composer tests:info
```

## To refresh the test environment

To refresh the test environment, run the following command:

```bash
composer tests:refresh
```

## Running the tests

To run all the tests, execute the following command:

```bash
composer tests
```

To run a specific test suite, execute the following command:

```bash
composer tests Integration
```

Available test suites are:

- `Unit`
- `Integration`
- `EndToEnd`

## Running Codecept commands

You can run Codecept commands in the test environment by using the `composer tests:codecept` command. For example:

```bash
composer codecept g:cest EndToEnd MyTest
```

This will stop, remove, delete cache and start the test environment again.

## Running WP-CLI commands in the test environment

You can run WP-CLI commands in the test environment by using the `composer tests:wp` command. For example:

```bash
composer tests:wp db check
```

## Importing the database

This is not required for running the tests, since the test suites are configured to automatically import the database
before running the tests. However you can import the database manually by running the following command:

```bash
composer tests:db-import
```

This will import the database from `tests/Support/Data/dump.sql`.

## Exporting the database

If you need to update the `dump.sql` file, you can export the database by running the following command:

```bash
composer tests:db-export
```

## Activating the plugin

This will probably not be required since the current database dump already has the plugin activated.

If you need to activate the plugin before running the tests, you can do so by running the following command:

```bash
composer tests:activate
```

## Visiting the test site

You can visit the test site by opening the following URL in your browser:

```
http://localhost:60801
```

To confirm the site URL, you can run the following command:

```bash
composer tests:info
```

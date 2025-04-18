#!/usr/bin/env bash

TESTS_BASE_PATH=$(pwd)/tests
WP_CACHE=$(pwd)/dev-workspace/.cache/wordpress
SOURCE_PLUGIN_PATH=$(pwd)

set -a
source ../../.env
set +a

# Sync the plugin files to the test environment
bash ./dev-workspace/scripts/tests-syncplugin.sh $SOURCE_PLUGIN_PATH

# # Copy the dump.sql file to the test environment
cp $WP_CACHE/dump.sql $TESTS_BASE_PATH/Support/Data/dump.sql

# # Run the tests
vendor/bin/codecept run $@

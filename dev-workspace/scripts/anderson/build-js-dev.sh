#!/usr/bin/env bash

# This script is used to build and deploy to Anderson's environment

# Exit on error
set -e

build_js_dev () {
    echo "Building..."
    ./dev-workspace/run composer build:js-dev
}

build_js_dev

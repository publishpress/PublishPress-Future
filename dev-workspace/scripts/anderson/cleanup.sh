#!/usr/bin/env bash

# Exit on error
set -e

cleanup () {
    echo 'Cleaning up...'
    rm -f src/assets/js/settings.js src/assets/js/settings.js.map
}

cleanup

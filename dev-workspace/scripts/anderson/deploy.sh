#!/usr/bin/env bash

# This script is used to build and deploy to Anderson's environment

# Exit on error
set -e

deploy () {
    echo "Deploying..."
    rsync \
        -avv \
        --exclude=/node_modules/ \
        --exclude=/vendor/ \
        --exclude=/tests/ \
        --exclude=dev-workspace \
        --exclude=/dist/ \
        --exclude=.wordpress-org \
        ./* \
        ~/DevKinsta/public/php80dev/wp-content/plugins/publishpress-future-pro/
}

deploy

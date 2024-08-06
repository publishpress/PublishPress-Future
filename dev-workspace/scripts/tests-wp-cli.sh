#!/usr/bin/env bash

# If not in the `dev-workspace` directory, change to it
if [[ ! $(pwd) =~ .*dev-workspace$ ]]; then
  cd dev-workspace
fi

set -a
source ./.env
set +a

docker compose -f docker/compose.yaml ps | grep _tests_wpcli | grep -q "Up" || docker compose -f docker/compose.yaml up -d wp-cli
docker compose -f docker/compose.yaml exec wp-cli wp "$@"

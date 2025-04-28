#!/usr/bin/env bash

if [[ ! $(pwd) =~ .*dev-workspace$ ]]; then
  cd dev-workspace
fi

# Make sure environment variables are loaded
set -a
source ../.env
set +a

docker compose -f docker/compose.yaml build

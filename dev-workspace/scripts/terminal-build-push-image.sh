#!/usr/bin/env bash

TERMINAL_IMAGE_NAME=$1

# This command requires to be logged in on Docker Hub. Check `docker login --help` for more information.
docker buildx build --platform linux/amd64,linux/arm64 --push -t $TERMINAL_IMAGE_NAME ./docker/terminal

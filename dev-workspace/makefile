SHELL := /bin/bash

all: build

help:
	@echo "Available targets:"
	@awk '/^[a-zA-Z0-9_-]+:/ {print "  " $$1}' $(MAKEFILE_LIST)

.PHONY: build buildpush update

build:
	source ../.env && \
	CONTAINER_NAME=$${CONTAINER_NAME} \
	TERMINAL_IMAGE_NAME=$${TERMINAL_IMAGE_NAME} \
	CACHE_PATH=$${CACHE_PATH} \
	sh ./scripts/services-build-images.sh "$$@";

push:
	source ../.env && \
	CONTAINER_NAME=$${CONTAINER_NAME} \
	TERMINAL_IMAGE_NAME=$${TERMINAL_IMAGE_NAME} \
	CACHE_PATH=$${CACHE_PATH} \
	sh ./scripts/terminal-build-push-image.sh $${TERMINAL_IMAGE_NAME} "$$@";

update:
	source ../.env && \
	CONTAINER_NAME=$${CONTAINER_NAME} \
	TERMINAL_IMAGE_NAME=$${TERMINAL_IMAGE_NAME} \
	CACHE_PATH=$${CACHE_PATH} \
	sh ./scripts/services-pull-images.sh "$$@";

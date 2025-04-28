SHELL := /bin/bash

all: build

help:
	@echo "Available targets:"
	@awk '/^[a-zA-Z0-9_-]+:/ {print "  " $$1}' $(MAKEFILE_LIST)

.PHONY: build push update push-terminal push-wp

build:
	bash ./scripts/services-build-images.sh "$$@"

push:
	$(MAKE) push-terminal "$$@"
	$(MAKE) push-wp "$$@"

push-terminal:
	source ../.env && \
	export TERMINAL_IMAGE_NAME="$${TERMINAL_IMAGE_NAME}" && \
	bash ./scripts/build-push-image.sh "$${TERMINAL_IMAGE_NAME}" ./docker/terminal "$$@"

push-wp:
	source ../.env && \
	export WP_IMAGE_NAME="$${WP_IMAGE_NAME}" && \
	bash ./scripts/build-push-image.sh "$${WP_IMAGE_NAME}" ./docker/wp/wordpress "$$@"

update:
	bash ./scripts/services-pull-images.sh "$$@"

SHELL := /bin/bash
TITLE_COLOR := \033[1;33m
SUCCESS_COLOR := \033[1;32m
DEFAULT_COLOR := \033[0m

.PHONY: build buildpush update

all: help

define echo_colored
	@echo -e "\n$(1)$(2)${DEFAULT_COLOR}\n"
endef

define exec_command
	source ./.env && \
	CONTAINER_NAME=$${CONTAINER_NAME} \
	IMAGE_NAME=$${IMAGE_NAME} \
	BIN_PATH=$${BIN_PATH} \
	CACHE_PATH=$${CACHE_PATH} \
	$${BIN_PATH}/exec $(1)
endef

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build      Build the image"
	@echo "  push       Push the image"
	@echo "  update     Update the image"
	@echo ""

build:
	@$(call echo_colored,${TITLE_COLOR},"Building the image...")
	$(call exec_command, build)
	@$(call echo_colored,${SUCCESS_COLOR},"Image built successfully")

push:
	@$(call echo_colored,${TITLE_COLOR},"Pushing the image...")
	@$(call exec_command, build-push)
	@$(call echo_colored,${SUCCESS_COLOR},"Image pushed successfully")

update:
	@$(call echo_colored,${TITLE_COLOR},"Updating the image...")
	@$(call exec_command, update)
	@$(call echo_colored,${SUCCESS_COLOR},"Image updated successfully")

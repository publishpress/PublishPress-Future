#!/bin/bash

# =========================================================
# Plugin Sync Script
# =========================================================
# This script syncs the plugin files to the WordPress test
# environment, excluding unnecessary development files.
# Usage: bash syncplugin.sh [source_directory]
# =========================================================

source tests/.env

PLUGIN_DESTINATION=$WORDPRESS_ROOT_DIR/wp-content/plugins/$PLUGIN_SLUG

mkdir -p $PLUGIN_DESTINATION

echo "Syncing plugin files to $PLUGIN_DESTINATION"

rsync -a \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='tests' \
  --exclude='.env' \
  --exclude='.gitignore' \
  --exclude='.DS_Store' \
  --exclude='.vscode' \
  --exclude='.idea' \
  --exclude='.github' \
  --exclude='.wordpress-org' \
  --exclude='dev-workspace' \
  --exclude='dist' \
  --exclude='docs' \
  --exclude='vendor' \
  --exclude='.cursor' \
  --exclude='.phplint.cache' \
  --exclude='.babelrc' \
  --exclude='.distignore' \
  --exclude='.env.example' \
  --exclude='.gitattributes' \
  --exclude='.php-cs-fixer.cache' \
  --exclude='.phpcs-php-compatibility.xml' \
  --exclude='.phpcs.xml' \
  --exclude='.phplint.yml' \
  --exclude='.rsync-filters-pre-build' \
  --exclude='.rsync-filters-post-build' \
  --exclude='codeception.yml' \
  --exclude='jsconfig.json' \
  --exclude='package.json' \
  --exclude='package-lock.json' \
  --exclude='phpstan.neon' \
  --exclude='psalm.xml' \
  --exclude='webpack.config.js' \
  --exclude='yarn.lock' \
  $1/* $PLUGIN_DESTINATION \
  && echo -e "\033[32mPlugin files synced successfully\033[0m" \
  || echo -e "\033[31mFailed to sync plugin files\033[0m"

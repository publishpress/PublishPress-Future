#!/usr/bin/env bash

# If not in the `dev-workspace` directory, change to it
if [[ ! $(pwd) =~ .*dev-workspace$ ]]; then
  cd dev-workspace
fi

set -a
source ../.env
set +a

COMPOSE_FILE=docker/compose.yaml
CACHE_BASE_PATH=$(pwd)/.cache
WP_TESTS_CACHE=$CACHE_BASE_PATH/wp_tests
WP_DEV_CACHE=$CACHE_BASE_PATH/wp_dev
DB_TESTS_CACHE=$CACHE_BASE_PATH/db_tests
DB_DEV_CACHE=$CACHE_BASE_PATH/db_dev

MAILHOG_CACHE=$CACHE_BASE_PATH/mailhog

WP_TESTS_DB_USER=$(echo $WP_TESTS_DB_URL | sed -E 's/mysql:\/\/([^:]+):.*/\1/')
WP_TESTS_DB_PASS=$(echo $WP_TESTS_DB_URL | sed -E 's/mysql:\/\/.*:(.*)@.*/\1/')
WP_TESTS_DB_HOST=$(echo $WP_TESTS_DB_URL | sed -E 's/mysql:\/\/.*@.*\/(.*)/\1/')
WP_TESTS_DB_NAME=$(echo $WP_TESTS_DB_URL | sed -E 's/mysql:\/\/.*@.*\/(.*)/\1/')
WP_DEV_DB_USER=$(echo $WP_DEV_DB_URL | sed -E 's/mysql:\/\/([^:]+):.*/\1/')
WP_DEV_DB_PASS=$(echo $WP_DEV_DB_URL | sed -E 's/mysql:\/\/.*:(.*)@.*/\1/')
WP_DEV_DB_HOST=$(echo $WP_DEV_DB_URL | sed -E 's/mysql:\/\/.*@.*\/(.*)/\1/')
WP_DEV_DB_NAME=$(echo $WP_DEV_DB_URL | sed -E 's/mysql:\/\/.*@.*\/(.*)/\1/')

if [[ $# -eq 0 ]] || [[ $1 == "-h" ]]; then
  echo "Usage: $0 [up|stop|down|clenaup|refresh|info]"
  exit 1
fi

tests_up() {
  echo "Starting..."
  docker compose -f $COMPOSE_FILE up wp_tests_cli wp_dev_cli
}

tests_stop() {
  echo "Stopping..."
  docker compose -f $COMPOSE_FILE stop wp_tests_cli wp_tests db_tests wp_dev_cli wp_dev db_dev mailhog
}

tests_down() {
  echo "Shutting down..."
  docker compose -f $COMPOSE_FILE down wp_tests_cli wp_tests db_tests wp_dev_cli wp_dev db_dev mailhog
}

tests_cleanup() {
  echo "Cleaning up..."
  docker compose -f $COMPOSE_FILE down -v wp_tests_cli wp_tests db_tests wp_dev_cli wp_dev db_dev mailhog
}

get_wp_port() {
  docker compose -f $COMPOSE_FILE port $1 80 | cut -d: -f2
}

get_db_port() {
  docker compose -f $COMPOSE_FILE port $1 3306 | cut -d: -f2
}

get_mailhog_port_8025() {
  docker compose -f $COMPOSE_FILE port mailhog 8025 | cut -d: -f2
}

get_mailhog_port_1025() {
  docker compose -f $COMPOSE_FILE port mailhog 1025 | cut -d: -f2
}

tests_info() {
  WP_TESTS_PORT=$(get_wp_port wp_tests)
  WP_DEV_PORT=$(get_wp_port wp_dev)
  DB_TESTS_PORT=$(get_db_port db_tests)
  DB_DEV_PORT=$(get_db_port db_dev)
  MAILHOG_PORT_8025=$(get_mailhog_port_8025)
  MAILHOG_PORT_1025=$(get_mailhog_port_1025)

  echo "=============================================="
  echo "🌐 WordPress Development Information"
  echo "=============================================="
  echo "📌 Site URL:       http://$WP_DEV_DOMAIN:$WP_DEV_PORT"
  echo "📌 Admin URL:      http://$WP_DEV_DOMAIN:$WP_DEV_PORT/wp-admin"
  echo "📌 Login:          $WP_DEV_ADMIN_USER / $WP_DEV_ADMIN_PASSWORD"
  echo "📌 Root Directory: $WP_DEV_CACHE"
  echo "📌 Container ID:   $(docker compose -f docker/compose.yaml ps -q wp_dev)"
  echo ""
  echo "📌 DB Url:         mysql://$WP_DEV_DB_USER:$WP_DEV_DB_PASS@$WP_DEV_DB_HOST:$DB_DEV_PORT"
  echo "📌 DB Name:        $WP_DEV_DB_NAME"
  echo "📌 DB Host:        $WP_DEV_DB_HOST:$DB_DEV_PORT"
  echo "📌 DB User:        $WP_DEV_DB_USER"
  echo "📌 DB Pass:        $WP_DEV_DB_PASS"
  echo "📌 Data Directory: $WP_DEV_DB_CACHE"
  echo "📌 Container ID:   $(docker compose -f docker/compose.yaml ps -q db_dev)"
  echo ""
  echo "=============================================="
  echo "🌐 WordPress Tests Information"
  echo "=============================================="
  echo "📌 Site URL:       http://$WP_TESTS_DOMAIN:$WP_TESTS_PORT"
  echo "📌 Admin URL:      http://$WP_TESTS_DOMAIN:$WP_TESTS_PORT/wp-admin"
  echo "📌 Login:          $WP_TESTS_ADMIN_USER / $WP_TESTS_ADMIN_PASSWORD"
  echo "📌 Root Directory: $WP_TESTS_CACHE"
  echo "📌 Container ID:   $(docker compose -f docker/compose.yaml ps -q wp_tests)"
  echo ""
  echo "📌 DB Url:         mysql://$WP_TESTS_DB_USER:$WP_TESTS_DB_PASS@$WP_TESTS_DB_HOST:$DB_TESTS_PORT"
  echo "📌 DB Name:        $WP_TESTS_DB_NAME"
  echo "📌 DB Host:        $WP_TESTS_DB_HOST:$DB_TESTS_PORT"
  echo "📌 DB User:        $WP_TESTS_DB_USER"
  echo "📌 DB Pass:        $WP_TESTS_DB_PASS"
  echo "📌 Data Directory: $WP_TESTS_DB_CACHE"
  echo "📌 Container ID:   $(docker compose -f docker/compose.yaml ps -q db_tests)"
  echo ""
  echo "=============================================="
  echo "📧 Mail Information"
  echo "=============================================="
  echo "📌 Web Interface:  http://$WP_TESTS_DOMAIN:$MAILHOG_PORT_8025"
  echo "📌 SMTP Server:    smtp://$WP_TESTS_DOMAIN:$MAILHOG_PORT_1025"
  echo "📌 Container ID:   $(docker compose -f docker/compose.yaml ps -q mailhog)"
  echo ""
  echo "=============================================="
}

if [[ $1 == "up" ]]; then
  # Create the mailhog cache directory if it doesn't exist
  mkdir -p "$MAILHOG_CACHE/maildir"

  tests_up
fi

if [[ $1 == "stop" ]]; then
  tests_stop
fi

if [[ $1 == "down" ]]; then
  tests_down
fi

if [[ $1 == "cleanup" ]]; then
  tests_down
  rm -rf "$WP_TESTS_CACHE" "$DB_CACHE" "$MAILHOG_CACHE"
fi

if [[ $1 == "refresh" ]]; then
  tests_cleanup
  tests_up
fi

if [[ $1 == "info" ]]; then
  tests_info
fi


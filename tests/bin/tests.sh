#!/usr/bin/env bash

COMMAND=$2
PLUGIN_NAME=$1
PHP_VERSION=$3
FLAT_PHP_VERSION=$(echo $PHP_VERSION | sed 's/\.//g')

start_services() {
    docker-compose -f "./tests/docker/tests-$PHP_VERSION.yml" -p "$PLUGIN_NAME-tests-$FLAT_PHP_VERSION" up -d
}

stop_services() {
    docker-compose -f "./tests/docker/tests-$PHP_VERSION.yml" -p "$PLUGIN_NAME-tests-$FLAT_PHP_VERSION" down
}

get_ip_addresses() {
    WORDPRESS_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $PLUGIN_NAME-tests-${FLAT_PHP_VERSION}_wordpress_1)
    DB_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $PLUGIN_NAME-tests-${FLAT_PHP_VERSION}_db_1)

    echo "IP Addresses:"
    echo ""
    echo "wordrpess: $WORDPRESS_IP port: 80"
    echo "       db: $DB_IP port: 3306"
}

get_mount_paths() {
    MOUNT_PATH=$(docker inspect -f '{{range.Mounts}}{{.Source}}{{end}}' $PLUGIN_NAME-tests-${FLAT_PHP_VERSION}_wordpress_1)
    echo "WordPress path: $MOUNT_PATH"
}

case $COMMAND in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "ip")
        get_ip_addresses
        ;;
    "path")
        get_mount_paths
        ;;
    *) echo "invalid option $COMMAND";;
esac

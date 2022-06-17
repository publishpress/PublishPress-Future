#!/usr/bin/env bash

COMMAND=$2
PLUGIN_NAME=$1
PHP_VERSION=$3
FLAT_PHP_VERSION=$(echo $PHP_VERSION | sed 's/\.//g')
CONTAINER_NAME="$PLUGIN_NAME-tests-$FLAT_PHP_VERSION"
WORDPRESS_CONTAINER_NAME="${CONTAINER_NAME}_wordpress_1"
DB_CONTAINER_NAME="${CONTAINER_NAME}_db_1"
CURRENT_UID=$(id -u):$(id -g)
PROJECT_ROOT_PATH=$(pwd)
ENVS_PATH="$PROJECT_ROOT_PATH/tests/codeception/_envs"
REMOTE_PATH="/var/www/html"

start_services() {
    docker-compose -f "./tests/docker/docker-compose-tests-$PHP_VERSION.yml" -p $CONTAINER_NAME up -d
}

stop_services() {
    docker-compose -f "./tests/docker/docker-compose-tests-$PHP_VERSION.yml" -p $CONTAINER_NAME down
}

get_db_service_ip() {
    docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $DB_CONTAINER_NAME
}

get_wordpress_service_ip() {
    docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $WORDPRESS_CONTAINER_NAME
}

get_ip_addresses() {
    WORDPRESS_IP=$(get_wordpress_service_ip)
    DB_IP=$(get_db_service_ip)

    echo "IP Addresses:"
    echo ""
    echo "wordrpess: $WORDPRESS_IP port: 80"
    echo "       db: $DB_IP port: 3306"
}

get_mount_path() {
    docker inspect -f '{{range.Mounts}}{{.Source}}{{end}}' $WORDPRESS_CONTAINER_NAME
}

# Fix permissions so current user can read and write files in the volume, if it in the group www-data.
fix_volume_permissions() {
    docker exec $WORDPRESS_CONTAINER_NAME find $REMOTE_PATH -type d -exec chmod 777 {} \;
    docker exec $WORDPRESS_CONTAINER_NAME find $REMOTE_PATH -type f -exec chmod 666 {} \;
}

create_env_file() {
    ENV_FILE_NAME="$PHP_VERSION.yml"
    ENV_FILE="$ENVS_PATH/$ENV_FILE_NAME"
    TEMPLATE_FILE="$PROJECT_ROOT_PATH/tests/env.acceptance.template.yml"

    WORDPRESS_IP=$(get_wordpress_service_ip)
    DB_IP=$(get_db_service_ip)
    MOUNT_PATH=$(get_mount_path)

    TEST_SITE_DB_HOST=$DB_IP
    TEST_SITE_DB_PORT="3306"
    TEST_SITE_DB_NAME="wordpress"
    TEST_SITE_DB_USER="wordpress"
    TEST_SITE_DB_PASSWORD="wordpress"
    TEST_SITE_WP_URL="http:\/\/$WORDPRESS_IP"
    TEST_SITE_WP_DOMAIN=$WORDPRESS_IP
    TEST_SITE_NAME="Tests on $PHP_VERSION"
    TEST_SITE_ADMIN_USERNAME="admin"
    TEST_SITE_ADMIN_PASSWORD="admin"

    # Remove current env file if exists
    rm -rf $ENV_FILE || true

    # Copy the template file and replace the variables
    cp $TEMPLATE_FILE $ENV_FILE
    sed -i "s/%TEST_SITE_DB_HOST%/$TEST_SITE_DB_HOST/g" $ENV_FILE
    sed -i "s/%TEST_SITE_DB_PORT%/$TEST_SITE_DB_PORT/g" $ENV_FILE
    sed -i "s/%TEST_SITE_DB_NAME%/$TEST_SITE_DB_NAME/g" $ENV_FILE
    sed -i "s/%TEST_SITE_DB_USER%/$TEST_SITE_DB_USER/g" $ENV_FILE
    sed -i "s/%TEST_SITE_DB_PASSWORD%/$TEST_SITE_DB_PASSWORD/g" $ENV_FILE
    sed -i "s/%TEST_SITE_WP_URL%/$TEST_SITE_WP_URL/g" $ENV_FILE
    sed -i "s/%TEST_SITE_WP_DOMAIN%/$TEST_SITE_WP_DOMAIN/g" $ENV_FILE
    sed -i "s/%TEST_SITE_NAME%/$TEST_SITE_NAME/g" $ENV_FILE
    sed -i "s/%TEST_SITE_ADMIN_USERNAME%/$TEST_SITE_ADMIN_USERNAME/g" $ENV_FILE
    sed -i "s/%TEST_SITE_ADMIN_PASSWORD%/$TEST_SITE_ADMIN_PASSWORD/g" $ENV_FILE

    WP_ROOT_FOLDER=$(echo $MOUNT_PATH | sed "s/\//:::/g")
    sed -i "s/%WP_ROOT_FOLDER%/$WP_ROOT_FOLDER/g" $ENV_FILE
    sed -i "s/:::/\//g" $ENV_FILE
}

clean_volumes() {
    rm -rf $PROJECT_ROOT_PATH/tests/docker/volumes/php*
}

clean_envs() {
    rm -f $ENVS_PATH/php*
}

add_user_group() {
    # Add current user to the www-data group, so it can read and write docker volume files
    sudo usermod -a -G www-data $(whoami)
}

run_bootstrap() {
    MOUNT_PATH=$(get_mount_path)
    tests/bin/bootstrap $MOUNT_PATH
}

get_php_versions() {
    find tests/docker/ -type f -name 'docker-compose-tests-php*\.yml' | sed 's/tests\/docker\/docker-compose-tests-//g' | sed 's/\.yml//g'
}

case $COMMAND in
    "setup")
        add_user_group
        ;;
    "start")
        echo "Starting docker services"
        start_services
        echo "Fixing volume permissions"
        fix_volume_permissions
        echo "Running bootstrap"
        run_bootstrap
        echo "Creating the codeception env file"
        create_env_file
        ;;
    "start-all")

        ;;
    "stop")
        echo "Stopping docker services"
        stop_services
        ;;
    "ip")
        get_ip_addresses
        ;;
    "php-versions")
        get_php_versions
        ;;
    "path")
        MOUNT_PATH=$(get_mount_path)
        echo "WordPress path: $MOUNT_PATH"
        ;;
    "clean")
        echo "Cleaning the volumes"
        clean_volumes
        echo "Cleaning the codeception env files"
        clean_envs
        ;;
    *) echo "invalid option $COMMAND";;
esac

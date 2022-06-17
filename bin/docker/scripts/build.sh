#!/usr/bin/env bash
COMMAND=$1
SOURCE_PATH=$(pwd)
PATH_PHP_SCRIPTS=$SOURCE_PATH/bin/docker/scripts

get_plugin_name() {
    php $PATH_PHP_SCRIPTS/parse-json.php $SOURCE_PATH/composer.json name | awk -F/ '{print $NF}'
}

PLUGIN_NAME=$(get_plugin_name)
TMP_BUILD_DIR=$SOURCE_PATH/dist/$PLUGIN_NAME

clean_dist() {
    rm -rf $TMP_BUILD_DIR
}

build_to_dir() {
    clean_dist
    mkdir -p $TMP_BUILD_DIR
    rsync -r $SOURCE_PATH/ $TMP_BUILD_DIR --filter=':- .buildignore'
    composer install --no-dev --working-dir=$TMP_BUILD_DIR
    rm -rf $TMP_BUILD_DIR/composer.json $TMP_BUILD_DIR/composer.lock
}

get_plugin_version() {

}

echo $(get_plugin_version)
exit 0

case $COMMAND in
    "build-dir")
        build_to_dir
        ;;
    "clean")
        clean_dist
        ;;
    *)
        echo "invalid option $COMMAND"
        ;;
esac

# Get the version number
# Copy the files
# Run composer install --no-dev
# Delete composer.json and composer.lock
# ZIP
# Delete tmp folder

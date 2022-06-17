#!/usr/bin/env bash
COMMAND=$1
SOURCE_PATH=$(pwd)
PATH_PHP_SCRIPTS=$SOURCE_PATH/bin/docker/scripts
DIST_PATH=$SOURCE_PATH/dist

get_plugin_name() {
    php $PATH_PHP_SCRIPTS/parse-json.php $SOURCE_PATH/composer.json name | awk -F/ '{print $NF}'
}

get_plugin_version() {
    cat post-expirator.php | grep "* Version:" | sed 's/ //g' | awk -F: '{print $NF}'
}

PLUGIN_NAME=$(get_plugin_name)
PLUGIN_VERSION=$(get_plugin_version)
TMP_BUILD_DIR=$DIST_PATH/$PLUGIN_NAME

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

pack_built_dir() {
    ZIP_PATH=$DIST_PATH/$PLUGIN_NAME-$PLUGIN_VERSION.zip
    rm -f $ZIP_PATH
    pushd $DIST_PATH
    zip -qr $ZIP_PATH ./$PLUGIN_NAME
    popd
}

case $COMMAND in
    "build-dir")
        build_to_dir
        ;;
    "build")
        build_to_dir
        pack_built_dir
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

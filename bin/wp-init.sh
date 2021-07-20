#!/usr/bin/env bash

##
# Docker Compose helper
#
# Calls docker-compose with common options.
##
dc() {
    docker-compose -f "$(dirname "$0")/../docker-compose.yml" "$@"
}

##
# WP CLI
#
# Executes a WP CLI request in the CLI container.
##
wp() {
    dc exec $args cli wp --allow-root "$@"
}

##
# WordPress Container helper.
#
# Executes the given command in the wordpress container.
##
container() {
    dc exec $args wordpress "$@"
}

wp_host='localhost'
wp_port='80'

if [[ -z "${PE_WP_HOST}" ]]; then
    # if on windows, find out the IP using `docker-machine ip` and provide the IP as the host.
    windows=`echo $OSTYPE | grep -i -e "win" -e "msys" -e "cygw" | wc -l`
    if [[ $windows -gt 0 ]]; then
        wp_host=`docker-machine ip`
    fi
else
    wp_host="${PE_WP_HOST}"
fi

# Get the host port for the WordPress container.
wp_port=$(dc port wordpress 80 | awk -F : '{printf $2}')

npx wait-on --timeout 30000 "http://$wp_host:$wp_port"


if [ -t 0 ]; then
    args=""
else
    args="-T" # Disable pseudo-tty allocation. By default `docker-compose exec` allocates a TTY.
fi

# install WP
wp core install --url="http://$wp_host:$wp_port/" --admin_user="wordpress" --admin_password="wordpress" --admin_email="test1@xx.com" --title="test" --skip-email

container mkdir -p \
	/var/www/html/wp-content/uploads \
	/var/www/html/wp-content/upgrade
container chmod 767 \
	/var/www/html/wp-content \
	/var/www/html/wp-content/plugins \
	/var/www/html/wp-config.php \
	/var/www/html/wp-settings.php \
	/var/www/html/wp-content/uploads \
	/var/www/html/wp-content/upgrade

# update core
wp option delete core_updater.lock
if [[ -z "${PE_WP_VERSION}" ]]; then
    wp core update
else
    wp_version="${PE_WP_VERSION}"
    wp core update --version=$wp_version --force
fi
wp core update-db

# activate
wp theme activate twentytwenty || wp theme install --activate twentytwenty
wp plugin activate post-expirator

# debugging
wp config set WP_DEBUG true --raw
wp config set WP_DEBUG_LOG true --raw
wp config set WP_DEBUG_DISPLAY false --raw

# add some categories
wp term create category apple
wp term create category banana
wp term create category custard

# add a post with ID: 1000 and add to apple
wp post create --post_type=post --post_title="post1" --post_content="random" --post_status=publish --post_category="apple" --import_id=1000
wp post term remove 1000 category 'uncategorized'

# add a post with ID: 1001 and add to banana
wp post create --post_type=post --post_title="post2" --post_content="random" --post_status=publish --post_category="banana" --import_id=1001
wp post term remove 1000 category 'uncategorized'



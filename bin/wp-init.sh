#!/usr/bin/env bash

wp_host='localhost'

if [[ -z "${PE_WP_HOST}" ]]; then
    # if on windows, find out the IP using `docker-machine ip` and provide the IP as the host.
    windows=`echo $OSTYPE | grep -i -e "win" -e "msys" -e "cygw" | wc -l`
    args='';
    if [[ $windows -gt 0 ]]; then
        wp_host=`docker-machine ip`
        args=''
    fi
else
    wp_host="${PE_WP_HOST}"
fi

npx wait-on --timeout 30000 "http://$wp_host"

# permissions
docker exec $args pe_wordpress chown -R www-data:www-data /var/www/html/
docker exec $args pe_wordpress chmod 0777 -R /var/www/html/wp-content

# install WP
docker exec $args pe_wordpress wp --allow-root core install --url="http://$wp_host/" --admin_user="wordpress" --admin_password="wordpress" --admin_email="test1@xx.com" --title="test" --skip-email

# update core
docker exec $args pe_wordpress wp --allow-root option delete core_updater.lock
if [[ -z "${PE_WP_VERSION}" ]]; then
    docker exec $args pe_wordpress wp --allow-root core update
else
    wp_version="${PE_WP_VERSION}"
    docker exec $args pe_wordpress wp --allow-root core update --version=$wp_version --force
fi
docker exec $args pe_wordpress wp --allow-root core update-db

# activate
docker exec $args pe_wordpress wp --allow-root plugin activate post-expirator

# debugging
docker exec $args pe_wordpress wp --allow-root config set WP_DEBUG true --raw
docker exec $args pe_wordpress wp --allow-root config set WP_DEBUG_LOG true --raw
docker exec $args pe_wordpress wp --allow-root config set WP_DEBUG_DISPLAY false --raw

# add some categories
docker exec $args pe_wordpress wp --allow-root term create category apple
docker exec $args pe_wordpress wp --allow-root term create category banana
docker exec $args pe_wordpress wp --allow-root term create category custard

# add a post with ID: 1000 and add to apple
docker exec $args pe_wordpress wp --allow-root post create --post_type=post --post_title="post1" --post_content="random" --post_status=publish --post_category="apple" --import_id=1000
docker exec $args pe_wordpress wp --allow-root post term remove 1000 category 'uncategorized'

# add a post with ID: 1001 and add to banana
docker exec $args pe_wordpress wp --allow-root post create --post_type=post --post_title="post2" --post_content="random" --post_status=publish --post_category="banana" --import_id=1001
docker exec $args pe_wordpress wp --allow-root post term remove 1000 category 'uncategorized'

#docker exec $args pe_wordpress npm install
#docker exec $args pe_wordpress npx codeceptjs run --show false --url http://$wp_host

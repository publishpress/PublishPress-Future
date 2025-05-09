#!/usr/bin/env bash

if [[ ! $(pwd) =~ .*dev-workspace$ ]]; then
  cd dev-workspace
fi

source ../.env

bash ./scripts/services-init-cache.sh


CACHE_NAME_LAST_UPDATE="$CACHE_PATH/.last_image_update_check"
ONE_DAY_IN_SECONDS=86400
UPDATE_CHECK_INTERVAL=$ONE_DAY_IN_SECONDS

is_online() {
    echo -e "GET http://google.com HTTP/1.0\n\n" | nc google.com 80 > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo 1
    else
        echo 0
    fi
}

pull_image() {
    docker compose --env-file ../.env -f docker/compose.yaml pull
}

run_update() {
    if [ "$(is_online)" -eq 1 ]; then
        # Check and update the image if needed, but do not display anything if there is any argument passed.
        if [[ $# -eq 0 ]]; then
            echo "Making sure the image is updated..."
            pull_image
        else
            pull_image > /dev/null 2>&1
        fi

        update_date_on_cache
    else
        if [[ $# -eq 0 ]]; then
            echo "Offline mode detected, ignoring image update."
        fi
    fi
}

update_date_on_cache() {
    date +%s > $CACHE_NAME_LAST_UPDATE
}

save_past_date_to_cache() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS uses BSD date
        date -v -7d +%s > $CACHE_NAME_LAST_UPDATE
    else
        # Ubuntu uses GNU date
        date --date="7 days ago" +%s > $CACHE_NAME_LAST_UPDATE
    fi
}

init_cache_if_not_exists() {
    if [[ ! -f $CACHE_NAME_LAST_UPDATE ]]; then
        save_past_date_to_cache
    fi
}

get_last_update_from_cache() {
    init_cache_if_not_exists

    echo $(cat $CACHE_NAME_LAST_UPDATE)
}

should_update() {
    LAST_UPDATE=$(get_last_update_from_cache)
    TODAY=$(date +%s)

    if [[ $(($TODAY - $LAST_UPDATE)) -gt UPDATE_CHECK_INTERVAL ]]; then
        echo 1
    else
        echo 0
    fi
}

init_cache_if_not_exists

# If no argument is passed, we should update the image.
# if --daily is passed, we should update the image if it was not updated in the last 24 hours.
if [[ $# -eq 0 ]]; then
    run_update
elif [[ "$1" == "--daily" ]]; then
    if [[ $(should_update) -eq 1 ]]; then
        run_update
    fi
fi

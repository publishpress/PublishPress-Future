#!/usr/bin/env bash

bash ./scripts/services-init-cache.sh

CACHE_NAME_LAST_UPDATE="$CACHE_PATH/.last_image_update_check"
ONE_DAY_IN_SECONDS=86400
UPDATE_CHECK_INTERVAL=$ONE_DAY_IN_SECONDS

run_terminal_service() {
    docker compose -f docker/compose.yaml run -e DROPBOX_ACCESS_TOKEN=$DROPBOX_ACCESS_TOKEN --rm terminal "$@"
}

bash ./scripts/services-pull-images.sh --daily

RUNNING_CONTAINER=$(bash ./scripts/terminal-detect-running-container.sh)

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [--new|-n|--help|-h]"
    exit 0
fi

HAS_NO_COMMAND=true
for arg in "$@"; do
    if [ "$arg" = "--new" ] || [ "$arg" = "-n" ]; then
        HAS_NO_COMMAND=false
        break
    fi
done

if [ "$1" = "--new" ] || [ "$1" = "-n" ]; then
    if [ "$HAS_NO_COMMAND" = false ]; then
        echo "Running new container"
    fi
    run_terminal_service "${@:2}"
elif [ -z "$RUNNING_CONTAINER" ]; then
    if [ "$HAS_NO_COMMAND" = false ]; then
        echo "Running new container"
    fi
    run_terminal_service "$@"
else
    if [ "$HAS_NO_COMMAND" = false ]; then
        echo "Running existing container"
    fi
    if [ $# -eq 0 ]; then
        docker exec -it $RUNNING_CONTAINER zsh
    else
        docker exec -it $RUNNING_CONTAINER zsh -c "$@"
    fi
fi

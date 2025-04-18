#!/usr/bin/env bash

set -a
source ../../.env
set +a

for locale in $LANG_LOCALES
do
    for scriptHandler in $LANG_SCRIPT_HANDLERS
    do
        mo_file="./$LANG_DIR/$PLUGIN_SLUG-${locale}-${scriptHandler}.mo"
        if [ -f "$mo_file" ]; then
            rm $mo_file
        fi
    done
done

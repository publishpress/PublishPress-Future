#!/usr/bin/env bash

set -a
source /project/.env
set +a

for locale in $LANG_LOCALES
do
    for scriptHandler in $LANG_SCRIPT_HANDLERS
    do
        po_file="./$LANG_DIR/$PLUGIN_SLUG-${scriptHandler}-${locale}.po"
        if [ -f "$po_file" ]; then
            wp i18n update-po ./$LANG_DIR/$PLUGIN_SLUG-${scriptHandler}.pot $po_file --allow-root
        fi
    done
done

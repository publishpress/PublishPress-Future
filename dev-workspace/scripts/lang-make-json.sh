#!/usr/bin/env bash

set -a
source ../../.env
set +a

for locale in $LANG_LOCALES
do
    for scriptHandler in $LANG_SCRIPT_HANDLERS
    do
        po_file="./$LANG_DIR/$PLUGIN_SLUG-${locale}-${scriptHandler}.po"
        if [ -f "$po_file" ]; then
            npx po2json "$po_file" > "./$LANG_DIR/$PLUGIN_SLUG-${locale}-${scriptHandler}.json"
        fi
    done
done

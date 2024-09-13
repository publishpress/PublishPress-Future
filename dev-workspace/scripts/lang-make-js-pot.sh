#!/usr/bin/env bash

source /project/dev-workspace/scripts/lang-constants.sh

export JSX_SCRIPTS="workflow-editor/future_workflow_editor_script"

for locale in $LANG_LOCALES
do
    for scriptHandler in $JSX_SCRIPTS
    do
        IFS='/' read -ra scriptHandlers <<< "$scriptHandler"
        package="${scriptHandlers[0]}"
        handler="${scriptHandlers[1]}"

        po_file="./$LANG_DIR/$PLUGIN_NAME-${locale}-$handler.po"
        if [ -f "$po_file" ]; then
            wp i18n make-pot ./assets/jsx/$package ./$LANG_DIR/${PLUGIN_NAME}-$handler.pot --domain=$LANG_DOMAIN  --allow-root
            wp i18n update-po ./$LANG_DIR/$PLUGIN_NAME-$handler.pot $po_file --allow-root
        fi
    done
done

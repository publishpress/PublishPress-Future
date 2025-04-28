# Translate JS scripts

* Edit the `.env` file adding the script handle to the `LANG_SCRIPT_HANDLERS` variable.
* Edit the `dev-workspace/scripts/lang-make-pot-js.sh` file adding the script path to the `JSX_SCRIPTS` variable.
* Enqueue the `wp-i18n` script in the `enqueueAdminScripts` method.
* Add the `wp-i18n` as a dependency to the script that needs translation.
* Import the `__` function and use it to translate the strings: `import { __ } from '@wordpress/i18n';
* Run the command `composer build:lang` to generate/update the language files.
* Pay attention on using the correct text domain.

## Language files

* `languages/<text-domain>-<script-handle>_script.pot`
* `languages/<text-domain>-<locale>-<script-handle>.po`
* `languages/<text-domain>-<locale>-<script-handle>.json`
* `languages/<text-domain>-<locale>-<script-handle>.I10n.php`

`.mo` files are generated but deleted since they are not used. For scripts, `json` and `I10n.php` (this one I'm not sure about) files are used instead.


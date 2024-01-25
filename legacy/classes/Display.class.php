<?php

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\Migrations\V30000WPCronToActionsScheduler;
use PublishPress\Future\Modules\Expirator\Migrations\V30001RestorePostMeta;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;
use PublishPress\Future\Modules\Settings\HooksAbstract as SettingsHooksAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooksAbstract;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Modules\Expirator\Models\ActionArgsModel;

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * The class that is responsible for all the displays.
 */
class PostExpirator_Display
{

    /**
     * The singleton instance.
     */
    private static $instance = null;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Interfaces\CronInterface
     */
    private $cron;

    /**
     * Constructor.
     */
    private function __construct()
    {
        $this->hooks();

        $container = Container::getInstance();

        $this->cron = $container->get(ServicesAbstract::CRON);
    }

    /**
     * Initialize the hooks.
     */
    private function hooks()
    {
        add_action('init', [$this, 'init']);
    }

    /**
     * Returns instance of the singleton.
     */
    public static function getInstance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function init()
    {
    }

    /**
     * Loads the specified tab.
     *
     * Make sure the name of the file is menu_{$tab}.php.
     */
    public function load_tab($tab)
    {
        $function = 'menu_' . $tab;

        if (method_exists($this, $function)) {
            $this->$function();
        }

        do_action(SettingsHooksAbstract::ACTION_LOAD_TAB, $tab);
    }

    /**
     * Creates the settings page.
     */
    public function settings_tabs()
    {
        if (!is_admin() || !current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to configure PublishPress Future.', 'post-expirator'));
        }

        $allowed_tabs = ['defaults', 'general', 'display', 'advanced', 'diagnostics', 'viewdebug', ];

        $allowed_tabs = apply_filters(SettingsHooksAbstract::FILTER_ALLOWED_TABS, $allowed_tabs);

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : '';
        if (empty($tab) || ! in_array($tab, $allowed_tabs, true)) {
            $tab = 'defaults';
        }

        ob_start();
        $this->load_tab($tab);
        $html = ob_get_clean();

        $debugIsEnabled = (bool)apply_filters(SettingsHooksAbstract::FILTER_DEBUG_ENABLED, false);
        if (! $debugIsEnabled) {
            unset($allowed_tabs['viewdebug']);
        }

        $this->render_template('tabs', ['tabs' => $allowed_tabs, 'html' => $html, 'tab' => $tab]);

        $this->publishpress_footer();
    }

    private function menu_defaults()
    {
        $params = [
            'showSideBar' => apply_filters(
                SettingsHooksAbstract::FILTER_SHOW_PRO_BANNER,
                ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
            ),
        ];

        $this->render_template('menu-defaults', $params);
    }

    /**
     * Display menu.
     */
    private function menu_display()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if (isset($_POST['expirationdateSaveDisplay']) && sanitize_key($_POST['expirationdateSaveDisplay'])) {
            if (! isset($_POST['_postExpiratorMenuDisplay_nonce']) || ! wp_verify_nonce(
                    sanitize_key($_POST['_postExpiratorMenuDisplay_nonce']),
                    'postexpirator_menu_display'
                )) {
                print 'Form Validation Failure: Sorry, your nonce did not verify.';
                exit;
            } else {
                // phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdateDefaultDateFormat', sanitize_text_field($_POST['expired-default-date-format']));
                update_option('expirationdateDefaultTimeFormat', sanitize_text_field($_POST['expired-default-time-format']));
                update_option('expirationdateDisplayFooter', (int)$_POST['expired-display-footer']);
                update_option('expirationdateFooterContents', wp_kses($_POST['expired-footer-contents'], []));
                update_option('expirationdateFooterStyle', wp_kses($_POST['expired-footer-style'], []));
                // phpcs:enable
            }
        }

        $params = [
            'showSideBar' => apply_filters(
                SettingsHooksAbstract::FILTER_SHOW_PRO_BANNER,
                ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
            ),
        ];

        $this->render_template('menu-display', $params);
    }

    /**
     * Diagnostics menu.
     */
    private function menu_diagnostics()
    {
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (! isset($_POST['_postExpiratorMenuDiagnostics_nonce']) || ! wp_verify_nonce(
                    sanitize_key($_POST['_postExpiratorMenuDiagnostics_nonce']),
                    'postexpirator_menu_diagnostics'
                )) {
                print 'Form Validation Failure: Sorry, your nonce did not verify.';
                exit;
            }
            if (isset($_POST['debugging-disable'])) {
                update_option('expirationdateDebug', 0);
                echo "<div id='message' class='updated fade'><p>";
                esc_html_e('Debugging Disabled', 'post-expirator');
                echo '</p></div>';
            } elseif (isset($_POST['debugging-enable'])) {
                update_option('expirationdateDebug', 1);
                echo "<div id='message' class='updated fade'><p>";
                esc_html_e('Debugging Enabled', 'post-expirator');
                echo '</p></div>';
            } elseif (isset($_POST['purge-debug'])) {
                require_once POSTEXPIRATOR_LEGACYDIR . '/debug.php';

                $debug = new PostExpiratorDebug();
                $debug->purge();
                echo "<div id='message' class='updated fade'><p>";
                esc_html_e('Debugging Table Emptied', 'post-expirator');
                echo '</p></div>';
            } elseif (isset($_POST['migrate-legacy-actions'])) {
                $this->cron->enqueueAsyncAction(V30000WPCronToActionsScheduler::HOOK, [], true);

                echo "<div id='message' class='updated fade'><p>";
                esc_html_e(
                    'The legacy future actions migration has been enqueued and will run asynchronously.',
                    'post-expirator'
                );
                echo '</p></div>';
            } elseif (isset($_POST['restore-post-meta'])) {
                $this->cron->enqueueAsyncAction(V30001RestorePostMeta::HOOK, [], true);

                echo "<div id='message' class='updated fade'><p>";
                esc_html_e(
                    'The legacy actions arguments restoration has been enqueued and will run asynchronously.',
                    'post-expirator'
                );
                echo '</p></div>';
            } elseif (isset($_POST['fix-db-schema'])) {
                ActionArgsSchema::fixSchema();

                echo "<div id='message' class='updated fade'><p>";
                if (ActionArgsSchema::tableExists()) {
                    esc_html_e(
                        'The database schema was fixed.',
                        'post-expirator'
                    );
                } else {
                    esc_html_e(
                        'The database schema could not be fixed. Please, contact the support team.',
                        'post-expirator'
                    );
                }
                echo '</p></div>';
            }
        }

        $params = [
            'showSideBar' => apply_filters(
                SettingsHooksAbstract::FILTER_SHOW_PRO_BANNER,
                ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
            ),
        ];

        $this->render_template('menu-diagnostics', $params);
    }

    /**
     * Debug menu.
     */
    private function menu_viewdebug()
    {
        require_once POSTEXPIRATOR_LEGACYDIR . '/debug.php';

        $params = [
            'showSideBar' => apply_filters(
                SettingsHooksAbstract::FILTER_SHOW_PRO_BANNER,
                ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
            ),
        ];

        $this->render_template('menu-debug-log', $params);
    }

    /**
     * Show the Expiration Date options page
     */
    private function menu_general()
    {
        if (isset($_POST['expirationdateSave']) && ! empty($_POST['expirationdateSave'])) {
            if (
                ! isset($_POST['_postExpiratorMenuGeneral_nonce']) || ! wp_verify_nonce(
                    sanitize_key($_POST['_postExpiratorMenuGeneral_nonce']),
                    'postexpirator_menu_general'
                )
            ) {
                print 'Form Validation Failure: Sorry, your nonce did not verify.';
                exit;
            } else {
                // phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdateEmailNotification', sanitize_text_field($_POST['expired-email-notification']));
                update_option('expirationdateEmailNotificationAdmins', sanitize_text_field($_POST['expired-email-notification-admins']));
                update_option('expirationdateEmailNotificationList', trim(sanitize_text_field($_POST['expired-email-notification-list'])));
                update_option(
                    'expirationdateCategoryDefaults',
                    // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
                    isset($_POST['expirationdate_category']) ? PostExpirator_Util::sanitize_array_of_integers($_POST['expirationdate_category']) : []
                );
                update_option('expirationdateDefaultDate', 'custom');

                $customExpirationDate = sanitize_text_field($_POST['expired-custom-expiration-date']);
                $customExpirationDate = html_entity_decode($customExpirationDate, ENT_QUOTES);
                $customExpirationDate = preg_replace('/["\'`]/', '', $customExpirationDate);

                update_option('expirationdateDefaultDateCustom', trim($customExpirationDate));
                // phpcs:enable

                if (! isset($_POST['allow-user-roles']) || ! is_array($_POST['allow-user-roles'])) {
                    $_POST['allow-user-roles'] = array();
                }

                $user_roles = wp_roles()->get_names();

                foreach ($user_roles as $role_name => $role_label) {
                    $role = get_role($role_name);

                    if (! is_a($role, WP_Role::class)) {
                        continue;
                    }

                    // TODO: only allow roles that can edit posts. Filter in the form as well, adding a description.
                    if ($role_name === 'administrator' || in_array($role_name, $_POST['allow-user-roles'], true)) {
                        $role->add_cap(PostExpirator_Facade::DEFAULT_CAPABILITY_EXPIRE_POST);
                    } else {
                        $role->remove_cap(PostExpirator_Facade::DEFAULT_CAPABILITY_EXPIRE_POST);
                    }
                }

                echo "<div id='message' class='updated fade'><p>";
                _e('Saved Options!', 'post-expirator');
                echo '</p></div>';
            }
        }

        $params = [
            'showSideBar' => apply_filters(
                SettingsHooksAbstract::FILTER_SHOW_PRO_BANNER,
                ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
            ),
        ];

        $this->render_template('menu-general', $params);
    }

    /**
     * Show the Expiration Date options page
     */
    private function menu_advanced()
    {
        if (isset($_POST['expirationdateSave']) && ! empty($_POST['expirationdateSave'])) {
            if (
                ! isset($_POST['_postExpiratorMenuAdvanced_nonce']) || ! wp_verify_nonce(
                    sanitize_key($_POST['_postExpiratorMenuAdvanced_nonce']),
                    'postexpirator_menu_advanced'
                )
            ) {
                print 'Form Validation Failure: Sorry, your nonce did not verify.';
                exit;
            } else {
                // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdatePreserveData', (int)$_POST['expired-preserve-data-deactivating']);
                // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdateColumnStyle', sanitize_key($_POST['future-action-column-style']));
                // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdateTimeFormatForDatePicker', sanitize_key($_POST['future-action-time-format']));

                if (! isset($_POST['allow-user-roles']) || ! is_array($_POST['allow-user-roles'])) {
                    $_POST['allow-user-roles'] = array();
                }

                $user_roles = wp_roles()->get_names();

                foreach ($user_roles as $role_name => $role_label) {
                    $role = get_role($role_name);

                    if (! is_a($role, WP_Role::class)) {
                        continue;
                    }

                    if ($role_name === 'administrator' || in_array($role_name, $_POST['allow-user-roles'], true)) {
                        $role->add_cap(PostExpirator_Facade::DEFAULT_CAPABILITY_EXPIRE_POST);
                    } else {
                        $role->remove_cap(PostExpirator_Facade::DEFAULT_CAPABILITY_EXPIRE_POST);
                    }
                }

                echo "<div id='message' class='updated fade'><p>";
                _e('Saved Options!', 'post-expirator');
                echo '</p></div>';
            }
        }

        $params = [
            'showSideBar' => apply_filters(
                SettingsHooksAbstract::FILTER_SHOW_PRO_BANNER,
                ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
            ),
        ];

        $this->render_template('menu-advanced', $params);
    }

    /**
     * Renders a named template, if it is found.
     */
    public function render_template($name, $params = null)
    {
        /**
         * Allows changing template parameters.
         * @param null|array<string,mixed> $params
         * @param string $name
         * @return null|array<string,mixed>
         */
        $params = apply_filters(
            ExpiratorHooksAbstract::FILTER_LEGACY_TEMPLATE_PARAMS,
            $params,
            $name
        );

        /**
         * Allows changing the template file name.
         * @param string $template
         * @param string $name
         * @param null|array<string,mixed> $params
         * @return null|array<string,mixed>
         */
        $template = apply_filters(
            ExpiratorHooksAbstract::FILTER_LEGACY_TEMPLATE_FILE,
            POSTEXPIRATOR_BASEDIR . "/src/Views/{$name}.php",
            $name,
            $params
        );

        if (file_exists($template)) {
            // expand all parameters so that they can be directly accessed with their name.
            if ($params) {
                foreach ($params as $param => $value) {
                    $$param = $value;
                }
            }
            include $template;
        }
    }

    /**
     * Returns the rendered template
     *
     * @param string $name
     * @param array $param
     * @return string
     */
    public function get_rendered_template($name, $params = null)
    {
        ob_start();

        $this->render_template($name, $params);

        return ob_get_clean();
    }

    /**
     * PublishPress footer
     */
    public function publishpress_footer()
    {
        ?>
        <footer>
            <div class="pp-rating">
                <a href="https://wordpress.org/support/plugin/post-expirator/reviews/#new-post" target="_blank"
                   rel="noopener noreferrer">
                    <?php
                    printf(
                        esc_html__('If you like %s, please leave us a %s rating. Thank you!', 'post-expirator'),
                        '<strong>PublishPress Future</strong>',
                        '<span class="dashicons dashicons-star-filled"></span><span class="dashicons dashicons-star-filled"></span><span class="dashicons dashicons-star-filled"></span><span class="dashicons dashicons-star-filled"></span><span class="dashicons dashicons-star-filled"></span>'
                    );
                    ?>
                </a>
            </div>

            <hr>

            <nav>
                <ul>
                    <li>
                        <a href="https://publishpress.com/future/" target="_blank" rel="noopener noreferrer"
                           title="<?php
                           _e('About PublishPress Future', 'post-expirator'); ?>">
                            <?php
                            _e('About', 'post-expirator'); ?>
                        </a>
                    </li>
                    <li>
                        <a href="https://publishpress.com/knowledge-base/introduction-future/" target="_blank"
                           rel="noopener noreferrer" title="<?php
                        _e('Future Documentation', 'post-expirator'); ?>">
                            <?php
                            _e('Documentation', 'post-expirator'); ?>
                        </a>
                    </li>
                    <li>
                        <a href="https://publishpress.com/contact" target="_blank" rel="noopener noreferrer"
                           title="<?php
                           _e('Contact the PublishPress team', 'post-expirator'); ?>">
                            <?php
                            _e('Contact', 'post-expirator'); ?>
                        </a>
                    </li>
                    <li>
                        <a href="https://twitter.com/publishpresscom" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#777777" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="https://facebook.com/publishpress" target="_blank" rel="noopener noreferrer">
                            <span class="dashicons dashicons-facebook"></span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div class="pp-pressshack-logo">
                <a href="https://publishpress.com" target="_blank" rel="noopener noreferrer">
                    <img src="<?php
                    echo esc_url(plugins_url('../assets/images/publishpress-logo.png', dirname(__FILE__))) ?>"/>
                </a>
            </div>
        </footer>
        <?php
    }
}

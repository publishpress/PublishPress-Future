<?php

use PublishPressFuture\Modules\Settings\HooksAbstract as SettingsHooksAbstract;
use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpiratorHooksAbstract;
use PublishPressFuture\Core\HooksAbstract as CoreHooksAbstract;

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
     * Constructor.
     */
    private function __construct()
    {
        $this->hooks();
    }

    /**
     * Initialize the hooks.
     */
    private function hooks()
    {
        add_action('admin_menu', [$this, 'add_menu']);
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
     * Add plugin page menu.
     */
    public function add_menu()
    {
        add_menu_page(
            __('PublishPress Future Options', 'post-expirator'),
            __('Future', 'post-expirator'),
            'manage_options',
            'publishpress-future',
            array(self::$instance, 'settings_tabs'),
            'dashicons-clock',
            74
        );
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

        PostExpirator_Facade::load_assets('settings');

        $allowed_tabs = array('general', 'defaults', 'display', 'editor', 'diagnostics', 'viewdebug', 'advanced');

        $allowed_tabs = apply_filters(SettingsHooksAbstract::FILTER_ALLOWED_TABS, $allowed_tabs);

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : '';
        if (empty($tab) || ! in_array($tab, $allowed_tabs, true)) {
            $tab = 'general';
        }

        ob_start();
        $this->load_tab($tab);
        $html = ob_get_clean();

        $debugIsEnabled = (bool)apply_filters(SettingsHooksAbstract::FILTER_DEBUG_ENABLED, false);
        if (! $debugIsEnabled) {
            unset($allowed_tabs['viewdebug']);
        }

        $this->render_template('tabs', array('tabs' => $allowed_tabs, 'html' => $html, 'tab' => $tab));

        $this->publishpress_footer();
    }

    /**
     * Editor menu.
     */
    private function menu_editor()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if (isset($_POST['expirationdateSaveEditor']) && sanitize_key($_POST['expirationdateSaveEditor'])) {
            if (! isset($_POST['_postExpiratorMenuEditor_nonce']) || ! wp_verify_nonce(
                    sanitize_key($_POST['_postExpiratorMenuEditor_nonce']),
                    'postexpirator_menu_editor'
                )) {
                print 'Form Validation Failure: Sorry, your nonce did not verify.';
                exit;
            } else {
                // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdateGutenbergSupport', sanitize_text_field($_POST['gutenberg-support']));
            }
        }

        $params = [
            'showSideBar' => apply_filters(
                SettingsHooksAbstract::FILTER_SHOW_PRO_BANNER,
                ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
            ),
        ];

        $this->render_template('menu-editor', $params);
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
                // Filter Content
                $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

                // phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdateDisplayFooter', $_POST['expired-display-footer']);
                update_option('expirationdateFooterContents', $_POST['expired-footer-contents']);
                update_option('expirationdateFooterStyle', $_POST['expired-footer-style']);
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
                _e('Debugging Disabled', 'post-expirator');
                echo '</p></div>';
            } elseif (isset($_POST['debugging-enable'])) {
                update_option('expirationdateDebug', 1);
                echo "<div id='message' class='updated fade'><p>";
                _e('Debugging Enabled', 'post-expirator');
                echo '</p></div>';
            } elseif (isset($_POST['purge-debug'])) {
                require_once POSTEXPIRATOR_LEGACYDIR . '/debug.php';

                $debug = new PostExpiratorDebug();
                $debug->purge();
                echo "<div id='message' class='updated fade'><p>";
                _e('Debugging Table Emptied', 'post-expirator');
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
                // Filter Content
                $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

                // phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdateDefaultDateFormat', sanitize_text_field($_POST['expired-default-date-format']));
                update_option('expirationdateDefaultTimeFormat', sanitize_text_field($_POST['expired-default-time-format']));
                update_option('expirationdateEmailNotification', sanitize_text_field($_POST['expired-email-notification']));
                update_option('expirationdateEmailNotificationAdmins', sanitize_text_field($_POST['expired-email-notification-admins']));
                update_option('expirationdateEmailNotificationList', trim(sanitize_text_field($_POST['expired-email-notification-list'])));
                update_option(
                    'expirationdateCategoryDefaults',
                    // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
                    isset($_POST['expirationdate_category']) ? PostExpirator_Util::sanitize_array_of_integers($_POST['expirationdate_category']) : []
                );
                update_option('expirationdateDefaultDate', 'custom');
                update_option('expirationdateDefaultDateCustom', sanitize_text_field($_POST['expired-custom-expiration-date']));
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
                // Filter Content
                $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

                // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdateGutenbergSupport', sanitize_text_field($_POST['gutenberg-support']));
                // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                update_option('expirationdatePreserveData', (int)$_POST['expired-preserve-data-deactivating']);

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
                            <span class="dashicons dashicons-twitter"></span>
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

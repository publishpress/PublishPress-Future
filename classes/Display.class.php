<?php

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
        add_action('admin_menu', array($this, 'add_menu'));
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

    /**
     * Add plugin page menu.
     */
    public function add_menu()
    {
        add_submenu_page(
            'options-general.php',
            __('Post Expirator Options', 'post-expirator'),
            __('Post Expirator', 'post-expirator'),
            'manage_options',
            POSTEXPIRATOR_BASENAME,
            array(
                self::$instance,
                'settings_tabs'
            )
        );
    }

    /**
     * Creates the settings page.
     */
    public function settings_tabs()
    {
        PostExpirator_Facade::load_assets('settings');

        $tab = isset($_GET['tab']) ? $_GET['tab'] : '';
        if (empty($tab)) {
            $tab = 'general';
        }

        $tab_index = 0;

        ob_start();

        switch ($tab) {
            case 'general':
                $tab_index = 0;
                $this->load_tab('general');
                break;
            case 'defaults':
                $this->load_tab('defaults');
                $tab_index = 1;
                break;
            case 'diagnostics':
                $this->load_tab('diagnostics');
                $tab_index = 2;
                break;
            case 'viewdebug':
                $this->load_tab('viewdebug');
                $tab_index = 3;
                break;
        }

        $html = ob_get_clean();

        $debug = postexpirator_debug(); // check for/load debug

        $tabs = array('general', 'defaults', 'diagnostics');
        if (POSTEXPIRATOR_DEBUG) {
            $tabs[] = 'viewdebug';
        }

        $this->render_template('tabs', array(
            'tabs' => $tabs,
            'tab_index' => $tab_index,
            'html' => $html,
            'tab' => $tab
        ));
    }

    /**
     * Loads the specified tab.
     */
    public function load_tab($tab)
    {
        switch ($tab) {
            case 'general':
                $this->menu_general();
                break;
            case 'defaults':
                $this->menu_defaults();
                break;
            case 'diagnostics':
                $this->menu_diagnostics();
                break;
            case 'viewdebug':
                $this->menu_viewdebug();
                break;
        }
    }

    /**
     * Show the Expiration Date options page
     */
    private function menu_general()
    {
        if (isset($_POST['expirationdateSave']) && $_POST['expirationdateSave']) {
            if (
                ! isset($_POST['_postExpiratorMenuGeneral_nonce']) || ! wp_verify_nonce(
                    $_POST['_postExpiratorMenuGeneral_nonce'],
                    'postexpirator_menu_general'
                )
            ) {
                print 'Form Validation Failure: Sorry, your nonce did not verify.';
                exit;
            } else {
                // Filter Content
                $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

                update_option('expirationdateDefaultDateFormat', $_POST['expired-default-date-format']);
                update_option('expirationdateDefaultTimeFormat', $_POST['expired-default-time-format']);
                update_option('expirationdateDisplayFooter', $_POST['expired-display-footer']);
                update_option('expirationdateEmailNotification', $_POST['expired-email-notification']);
                update_option('expirationdateEmailNotificationAdmins', $_POST['expired-email-notification-admins']);
                update_option('expirationdateEmailNotificationList', trim($_POST['expired-email-notification-list']));
                update_option('expirationdateFooterContents', $_POST['expired-footer-contents']);
                update_option('expirationdateFooterStyle', $_POST['expired-footer-style']);
                update_option('expirationdateGutenbergSupport', $_POST['gutenberg-support']);
                update_option(
                    'expirationdateCategoryDefaults',
                    isset($_POST['expirationdate_category']) ? $_POST['expirationdate_category'] : array()
                );
                update_option('expirationdateDefaultDate', $_POST['expired-default-expiration-date']);
                if ($_POST['expired-custom-expiration-date']) {
                    update_option('expirationdateDefaultDateCustom', $_POST['expired-custom-expiration-date']);
                }

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

        $this->render_template('menu-general');
    }

    /**
     * Renders a named template, if it is found.
     */
    public function render_template($name, $params = null)
    {
        $template = POSTEXPIRATOR_BASEDIR . "/views/{$name}.php";
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
     * The default menu.
     */
    private function menu_defaults()
    {
        $debug = postexpirator_debug();
        $types = postexpirator_get_post_types();
        $defaults = array();

        if (isset($_POST['expirationdateSaveDefaults'])) {
            if (
                ! isset($_POST['_postExpiratorMenuDefaults_nonce']) || ! wp_verify_nonce(
                    $_POST['_postExpiratorMenuDefaults_nonce'],
                    'postexpirator_menu_defaults'
                )
            ) {
                print 'Form Validation Failure: Sorry, your nonce did not verify.';
                exit;
            } else {
                // Filter Content
                $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

                foreach ($types as $type) {
                    if (isset($_POST['expirationdate_expiretype-' . $type])) {
                        $defaults[$type]['expireType'] = $_POST['expirationdate_expiretype-' . $type];
                    }
                    if (isset($_POST['expirationdate_autoenable-' . $type])) {
                        $defaults[$type]['autoEnable'] = intval($_POST['expirationdate_autoenable-' . $type]);
                    }
                    if (isset($_POST['expirationdate_taxonomy-' . $type])) {
                        $defaults[$type]['taxonomy'] = $_POST['expirationdate_taxonomy-' . $type];
                    }
                    if (isset($_POST['expirationdate_activemeta-' . $type])) {
                        $defaults[$type]['activeMetaBox'] = $_POST['expirationdate_activemeta-' . $type];
                    }
                    $defaults[$type]['emailnotification'] = trim($_POST['expirationdate_emailnotification-' . $type]);

                    if (isset($_POST['expired-default-date-' . $type])) {
                        $defaults[$type]['default-expire-type'] = $_POST['expired-default-date-' . $type];
                    }
                    if (isset($_POST['expired-custom-date-' . $type])) {
                        $defaults[$type]['default-custom-date'] = $_POST['expired-custom-date-' . $type];
                    }

                    // Save Settings
                    update_option('expirationdateDefaults' . ucfirst($type), $defaults[$type]);
                }
                echo "<div id='message' class='updated fade'><p>";
                _e('Saved Options!', 'post-expirator');
                echo '</p></div>';
            }
        }

        $this->render_template('menu-defaults', array('types' => $types, 'defaults' => $defaults));
    }

    /**
     * Diagnostics menu.
     */
    private function menu_diagnostics()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (
                ! isset($_POST['_postExpiratorMenuDiagnostics_nonce']) || ! wp_verify_nonce(
                    $_POST['_postExpiratorMenuDiagnostics_nonce'],
                    'postexpirator_menu_diagnostics'
                )
            ) {
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
                require_once(plugin_dir_path(__FILE__) . 'post-expirator-debug.php');
                $debug = new PostExpiratorDebug();
                $debug->purge();
                echo "<div id='message' class='updated fade'><p>";
                _e('Debugging Table Emptied', 'post-expirator');
                echo '</p></div>';
            }
        }

        $debug = postexpirator_debug();

        $this->render_template('menu-diagnostics');
    }

    /**
     * Debug menu.
     */
    private function menu_viewdebug()
    {
        require_once POSTEXPIRATOR_BASEDIR . '/post-expirator-debug.php';
        print '<p>' . __(
                'Below is a dump of the debugging table, this should be useful for troubleshooting.',
                'post-expirator'
            ) . '</p>';
        $debug = new PostExpiratorDebug();
        $debug->getTable();
    }
}

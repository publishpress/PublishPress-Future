<?php

use PublishPress\WordPressReviews\ReviewsController;

/**
 * WordPress reviews functions.
 */
class PostExpirator_RenamingWarning
{
    private $pluginSlug = 'post-expirator';

    private $iconUrl = '';

    private $pluginName = 'PublishPress Future';

    private $nonceAction = 'publishpress-future-dismiss-naming-notice';

    private $metaDismissed = 'publishpress-future-naming-notice-dismiss';

    public function init()
    {
        $this->iconUrl = POSTEXPIRATOR_BASEURL . 'assets/images/publishpress-future-256.png';

        $this->addHooks();
    }

    /**
     * Hook into relevant WP actions.
     */
    private function addHooks()
    {
        if (defined('DOING_AJAX') && DOING_AJAX) {
            add_action("wp_ajax_publishpress-future-naming-notice-dismiss", [$this, 'ajaxHandler']);
        }

        if ($this->showTheNotice()) {
            add_action('admin_notices', [$this, 'renderAdminNotices']);
            add_action('network_admin_notices', [$this, 'renderAdminNotices']);
            add_action('user_admin_notices', [$this, 'renderAdminNotices']);

            add_action('admin_enqueue_scripts', [$this, 'enqueueStyle']);
        }
    }

    /**
     * @return bool
     */
    private function showTheNotice()
    {
        if (!is_admin() || !$this->currentUserIsAdministrator()) {
            return false;
        }

        global $pagenow;

        if ($pagenow === 'admin.php' && isset($_GET['page'])) {
            if ($_GET['page'] === 'publishpress-future') {
                return true;
            }
        }

        return false;
    }

    private function currentUserIsAdministrator()
    {
        $currentUser = get_current_user_id();
        $currentUser = get_user_by('ID', $currentUser);

        if (empty($currentUser) || ! is_object($currentUser) && is_wp_error($currentUser)) {
            return false;
        }

        return in_array('administrator', $currentUser->roles);
    }

    /**
     * Render admin notices if available.
     */
    public function renderAdminNotices()
    {
        if ($this->hideNotices()) {
            return;
        }

        // Used to anonymously distinguish unique site+user combinations in terms of effectiveness of each trigger.
        $uuid = wp_hash(home_url() . '-' . get_current_user_id());
        ?>

        <script type="text/javascript">
            (function ($) {
                function dismiss(reason) {
                    $.ajax({
                        method: "POST",
                        dataType: "json",
                        url: ajaxurl,
                        data: {
                            action: 'publishpress-future-naming-notice-dismiss',
                            nonce: '<?php echo wp_create_nonce($this->nonceAction); ?>',
                            reason: reason
                        }
                    });
                }

                $(document)
                    .on('click', '.<?php echo $this->pluginSlug; ?>-naming-notice .<?php echo "$this->pluginSlug-dismiss"; ?>', function (event) {
                        var $this = $(this),
                            reason = $this.data('reason'),
                            notice = $this.parents('.<?php echo $this->pluginSlug; ?>-naming-notice');

                        notice.fadeTo(100, 0, function () {
                            notice.slideUp(100, function () {
                                notice.remove();
                            });
                        });

                        dismiss(reason);
                    })
                    .ready(function () {
                        setTimeout(function () {
                            $('.<?php echo $this->pluginSlug; ?>-naming-notice button.notice-dismiss').click(function (event) {
                                dismiss('acknowledge');
                            });
                        }, 1000);
                    });
            }(jQuery));
        </script>

        <div class="notice notice-success is-dismissible <?php
        echo "$this->pluginSlug-naming-notice"; ?>">
            <?php
            if (! empty($this->iconUrl)) : ?>
                <img src="<?php
                echo $this->iconUrl; ?>" class="notice-icon" alt="<?php
                echo $this->pluginName; ?> logo"/>
            <?php
            endif; ?>

            <p><?php echo sprintf(
                    __('Thanks for using Post Expirator. This plugin has a new name: "PublishPress Future". Nothing else has changed with the plugin. If you have any questions, please %sclick this link and talk with us%s.', 'post-expirator'),
                    '<a href="mailto:help@publishpress.com">',
                    '</a>'
                ); ?></p>

            <a href="#" class="button <?php echo "$this->pluginSlug-dismiss"; ?>" data-reason="maybe_later">
                <?php _e('Dismiss', $this->pluginSlug); ?>
            </a>
        </div>
        <?php
    }

    /**
     * Checks if notices should be shown.
     *
     * @return bool
     */
    private function hideNotices()
    {
        $dismissMeta = (int)get_user_meta(get_current_user_id(), $this->metaDismissed, true);
        $conditions = [
            $dismissMeta === 1,
        ];

        return in_array(true, $conditions);
    }

    public function enqueueStyle()
    {
        wp_register_style('publishpress-future-naming-notice', false);
        wp_enqueue_style('publishpress-future-naming-notice');
        wp_add_inline_style(
            'publishpress-future-naming-notice',
            "
            .{$this->pluginSlug}-naming-notice {
                min-height: 90px;
            }
            
            .{$this->pluginSlug}-naming-notice .button,
            .{$this->pluginSlug}-naming-notice p {
                font-size: 15px;
            }
            
            .{$this->pluginSlug}-naming-notice .button:not(.notice-dismiss) {
                border-width: 1px;
            }
            
            .{$this->pluginSlug}-naming-notice .button.button-primary {
                background-color: #655897;
                border-color: #3d355c;
                color: #fff;
            }
            
            .{$this->pluginSlug}-naming-notice .notice-icon {
                float: right;
                height: 70px;
                margin-top: 10px;
                margin-left: 10px;
            }
            
            @media (max-width:1700px) {
                .{$this->pluginSlug}-naming-notice {
                    min-height: 110px;
                }
                
                .{$this->pluginSlug}-naming-notice .notice-icon {
                    height: 90px;
                }
            }
            
            @media (max-width:1000px) {
                .{$this->pluginSlug}-naming-notice .notice-icon {
                    height: 70px;
                    min-height: 90px;
                }
            }
            "
        );
    }

    /**
     * The function called by the ajax request.
     */
    public function ajaxHandler()
    {
        $args = wp_parse_args(
            $_REQUEST,
            [
                'reason' => 'acknowledge',
            ]
        );

        if (! wp_verify_nonce($_REQUEST['nonce'], $this->nonceAction)) {
            wp_send_json_error();
        }

        try {
            $userId = get_current_user_id();

            update_user_meta($userId, $this->metaDismissed, 1);

            wp_send_json_success();
        } catch (Exception $e) {
            wp_send_json_error($e);
        }
    }
}

<?php

namespace PublishPress\Future\Framework\WordPress\Facade;

use PublishPress\Future\Core\HookableInterface;

class NoticeFacade {
    private $notices = [];

    private $initialized = false;

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooksFacade)
    {
        $this->hooks = $hooksFacade;
    }

    public function init()
    {
        if ($this->initialized) {
            return;
        }

        $this->hooks->addAction('admin_notices', [$this, 'renderNotices']);

        $this->initialized = true;
    }

    private function registerNotice($name, $message, $type = 'info', $dismiss = true)
    {
        $this->notices[$name] = [
            'message' => $message,
            'type'    => $type,
            'dismiss' => $dismiss,
        ];
    }

    public function registerErrorNotice($name, $message)
    {
        $this->registerNotice($name, $message, 'error');
    }

    public function registerSuccessNotice($name, $message)
    {
        $this->registerNotice($name, $message, 'success');
    }

    public function redirectShowingNotice($name)
    {
        wp_safe_redirect(
            add_query_arg(
                [
                    'notice' => $name,
                ],
                remove_query_arg(
                    ['action', 'action2', 'notice']
                )
            )
        );
        exit;
    }

    public function renderNotices()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (! isset($_GET['notice'])) {
            return;
        }

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (isset($this->notices[$_GET['notice']])) {
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $notice = $this->notices[sanitize_key($_GET['notice'])];

            ?>
            <div class="notice notice-<?php esc_attr_e($notice['type']); ?> <?php echo $notice['dismiss'] ? 'is-dismissible' : ''; ?>">
                <p>
                    <?php esc_html_e($notice['message'], 'post-expirator'); ?>
                </p>
            </div>
            <?php
        }
    }
}

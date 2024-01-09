<?php

namespace PublishPress\FuturePro\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooksAbstract;
use PublishPress\FuturePro\Core\HooksAbstract;
use PublishPress\FuturePro\Models\SettingsModel;

use function current_user_can;
use function wp_die;
use function wp_verify_nonce;

defined('ABSPATH') or die('No direct script access allowed.');

class BlocksController implements ModuleInterface
{
    /**
     * @var \PublishPress\Future\Core\HookableInterface
     */
    private $hooks;

    /**
     * @var string
     */
    private $assetsUrl;

    /**
     * @param \PublishPress\Future\Core\HookableInterface $hooks
     * @param string $assetsUrl
     */
    public function __construct(HookableInterface $hooks, string $assetsUrl)
    {
        $this->hooks = $hooks;
        $this->assetsUrl = $assetsUrl;
    }


    public function initialize()
    {
        $this->hooks->addFilter(
            HooksAbstract::ACTION_ENQUEUE_BLOCK_EDITOR_ASSETS,
            [$this, 'enqueueBlockEditorAssets']
        );

        register_block_type(
            'publishpress-future-pro/future-action-date',
            [
                'render_callback' => [$this, 'renderFutureActionDateBlock'],
                'attributes' => [],
            ]
        );
    }

    public function enqueueBlockEditorAssets()
    {
        wp_enqueue_script(
            'future-pro-blocks',
            $this->assetsUrl . '/js/blocks.js',
            ['wp-blocks', 'wp-element'],
            true
        );
    }

    public function renderFutureActionDateBlock($attr)
    {
        $postId = get_the_ID();

        $output = '<p>' . $attr['template'] . '</p>';

        $output .= '<pre>' . print_r($attr, true) . '</pre>';

        return $output;
    }
}

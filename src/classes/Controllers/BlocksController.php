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
     * @var \Closure
     */
    private $postExpirableModuleFactory;

    /**
     * @param \PublishPress\Future\Core\HookableInterface $hooks
     * @param string $assetsUrl
     * @param \Closure $postExpirableModuleFactory
     */
    public function __construct(HookableInterface $hooks, string $assetsUrl, \Closure $postExpirableModuleFactory)
    {
        $this->hooks = $hooks;
        $this->assetsUrl = $assetsUrl;
        $this->postExpirableModuleFactory = $postExpirableModuleFactory;
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
            $this->assetsUrl . '/js/block-editor.js',
            ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-data'],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION
        );

        wp_enqueue_style(
            'future-pro-blocks',
            $this->assetsUrl . '/css/block-editor.css',
            [],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION
        );
    }

    public function renderFutureActionDateBlock($attr)
    {
        $postId = get_the_ID();

        if (empty($postId)) {
            return '';
        }

        $postModel = $this->postExpirableModuleFactory->call($this, $postId);

        $attr = wp_parse_args($attr, [
            'template' => 'Post expires at #ACTIONTIME on #ACTIONDATE.',
            'dateFormat' => 'F j, Y',
            'timeFormat' => 'g:i a',
            'fullDateFormat' => 'F j, Y g:i a',
            'alignment' => 'left',
            'bgColor' => 'none',
            'textColor' => '#000000',
            'className' => '',
        ]);

        if (! $postModel->isExpirationEnabled()) {
            return '';
        }

        $expirationDate = $postModel->getExpirationDateAsUnixTime();

        // $content = wp_kses($attr['template'], []);
        $content = $attr['template'];

        if (strpos($content, '#ACTIONDATETIME') !== false) {
            $content = str_replace('#ACTIONDATETIME', gmdate($attr['fullDateFormat'], $expirationDate), $content);
        }

        if (strpos($content, '#ACTIONDATE') !== false) {
            $content = str_replace('#ACTIONDATE', gmdate($attr['dateFormat'], $expirationDate), $content);
        }

        if (strpos($content, '#ACTIONTIME') !== false) {
            $content = str_replace('#ACTIONTIME', gmdate($attr['timeFormat'], $expirationDate), $content);
        }

        $style = '';
        if ($attr['alignment'] !== 'left') {
            $style = ' text-align: ' . esc_attr($attr['alignment']) . ';';
        }

        if ($attr['bgColor'] !== 'none') {
            $style .= ' background-color: ' . esc_attr($attr['bgColor']) . ';';
        }

        if ($attr['textColor'] !== '#000000') {
            $style .= ' color: ' . esc_attr($attr['textColor']) . ';';
        }

        $classes = 'future-pro-blocks-future-action-date';
        if (! empty($attr['className'])) {
            $classes .= ' ' . $attr['className'];
        }

        $output = '<p classes="' . esc_attr($classes) . '" style="' . esc_attr($style) . '">' . $content . '</p>';

        $output .= '<pre>' . print_r($attr, true) . '</pre>';

        return $output;
    }
}

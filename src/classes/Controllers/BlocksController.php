<?php

namespace PublishPress\FuturePro\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\FuturePro\Core\HooksAbstract;

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

    private $defaultTemplate;

    private $defaultDateFormat;

    private $defaultTimeFormat;


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

        // Translators: Do not translate the #ACTIONDATE, or #ACTIONTIME placeholders.
        $this->defaultTemplate = __('Post expires at #ACTIONTIME on #ACTIONDATE.', 'publishpress-future-pro');
        $this->defaultDateFormat = get_option('date_format') ?: __('F j, Y', 'publishpress-future-pro');
        $this->defaultTimeFormat = get_option('time_format') ?: __('g:i a', 'publishpress-future-pro');
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
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );

        // Localize the script with new data
        $l10n = [
            'dateFormat' => $this->defaultDateFormat,
            'timeFormat' => $this->defaultTimeFormat,
            'text' => [
                'defaultTemplate' => $this->defaultTemplate,
                'blockTitle' => 'Future Action Date',
                'blockDescription' => __('Displays a message with the date and time of the future action.', 'publishpress-future-pro'),
                'helpPanelText' => __('Type the text template and use # to see the autocomplete options with the available placeholders.', 'publishpress-future-pro'),
                'availablePlaceholders' => __('Available placeholders', 'publishpress-future-pro'),
                'editorPlaceholder' => __('Future action block template. Type the text and # to see the autocomplete options.', 'publishpress-future-pro'),
                'actionTimeLabel' => __('Action time', 'publishpress-future-pro'),
                'actionDateLabel' => __('Action date', 'publishpress-future-pro'),
            ]
        ];
        wp_localize_script('future-pro-blocks', 'publishpressFutureProBlocks', $l10n);

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
            'template' => $this->defaultTemplate,
            'dateFormat' => $this->defaultDateFormat,
            'timeFormat' => $this->defaultTimeFormat,
            'alignment' => 'left',
            'className' => '',
        ]);

        if (! $postModel->isExpirationEnabled()) {
            return '';
        }

        $expirationDate = $postModel->getExpirationDateAsUnixTime();

        $content = wp_kses(
            $attr['template'],
            [
                'br' => [],
                'strong' => ['class' => [], 'style' => []],
                'em' => ['class' => [], 'style' => []],
                'b' => ['class' => [], 'style' => []],
                'i' => ['class' => [], 'style' => []],
                'u' => ['class' => [], 'style' => []],
                'a' => ['href' => [], 'title' => [], 'target' => [], 'rel' => [], 'class' => [], 'style' => []],
                'span' => ['style' => [], 'class' => []],
                'p' => ['style' => [], 'class' => []],
                'div' => ['style' => [], 'class' => []],
            ]
        );

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

        $classes = 'future-pro-blocks-future-action-date';
        if (! empty($attr['className'])) {
            $classes .= ' ' . $attr['className'];
        }

        $output = '<p classes="' . esc_attr($classes) . '" style="' . esc_attr($style) . '">' . $content . '</p>';

        return $output;
    }
}

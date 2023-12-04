<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PostExpirator_Display;
use PostExpirator_Facade;
use PostExpirator_Util;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

defined('ABSPATH') or die('Direct access not allowed.');

class ContentController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade
     */
    private $sanitization;

    /**
     * @var \Closure
     */
    private $currentUserModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\RequestFacade
     */
    private $request;

    /**
     * @param HookableInterface $hooksFacade
     * @param callable $expirablePostModelFactory
     * @param \PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade $sanitization
     * @param \Closure $currentUserModelFactory
     * @param \PublishPress\Future\Framework\WordPress\Facade\RequestFacade $request
     */
    public function __construct(
        HookableInterface $hooksFacade,
        $expirablePostModelFactory,
        $sanitization,
        $currentUserModelFactory,
        $request
    ) {
        $this->hooks = $hooksFacade;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->sanitization = $sanitization;
        $this->currentUserModelFactory = $currentUserModelFactory;
        $this->request = $request;
    }

    public function initialize()
    {
        $this->hooks->addFilter(ExpiratorHooks::FILTER_CONTENT_FOOTER, [$this, 'getFooterText'], 10, 2);
        $this->hooks->addAction(ExpiratorHooks::ACTION_THE_CONTENT, [$this, 'addFooterToContent'], 0);
    }

    /**
     * @param string $content
     *
     * @return string
     */
    public function addFooterToContent($content)
    {
        global $post;

        // Check to see if its enabled
        $displayFooter = (bool) get_option('expirationdateDisplayFooter');

        // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
        if (! $displayFooter || empty($post)) {
            return $content;
        }

        $container = Container::getInstance();
        $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
        $postModel = $factory($post->ID);

        $enabled = $postModel->isExpirationEnabled();

        if (empty($enabled)) {
            return $content;
        }

        $expirationDate = $postModel->getExpirationDateAsUnixTime();
        if (! is_numeric($expirationDate)) {
            return $content;
        }

        $footerText = $this->hooks->applyFilters(ExpiratorHooks::FILTER_CONTENT_FOOTER, '');

        $expirationdateFooterStyle = get_option('expirationdateFooterStyle', POSTEXPIRATOR_FOOTERSTYLE);

        $appendToFooter = '<p style="' . esc_attr($expirationdateFooterStyle) . '">' . esc_html($footerText) . '</p>';

        return $content . $appendToFooter;
    }

    public function getFooterText($content = '', $useDemoText = false)
    {
        if ($useDemoText) {
            $expirationDate = time() + 60 * 60 * 24 * 7;
        } else {
            global $post;

            $container = Container::getInstance();
            $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
            $postModel = $factory($post->ID);

            $expirationDate = $postModel->getExpirationDateAsUnixTime();
        }

        $dateformat = get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);
        $timeformat = get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);
        $expirationdateFooterContents = get_option('expirationdateFooterContents', POSTEXPIRATOR_FOOTERCONTENTS);


        $search = [
            // Deprecated placeholders
            'EXPIRATIONFULL',
            'EXPIRATIONDATE',
            'EXPIRATIONTIME',
            // New placeholders
            'ACTIONFULL',
            'ACTIONDATE',
            'ACTIONTIME',
        ];

        $replace = [
            // Deprecated placeholders
            PostExpirator_Util::get_wp_date("$dateformat $timeformat", $expirationDate),
            PostExpirator_Util::get_wp_date($dateformat, $expirationDate),
            PostExpirator_Util::get_wp_date($timeformat, $expirationDate),
            // New placeholders
            PostExpirator_Util::get_wp_date("$dateformat $timeformat", $expirationDate),
            PostExpirator_Util::get_wp_date($dateformat, $expirationDate),
            PostExpirator_Util::get_wp_date($timeformat, $expirationDate)
        ];

        $content .= str_replace(
            $search,
            $replace,
            $expirationdateFooterContents
        );

        return $content;
    }
}

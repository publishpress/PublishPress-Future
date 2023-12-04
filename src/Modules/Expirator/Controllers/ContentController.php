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
        $this->hooks->addAction('the_content', [$this, 'addFooterToContent'], 0);
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

        $footerText = postexpirator_get_footer_text();

        $expirationdateFooterStyle = get_option('expirationdateFooterStyle', POSTEXPIRATOR_FOOTERSTYLE);

        $appendToFooter = '<p style="' . esc_attr($expirationdateFooterStyle) . '">' . esc_html($footerText) . '</p>';

        return $content . $appendToFooter;
    }
}

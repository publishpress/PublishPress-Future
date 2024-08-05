<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * Utility functions.
 */
// phpcs:ignore PSR1.Classes.ClassDeclaration.MissingNamespace, Squiz.Classes.ValidClassName.NotCamelCaps
class PostExpirator_Cli
{
    public const CLI_COMMAND = 'publishpress-future';

    private static $instance;

    public function __construct()
    {
        try {
            WP_CLI::add_command(
                self::CLI_COMMAND . ' expire-post',
                [$this, 'expirePostCommand'],
                [
                    'shortdesc' => 'Expire a post passing the post id, ignoring the expiration date',
                    'longdesc' => 'Expire a post passing the post id, ignoring the expiration date',
                ]
            );
        } catch (Exception $e) {
            WP_CLI::warning($e);
        }
    }

    public static function getInstance()
    {
        if (empty(self::$instance)) {
            self::$instance = new PostExpirator_Cli();
        }

        return self::$instance;
    }

    /**
     * Expires a post using the post metadata in PublishPress Future, but ignoring the expiration date.
     *
     * <post-id>
     * : One or more post ids separated by space
     *
     *
     * @param $args
     *
     * @return void
     */
    public function expirePostCommand($args)
    {
        foreach ($args as $postId) {
            $postId = (int)$postId;

            if (empty($postId)) {
                continue;
            }

            WP_CLI::log('Expiring the post ' . $postId);

            postexpirator_expire_post($postId);
        }

        WP_CLI::success('Done');
    }
}

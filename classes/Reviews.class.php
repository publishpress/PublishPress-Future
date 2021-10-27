<?php

use PublishPress\WordPressReviews\ReviewsController;

/**
 * WordPress reviews functions.
 */
abstract class PostExpirator_Reviews
{
    /**
     * @var ReviewsController
     */
    private static $reviewController = null;

    public static function init()
    {
        if (is_null(static::$reviewController)) {
            add_filter('post-expirator_wp_reviews_allow_display_notice', [self::class, 'shouldDisplayBanner']);

            self::$reviewController = new ReviewsController(
                'post-expirator',
                'Post Expirator',
                POSTEXPIRATOR_BASEURL . 'assets/img/post-expirator-wp-logo.png'
            );

            self::$reviewController->init();
        }
    }

    public static function shouldDisplayBanner($shouldDisplay)
    {
        global $pagenow;

        if (! is_admin() || ! current_user_can('manage_options')) {
            return false;
        }

        if ($pagenow === 'options-general.php' && isset($_GET['page'])) {
            if ($_GET['page'] === 'post-expirator.php') {
                return true;
            }
        }

        return false;
    }
}
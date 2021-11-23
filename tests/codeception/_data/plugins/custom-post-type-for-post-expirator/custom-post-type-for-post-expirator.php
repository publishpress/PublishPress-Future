<?php
/**
 * Plugin Name: PublishPress Custom Post Type for PublishPress Future
 * Plugin URI:  https://wordpress.org/plugins/post-expirator/
 * Description: PublishPress Test Plugin for creating a custom post type for PublishPress Future
 * Author:      PublishPress
 * Author URI:  https://publishpress.com
 * Version: 0.1.0
 * Text Domain: custom-post-type-post-expirator
 */


add_action(
    'init',
    function () {
        register_post_type(
            'music',
            [
                'label'    => 'Musics',
                'supports' => ['title'],
                'public'   => true,
                'show_ui'  => true,
            ]
        );
    },
    1
);

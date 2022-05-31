<?php
/**
 * Plugin Name: pre-tests
 * Plugin URI:  https://wordpress.org/plugins/post-expirator/
 * Description: Auxiliar plugin for the tests
 * Author:      PublishPress
 * Author URI:  https://publishpress.com
 * Version: 0.1.0
 * Text Domain: pre-tests
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

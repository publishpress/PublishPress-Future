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

namespace PreTests;

add_action('init', 'PreTests\registerPostTypes', 1);
add_action('init', 'PreTests\registerTaxonomies', 1);

function registerPostTypes()
{
    register_post_type(
        'music',
        [
            'labels' => [
                'name' => 'Music',
                'singular_name' => 'Music'
            ],
            'has_archive' => true,
            'public' => true,
            'rewrite' => ['slug' => 'music'],
            'show_in_rest' => true,
            'supports' => ['editor', 'title']
        ]
    );
}

function registerTaxonomies()
{
    register_taxonomy(
        'tax1',
        'post',
        [
            'hierarchical' => true,
            'labels' => [
                'name' => 'Tax1',
                'singular_name' => 'tax1',
                'plural_name' => 'tax1s'
            ]
        ]
    );

    register_taxonomy(
        'tax2',
        'post',
        [
            'hierarchical' => true,
            'labels' => [
                'name' => 'Tax2',
                'singular_name' => 'tax2',
                'plural_name' => 'tax2s'
            ]
        ]
    );
}

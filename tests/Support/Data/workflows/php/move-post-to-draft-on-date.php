<?php

namespace MovePostToDraft1;

/**
 * @signature 9046e4c334b52557e48118e1a2c5d2c1017e03726b98c5b5deb7dbb8b84abcb13751e94691367ed8916eceb5d8997a02dbb2ccdc3216f640d471e4aec77d079d
 * @workflow f3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e
 */

use PublishPress\WorkflowMotorLibrary\Steps\Triggers\PostPublished;
use PublishPress\WorkflowMotorLibrary\GlobalsStore;

defined('PUBLISHPRESS_WORKFLOW_MOTOR_VERSION') or die;

const GLOBAL_STORE_KEY = 'f3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e';



$globals = GlobalsStore::getInstance(GLOBAL_STORE_KEY);

// add_action('transition_post_status', 'MovePostToDraft1\\publish_post', 10, 3);
$publish_post = new PostPublished(
    'post_published',
    [
        'postType' => 'post',
        'taxonomy' => 'category',
        'terms' => ['expirable'],
    ],
    // next
    function () {
        $globals = GlobalsStore::getInstance(GLOBAL_STORE_KEY);
        $post = $globals->get('post');

        if (
            ($post->post_date > '2024-04-01 00:00:00') &&
            (1 == 1)
        ) {
            // Schedule
            $scheduler = new PublishPress\WorkflowMotorLibrary\Scheduler(
                $post->post_date,
                '+2 weeks',
                'change_post_status1',
                [
                    $post->ID
                ]
            );

            $offset = "+2 weeks";


        } else {
            // Ray2
            $ray = new PublishPress\WorkflowMotorLibrary\Ray();
            $ray->send('Conditional is false', 'red');

        }
    }
);


add_action('change_post_status1', 'MovePostToDraft1\\change_post_status1', 10, 1);

function change_post_status1($post_id)
{
    $post = get_post($post_id);

    wp_update_post([
        'ID' => $post_id,
        'post_status' => 'draft'
    ]);

    // Ray1
    $ray = new PublishPress\WorkflowMotorLibrary\Ray();
    $ray->send('Conditional is true', 'green');
}

<?php

namespace PublishPress\FuturePro\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\FuturePro\Core\HooksAbstract;
use PublishPress\FuturePro\Models\SettingsModel;

use function current_user_can;
use function wp_die;
use function wp_verify_nonce;

defined('ABSPATH') or die('No direct script access allowed.');

class MetadataMappingController implements ModuleInterface
{
    /**
     * @var \PublishPress\Future\Core\HookableInterface
     */
    private $hooks;

    /**
     * @var \PublishPress\FuturePro\Models\SettingsModel
     */
    private $settingsModel;

    public function __construct(
        HookableInterface $hooks,
        SettingsModel $settingsModel
    ) {
        $this->hooks = $hooks;
        $this->settingsModel = $settingsModel;
    }


    public function initialize()
    {
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_SAVE_POST,
            [$this, 'savePost'],
            10,
            2
        );
    }

    public function savePost($postId, $post)
    {
        // Check if the post type has metadata mapping enabled.
        $postType = $post->post_type;
        $statuses = $this->settingsModel->getMetadataMappingStatus();

        if (! array_key_exists($postType, $statuses) || $statuses[$postType] !== true) {
            return;
        }

        // Get the metadata mapping for the post type.
        $mapping = $this->settingsModel->getMetadataMapping();
        if (! array_key_exists($postType, $mapping)) {
            return;
        }

        //
    }
}

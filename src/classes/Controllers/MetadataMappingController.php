<?php

namespace PublishPress\FuturePro\Controllers;

use Closure;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\Future\Modules\Expirator\PostMetaAbstract;
use PublishPress\FuturePro\Core\HooksAbstract;
use PublishPress\FuturePro\Models\SettingsModel;

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

    /**
     * @var Closure
     */
    private $postModelFactory;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface
     */
    private $scheduler;

    public function __construct(
        HookableInterface $hooks,
        SettingsModel $settingsModel,
        Closure $postModelFactory,
        SchedulerInterface $scheduler
    ) {
        $this->hooks = $hooks;
        $this->settingsModel = $settingsModel;
        $this->postModelFactory = $postModelFactory;
        $this->scheduler = $scheduler;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_SAVE_POST,
            [$this, 'processMetadataDrivenScheduling'],
            10,
            2
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_PROCESS_METADATA_DRIVEN_SCHEDULING,
            [$this, 'processMetadataDrivenScheduling'],
            10,
            2
        );

        $this->hooks->addFilter(
            ExpiratorHooksAbstract::FILTER_ACTION_META_KEY,
            [$this, 'filterMetaKey'],
            10,
            2
        );
    }

    public function processMetadataDrivenScheduling($postId, $post = null)
    {
        if (empty($post)) {
            $post = get_post($postId);
        }

        if (empty($post) || ! $post instanceof \WP_Post) {
            return;
        }

        // Check if the post type has metadata mapping enabled.
        $postType = $post->post_type;
        $statuses = $this->settingsModel->getMetadataMappingStatus();

        if (! array_key_exists($postType, $statuses) || $statuses[$postType] !== true) {
            return;
        }

        $postModel = ($this->postModelFactory)($postId);

        $terms = $postModel->getMeta(PostMetaAbstract::EXPIRATION_TERMS, true);
        $timestamp = $postModel->getMeta(PostMetaAbstract::EXPIRATION_TIMESTAMP, true);

        if (empty($timestamp)) {
            return;
        }

        $metadataHash = $postModel->getHashForMetadata(
            $timestamp,
            $postModel->getMeta(PostMetaAbstract::EXPIRATION_STATUS, true),
            $postModel->getMeta(PostMetaAbstract::EXPIRATION_TYPE, true),
            $postModel->getMeta(PostMetaAbstract::EXPIRATION_TAXONOMY, true),
            is_array($terms) ? $terms : []
        );

        // Check if the flag is set to avoid infinite loops.
        if ($metadataHash === get_post_meta($postId, ExpirablePostModel::FLAG_METADATA_HASH, true)) {
            return;
        }

        $postModel->syncScheduleWithPostMeta();

        // Set the flag to avoid infinite loops.
        update_post_meta($postId, ExpirablePostModel::FLAG_METADATA_HASH, $metadataHash);
    }

    /**
     * @param string $metaKey
     * @param int $postId
     */
    public function filterMetaKey($metaKey, $postId): string
    {
        if (empty($metaKey)) {
            return $metaKey;
        }

        $mapping = $this->settingsModel->getMetadataMapping();

        if (empty($mapping)) {
            return $metaKey;
        }

        $postType = get_post_type($postId);

        $statusPerPostType = $this->settingsModel->getMetadataMappingStatus();
        if (! array_key_exists($postType, $statusPerPostType) || $statusPerPostType[$postType] !== true) {
            return $metaKey;
        }

        if (empty($postType) || ! array_key_exists($postType, $mapping)) {
            return $metaKey;
        }

        $mappedMetaKey = $mapping[$postType][$metaKey] ?? $metaKey;

        if (empty($mappedMetaKey)) {
            return $metaKey;
        }

        return $mappedMetaKey;
    }
}

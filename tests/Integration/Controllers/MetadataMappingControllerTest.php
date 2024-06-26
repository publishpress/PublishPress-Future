<?php

namespace Controllers;

use lucatume\WPBrowser\TestCase\WPTestCase;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract as DIServicesAbstract;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\Future\Modules\Expirator\PostMetaAbstract;
use PublishPress\FuturePro\Controllers\MetadataMappingController;
use PublishPress\FuturePro\Core\ServicesAbstract;
use PublishPress\FuturePro\Models\SettingsModel;

class MetadataMappingControllerTest extends WPTestCase
{
    private $metadataMap = [
        'post' => [
            PostMetaAbstract::EXPIRATION_TIMESTAMP => 'my_expiration_date',
            PostMetaAbstract::EXPIRATION_TYPE => 'my_expiration_type',
            PostMetaAbstract::EXPIRATION_STATUS => 'my_expiration_status',
            PostMetaAbstract::EXPIRATION_TAXONOMY => 'my_expiration_taxonomy',
            PostMetaAbstract::EXPIRATION_TERMS => 'my_expiration_terms',
        ],
    ];

    private function enableMetaMappingForPost()
    {
        update_option(SettingsModel::OPTION_METADATA_MAPPING_STATUS, json_encode(['post' => true]));
        update_option(SettingsModel::OPTION_METADATA_MAPPING, json_encode($this->metadataMap));
    }

    private function disableMetaMappingForPost()
    {
        update_option(SettingsModel::OPTION_METADATA_MAPPING_STATUS, json_encode(['post' => false]));
        update_option(SettingsModel::OPTION_METADATA_MAPPING, '[]');
    }

    public function testSchedulingIsSkippedWhenFlagExistsAndHashIsValid(): void
    {
        $this->enableMetaMappingForPost();

        $container = Container::getInstance();
        $controller = $container->get(ServicesAbstract::CONTROLLER_METADATA_MAPPING);

        $post = static::factory()->post->create_and_get();

        $controller->initialize();

        $metaValues = [
            PostMetaAbstract::EXPIRATION_STATUS => 'saved',
            PostMetaAbstract::EXPIRATION_TIMESTAMP => '2050-12-31 23:59:59',
            PostMetaAbstract::EXPIRATION_TYPE => 'draft',
            PostMetaAbstract::EXPIRATION_TAXONOMY => 'category',
            PostMetaAbstract::EXPIRATION_TERMS => '',
        ];

        $metadataHash = md5(serialize($metaValues));

        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_STATUS, $metaValues[PostMetaAbstract::EXPIRATION_STATUS]);
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TIMESTAMP, $metaValues[PostMetaAbstract::EXPIRATION_TIMESTAMP]);
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TYPE, $metaValues[PostMetaAbstract::EXPIRATION_TYPE]);
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TAXONOMY, $metaValues[PostMetaAbstract::EXPIRATION_TAXONOMY]);
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TERMS, $metaValues[PostMetaAbstract::EXPIRATION_TERMS]);
        update_post_meta($post->ID, ExpirablePostModel::FLAG_METADATA_HASH, $metadataHash);

        do_action('save_post', $post->ID, $post);

        $scheduler = $container->get(DIServicesAbstract::EXPIRATION_SCHEDULER);
        $actionIsSchedulled = $scheduler->postIsScheduled($post->ID);

        $this->assertFalse($actionIsSchedulled);
    }

    public function testSchedulingIsExecutedWhenFlagDoesNotExist(): void
    {
        $this->enableMetaMappingForPost();

        $container = Container::getInstance();
        $controller = $container->get(ServicesAbstract::CONTROLLER_METADATA_MAPPING);

        $post = static::factory()->post->create_and_get();

        $controller->initialize();

        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TIMESTAMP, '2050-12-31 23:59:59');
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TYPE, 'draft');
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_STATUS, 'saved');

        do_action('save_post', $post->ID, $post);

        $scheduler = $container->get(DIServicesAbstract::EXPIRATION_SCHEDULER);
        $actionIsSchedulled = $scheduler->postIsScheduled($post->ID);

        $this->assertTrue($actionIsSchedulled);
    }

    public function testSchedulingIsExecutedWhenFlagExistsButHashIsInvalid(): void
    {
        $this->enableMetaMappingForPost();

        $container = Container::getInstance();
        $controller = $container->get(ServicesAbstract::CONTROLLER_METADATA_MAPPING);

        $post = static::factory()->post->create_and_get();

        $controller->initialize();

        $metaValues = [
            PostMetaAbstract::EXPIRATION_STATUS => 'saved',
            PostMetaAbstract::EXPIRATION_TIMESTAMP => '2050-12-31 23:59:59',
            PostMetaAbstract::EXPIRATION_TYPE => 'trash',
            PostMetaAbstract::EXPIRATION_TAXONOMY => 'category',
            PostMetaAbstract::EXPIRATION_TERMS => '',
        ];

        $metadataHash = md5(serialize($metaValues));
        update_post_meta($post->ID, ExpirablePostModel::FLAG_METADATA_HASH, $metadataHash);

        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_STATUS, $metaValues[PostMetaAbstract::EXPIRATION_STATUS]);
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TIMESTAMP, $metaValues[PostMetaAbstract::EXPIRATION_TIMESTAMP]);
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TYPE, 'draft');
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TAXONOMY, $metaValues[PostMetaAbstract::EXPIRATION_TAXONOMY]);
        update_post_meta($post->ID, PostMetaAbstract::EXPIRATION_TERMS, $metaValues[PostMetaAbstract::EXPIRATION_TERMS]);

        do_action('save_post', $post->ID, $post);

        $scheduler = $container->get(DIServicesAbstract::EXPIRATION_SCHEDULER);
        $actionIsSchedulled = $scheduler->postIsScheduled($post->ID);

        $this->assertTrue($actionIsSchedulled);
    }
}

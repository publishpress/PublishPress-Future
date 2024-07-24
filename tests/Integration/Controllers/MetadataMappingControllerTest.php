<?php

namespace Controllers;

use lucatume\WPBrowser\TestCase\WPTestCase;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract as DIServicesAbstract;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\Future\Modules\Expirator\PostMetaAbstract;
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
        update_option(SettingsModel::OPTION_METADATA_MAPPING_STATUS, ['post' => true]);
        update_option(SettingsModel::OPTION_METADATA_MAPPING, $this->metadataMap);
    }

    private function disableMetaMappingForPost()
    {
        update_option(SettingsModel::OPTION_METADATA_MAPPING_STATUS, ['post' => false]);
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
            '2050-12-31 23:59:59', // timestamp
            'saved', // status
            'draft', // type
            'draft', // new status
            'category', // taxonomy
            [], // terms
        ];

        $metadataHash = md5(serialize($metaValues));

        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_STATUS], 'saved');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TIMESTAMP], '2050-12-31 23:59:59');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TYPE], 'draft');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TAXONOMY], 'category');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TERMS], '');
        add_post_meta($post->ID, ExpirablePostModel::FLAG_METADATA_HASH, $metadataHash);

        $scheduler = $container->get(DIServicesAbstract::EXPIRATION_SCHEDULER);
        $actionIsSchedulled = $scheduler->postIsScheduled($post->ID);

        $this->assertFalse($actionIsSchedulled, 'Checking if the action is not yet scheduled');

        do_action('save_post', $post->ID, $post);

        $scheduler = $container->get(DIServicesAbstract::EXPIRATION_SCHEDULER);
        $actionIsSchedulled = $scheduler->postIsScheduled($post->ID);

        $this->assertFalse($actionIsSchedulled, 'When flag exists and hash is valid, the action should be skipped');
    }

    public function testSchedulingIsExecutedWhenFlagExistsButHashIsInvalid(): void
    {
        $this->enableMetaMappingForPost();

        $container = Container::getInstance();
        $controller = $container->get(ServicesAbstract::CONTROLLER_METADATA_MAPPING);

        $post = static::factory()->post->create_and_get();

        $controller->initialize();

        $metaValues = [
            $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_STATUS] => 'saved',
            $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TIMESTAMP] => '2050-12-31 23:59:59',
            $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TYPE] => 'draft',
            $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TAXONOMY] => 'category',
            $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TERMS] => '',
            'invalid' => 'value',
        ];

        $metadataHash = md5(serialize($metaValues));

        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_STATUS], 'saved');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TIMESTAMP], '2050-12-31 23:59:59');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TYPE], 'draft');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TAXONOMY], 'category');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TERMS], '');
        add_post_meta($post->ID, ExpirablePostModel::FLAG_METADATA_HASH, $metadataHash);

        global $wpdb;
        $postMeta = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id = %d",
                $post->ID
            )
        );

        do_action('save_post', $post->ID, $post);

        $scheduler = $container->get(DIServicesAbstract::EXPIRATION_SCHEDULER);
        $actionIsSchedulled = $scheduler->postIsScheduled($post->ID);

        $this->assertTrue($actionIsSchedulled, 'When flag exists but hash is invalid, the action should be scheduled');
    }

    public function testSchedulingIsExecutedWhenFlagDoesNotExist(): void
    {
        $this->enableMetaMappingForPost();

        $container = Container::getInstance();
        $controller = $container->get(ServicesAbstract::CONTROLLER_METADATA_MAPPING);

        $post = static::factory()->post->create_and_get();

        $controller->initialize();

        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_STATUS], 'saved');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TIMESTAMP], '2050-12-31 23:59:59');
        add_post_meta($post->ID, $this->metadataMap['post'][PostMetaAbstract::EXPIRATION_TYPE], 'draft');

        do_action('save_post', $post->ID, $post);

        $scheduler = $container->get(DIServicesAbstract::EXPIRATION_SCHEDULER);
        $actionIsSchedulled = $scheduler->postIsScheduled($post->ID);

        $this->assertTrue($actionIsSchedulled, 'When flag does not exist, the action should be scheduled');
    }
}

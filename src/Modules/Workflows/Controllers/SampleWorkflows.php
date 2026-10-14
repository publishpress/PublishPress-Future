<?php

/**
 * Creates default sample workflows on first run.
 *
 * @package     PublishPress\Future
 * @author      PublishPress
 * @copyright   Copyright (c) 2026, PublishPress
 * @license     GPLv2 or later
 */

namespace PublishPress\Future\Modules\Workflows\Controllers;

use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Workflows\Models\WorkflowsModel;
use RuntimeException;

class SampleWorkflows implements InitializableInterface
{
    private const SAMPLE_FLOWS_DIRECTORY = '/assets/workflows/samples';

    public function __construct()
    {
    }

    public function initialize(): void
    {
        $this->checkSampleWorkflowsShouldBeCreated();
    }

    private function checkSampleWorkflowsShouldBeCreated(): void
    {
        $workflowsModel = new WorkflowsModel();

        if ($workflowsModel->hasCreatedSampleWorkflows()) {
            return;
        }

        $samples = array_map(static function (array $sample): array {
            return [
                'title' => $sample['title'],
                'description' => $sample['description'],
                'flow' => json_encode(
                    $sample['flow'],
                    JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
                ),
            ];
        }, $this->getSamples());

        $workflowsModel->createSampleWorkflows($samples);
    }

    /**
     * @return array<int, array{title: string, description: string, flow: array}>
     */
    private function getSamples(): array
    {
        $samples = [];

        foreach ($this->getSampleDefinitions() as $definition) {
            $samples[] = [
                'title' => $definition['title'],
                'description' => $definition['description'],
                'flow' => $this->loadSampleFlow($definition['slug']),
            ];
        }

        return $samples;
    }

    /**
     * @return array<int, array{slug: string, title: string, description: string}>
     */
    private function getSampleDefinitions(): array
    {
        return [
            [
                'slug' => 'notify-post-updated',
                'title' => __('Notify when a post is updated', 'post-expirator'),
                'description' => __('Notify the site admin when a post is updated.', 'post-expirator'),
            ],
            [
                'slug' => 'unpublish-to-draft-after-a-week',
                'title' => __('Unpublish to Draft after a week', 'post-expirator'),
                'description' => __(
                    'Change the post status to Draft a week after it was published.',
                    'post-expirator'
                ),
            ],
            [
                'slug' => 'unpublish-and-change-category-after-15-days',
                'title' => __('Unpublish and change category after 15 days', 'post-expirator'),
                'description' => __('Move the post to draft and add a category after 15 days.', 'post-expirator'),
            ],
            [
                'slug' => 'add-extra-categories-one-month-after-publishing',
                'title' => __('Add extra categories one month after publishing', 'post-expirator'),
                'description' => __(
                    'Sample workflow to add extra categories one month after publishing',
                    'post-expirator'
                ),
            ],
            [
                'slug' => 'change-status-to-draft-one-week-after-publishing',
                'title' => __('Change status to draft one week after publishing', 'post-expirator'),
                'description' => __(
                    'Sample workflow to change status to draft one week after publishing',
                    'post-expirator'
                ),
            ],
            [
                'slug' => 'delete-post-one-week-after-publishing',
                'title' => __('Delete post one week after publishing', 'post-expirator'),
                'description' => __(
                    'Sample workflow to delete post one week after publishing',
                    'post-expirator'
                ),
            ],
            [
                'slug' => 'remove-all-categories-one-week-after-publishing',
                'title' => __('Remove all categories one week after publishing', 'post-expirator'),
                'description' => __(
                    'Sample workflow to remove all categories one week after publishing',
                    'post-expirator'
                ),
            ],
            [
                'slug' => 'remove-selected-categories-one-week-after-publishing',
                'title' => __('Remove selected categories one week after publishing', 'post-expirator'),
                'description' => __(
                    'Sample workflow to remove selected categories one week after publishing',
                    'post-expirator'
                ),
            ],
            [
                'slug' => 'replace-all-categories-one-week-after-publishing',
                'title' => __('Replace all categories one week after publishing', 'post-expirator'),
                'description' => __(
                    'Sample workflow to replace all categories one week after publishing',
                    'post-expirator'
                ),
            ],
            [
                'slug' => 'stick-post-one-week-after-publishing',
                'title' => __('Stick post one week after publishing', 'post-expirator'),
                'description' => __(
                    'Sample workflow to stick post one week after publishing',
                    'post-expirator'
                ),
            ],
            [
                'slug' => 'unstick-post-one-week-after-publishing',
                'title' => __('Unstick post one week after publishing', 'post-expirator'),
                'description' => __(
                    'Sample workflow to unstick post one week after publishing',
                    'post-expirator'
                ),
            ],
        ];
    }

    /**
     * @return array
     */
    private function loadSampleFlow(string $slug): array
    {
        $filePath = $this->getPluginRootPath() . self::SAMPLE_FLOWS_DIRECTORY . '/' . $slug . '.json';

        if (! is_readable($filePath)) {
            throw new RuntimeException(
                sprintf('Sample workflow flow file is missing or not readable: %s', $filePath)
            );
        }

        $contents = file_get_contents($filePath);
        if ($contents === false) {
            throw new RuntimeException(
                sprintf('Sample workflow flow file could not be read: %s', $filePath)
            );
        }

        $decoded = json_decode($contents, true);
        if (! is_array($decoded)) {
            throw new RuntimeException(
                sprintf('Sample workflow flow file contains invalid JSON: %s', $filePath)
            );
        }

        return $decoded;
    }

    private function getPluginRootPath(): string
    {
        return dirname(__DIR__, 4);
    }
}

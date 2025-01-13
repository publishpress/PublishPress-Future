<?php

namespace PublishPress\Future\Modules\Workflows\Controllers;

use Closure;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooksAbstract;
use PublishPress\Future\Modules\Workflows\Models\PostModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowsModel;
use PublishPress\Future\Modules\Workflows\Module;

defined('ABSPATH') or die('No direct script access allowed.');

class PostsList implements ModuleInterface
{
    /**
     * @var \PublishPress\Future\Core\HookableInterface
     */
    private $hooks;

    private $freeFutureActionHasOutput = true;

    public function __construct(
        HookableInterface $hooks
    ) {
        $this->hooks = $hooks;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            ExpiratorHooksAbstract::FILTER_MANAGE_POSTS_COLUMNS,
            [$this, 'addPostColumns'],
            10,
            2
        );

        $this->hooks->addFilter(
            ExpiratorHooksAbstract::FILTER_MANAGE_PAGES_COLUMNS,
            [$this, 'addPageColumns']
        );

        $this->hooks->addAction(
            ExpiratorHooksAbstract::ACTION_MANAGE_POSTS_CUSTOM_COLUMN,
            [$this, 'managePostsCustomColumn']
        );

        $this->hooks->addAction(
            ExpiratorHooksAbstract::ACTION_MANAGE_PAGES_CUSTOM_COLUMN,
            [$this, 'managePostsCustomColumn']
        );
    }

    public function addPostColumns($columns, $postType = 'post')
    {
        if (Module::POST_TYPE_WORKFLOW === $postType) {
            return $columns;
        }

        // Check there are workflows with the manual post trigger
        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsWithManualTrigger($postType);

        if (empty($workflows)) {
            return $columns;
        }

        if (! array_key_exists('expirationdate', $columns)) {
            $columns['expirationdate'] = __('Future Action', 'post-expirator');
        }

        return $columns;
    }

    public function addPageColumns($columns)
    {
        return $this->addPostColumns($columns, 'page');
    }

    private function showEmptyOutputChar()
    {
        if (! $this->freeFutureActionHasOutput) {
            ?>
            <span aria-hidden="true" class="3">—</span>
            <span class="screen-reader-text"><?php echo esc_html__('No future action', 'post-expirator'); ?></span>
            <?php
        }
    }

    public function managePostsCustomColumn($column_name)
    {
        if ($column_name !== 'expirationdate') {
            return;
        }

        $post = get_post();
        $postModel = new PostModel();

        if (! $postModel->load($post->ID)) {
            return;
        }

        $enabledWorkflows = $postModel->getManuallyEnabledWorkflows();
        if (empty($enabledWorkflows)) {
            return;
        }

        $enabledWorkflows = array_map(function ($workflowId) {
            $workflowModel = new WorkflowModel();
            $workflowModel->load($workflowId);

            return $workflowModel;
        }, $enabledWorkflows);

        $cache = $this->hooks->applyFilters(ServicesAbstract::CACHE_POSTS_WITH_FUTURE_ACTION, []);
        $cache[] = $post->ID;

        include __DIR__ . '/../Views/posts-list-column.html.php';
    }
}

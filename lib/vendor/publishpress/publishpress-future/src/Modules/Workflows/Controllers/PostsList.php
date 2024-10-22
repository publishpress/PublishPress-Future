<?php

namespace PublishPress\Future\Modules\Workflows\Controllers;

use Closure;
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

        $this->hooks->addFilter(
            ExpiratorHooksAbstract::FILTER_POSTS_FUTURE_ACTION_COLUMN_OUTPUT,
            [$this, 'futureActionColumnOutput']
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
            echo '—';
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
            $this->showEmptyOutputChar();
            return;
        }


        $enabledWorkflows = array_map(function ($workflowId) {
            $workflowModel = new WorkflowModel();
            $workflowModel->load($workflowId);

            return $workflowModel;
        }, $enabledWorkflows);

        require_once __DIR__ . '/../Views/posts-list-column.html.php';
    }

    public function futureActionColumnOutput($output)
    {
        // Remove the '—' character from the output.
        // We are printing it in the managePostsCustomColumn method.
        if (strpos($output, '>—<') !== false) {
            $this->freeFutureActionHasOutput = false;
            return str_replace('>—<', '><', $output);
        }

        return $output;
    }
}

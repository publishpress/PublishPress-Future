<?php

namespace Tests\Support\GherkinSteps;

use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowsModel;
use PublishPress\FuturePro\Modules\Workflows\Module as WorkflowsModule;

trait Workflows
{
    /**
     * @Given all the workflows are deleted
     */
    public function allTheWorkflowsAreDeleted()
    {
        $this->updateInDatabase('wp_options', ['option_value' => '0'], ['option_name' => WorkflowsModel::OPTION_SAMPLE_WORKFLOWS_CREATED]);
        $this->dontHavePostInDatabase(['post_type' => WorkflowsModule::POST_TYPE_WORKFLOW]);
        $this->dontHavePostInDatabase(['post_type' => 'attachment']);
        $this->dontHavePostInDatabase(['post_type' => 'post']);
        $this->dontHavePostInDatabase(['post_type' => 'page']);
        $this->dontHavePostMetaInDatabase([]);
        $this->deleteDir($this->getUploadsPath() . '/publishpress-future/workflows');
    }
}

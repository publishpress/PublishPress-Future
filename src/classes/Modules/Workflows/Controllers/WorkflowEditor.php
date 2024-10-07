<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract as FreeHooksAbstract;
use PublishPress\FuturePro\Core\Utils;

class WorkflowEditor implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            FreeHooksAbstract::FILTER_IS_PRO,
            [$this, 'onIsPro']
        );

        $this->hooks->addAction(
            FreeHooksAbstract::ACTION_WORKFLOW_EDITOR_SCRIPTS,
            [$this, 'onWorkflowEditorPluginsEnqueueScripts']
        );
    }

    public function onIsPro($isPro)
    {
        return true;
    }

    public function onWorkflowEditorPluginsEnqueueScripts()
    {
        wp_enqueue_script(
            'publishpress-future-workflow-editor-plugins',
            Utils::getScriptUrl('workflow-editor-plugins'),
            ['wp-plugins'],
            PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,
            true
        );
    }
}

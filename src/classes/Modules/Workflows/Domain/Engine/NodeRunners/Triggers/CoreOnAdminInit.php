<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnAdminInit as NodeTypeCoreOnAdminInit;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnAdminInit implements NodeTriggerRunnerInterface
{
    const NODE_NAME = NodeTypeCoreOnAdminInit::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $step;

    /**
     * @var array
     */
    private $contextVariables;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
    }

    public function setup(int $workflowId, array $step, array $contextVariables = []): void
    {
        $this->step = $step;
        $this->contextVariables = $contextVariables;

        $this->hooks->addAction(HooksAbstract::ACTION_ADMIN_INIT, [$this, 'triggerCallback'], 10);
    }

    public function triggerCallback()
    {
        $this->nodeRunnerPreparer->runNextSteps($this->step, $this->contextVariables);
    }
}

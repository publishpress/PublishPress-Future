<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CoreSendEmail as NodeTypeCoreSendEmail;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;

use function PublishPress\Future\logError;

class CoreSendEmail implements NodeRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(
        HookableInterface $hooks
    ) {
        $this->hooks = $hooks;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCoreSendEmail::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->hooks->doAction(
            HooksAbstract::ACTION_WORKFLOW_ACTION_CORE_SEND_EMAIL_SETUP,
            $step,
            $contextVariables
        );
    }
}

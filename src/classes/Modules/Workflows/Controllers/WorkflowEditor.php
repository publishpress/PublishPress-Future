<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract as FreeHooksAbstract;

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
    }

    public function onIsPro($isPro)
    {
        return true;
    }
}

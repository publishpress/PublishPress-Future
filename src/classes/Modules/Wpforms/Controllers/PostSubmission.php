<?php

namespace PublishPress\FuturePro\Modules\Wpforms\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Wpforms\HooksAbstract;

class PostSubmission implements InitializableInterface
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
        $this->hooks->addAction(
            HooksAbstract::ACTION_WPFORMS_POST_SUBM_PROCESS,
            [$this, 'onWpformsProcessComplete']
        );
    }

    public function onWpformsProcessComplete($postId)
    {
        $this->hooks->doAction(CoreHooksAbstract::ACTION_PROCESS_METADATA, $postId);
    }
}

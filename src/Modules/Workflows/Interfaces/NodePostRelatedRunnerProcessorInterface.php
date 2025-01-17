<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface NodePostRelatedRunnerProcessorInterface extends NodeRunnerProcessorInterface
{
    public function setPostIdOnTriggerGlobalVariable(int $postId): void;
}

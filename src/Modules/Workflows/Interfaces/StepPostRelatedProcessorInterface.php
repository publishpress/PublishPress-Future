<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface StepPostRelatedProcessorInterface extends StepProcessorInterface
{
    public function setPostIdOnTriggerGlobalVariable(int $postId): void;
}

<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface AsyncNodeRunnerProcessorInterface extends NodeRunnerProcessorInterface
{
    public function actionCallback(array $compactedArgs);
}

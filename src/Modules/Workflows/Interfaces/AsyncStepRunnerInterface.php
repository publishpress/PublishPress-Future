<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

/**
 * @since 4.3.1
 */
interface AsyncStepRunnerInterface
{
    public function actionCallback(array $expandedArgs, array $originalArgs);
}

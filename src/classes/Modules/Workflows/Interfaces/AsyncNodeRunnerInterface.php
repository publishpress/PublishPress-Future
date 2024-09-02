<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface AsyncNodeRunnerInterface
{
    public function actionCallback(array $expandedArgs, array $originalArgs);
}

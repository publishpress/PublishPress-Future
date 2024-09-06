<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface AsyncNodeRunnerInterface
{
    public function actionCallback(array $expandedArgs, array $originalArgs);
}

<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface JsonLogicEngineInterface
{
    public function apply($expression, $data);

    public function addOperation($name, $callback);

    public function isLogic($expression);
}

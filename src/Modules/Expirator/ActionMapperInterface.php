<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;


interface ActionMapperInterface
{
    /**
     * @param string $actionName
     *
     * @return ActionableInterface
     */
    public function map($actionName);
}

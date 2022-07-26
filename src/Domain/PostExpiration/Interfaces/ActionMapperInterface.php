<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Domain\PostExpiration\Interfaces;


interface ActionMapperInterface
{
    /**
     * @param string $actionName
     *
     * @return ActionableInterface
     */
    public function map($actionName);
}

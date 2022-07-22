<?php

namespace PublishPressFuture\Module\Expiration;


interface ActionMapperInterface
{
    /**
     * @param string $actionName
     *
     * @return ActionableInterface
     */
    public function map($actionName);
}

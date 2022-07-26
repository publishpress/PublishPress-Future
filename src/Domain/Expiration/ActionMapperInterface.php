<?php

namespace PublishPressFuture\Domain\Expiration;


interface ActionMapperInterface
{
    /**
     * @param string $actionName
     *
     * @return ActionableInterface
     */
    public function map($actionName);
}

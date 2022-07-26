<?php

namespace PublishPressFuture\Domain\Expiration;


interface ActionableInterface
{
    /**
     * @return void
     */
    public function setAction($action);
}

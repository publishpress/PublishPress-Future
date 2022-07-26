<?php

namespace PublishPressFuture\Domain\PostExpiration\Interfaces;


interface ActionableInterface
{
    /**
     * @return void
     */
    public function setAction($action);
}

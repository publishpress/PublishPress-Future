<?php

namespace PublishPressFuture\Module\Expiration;


interface ActionableInterface
{
    /**
     * @return void
     */
    public function setAction($action);
}

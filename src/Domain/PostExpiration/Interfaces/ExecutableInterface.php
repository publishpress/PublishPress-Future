<?php

namespace PublishPressFuture\Domain\PostExpiration\Interfaces;


interface ExecutableInterface
{
    /**
     * @return void
     */
    public function execute();
}

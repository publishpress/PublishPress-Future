<?php

namespace PublishPressFuture\Domain\Expiration;


interface ExecutableInterface
{
    /**
     * @return void
     */
    public function execute();
}

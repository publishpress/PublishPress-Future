<?php

namespace PublishPress\Future\Modules\Expirator\Interfaces;

defined('ABSPATH') or die('Direct access not allowed.');

interface ActionableInterface
{
    /**
     * @return void
     */
    public function setAction($action);
}

<?php

/**
 * Copyright (c) 2024, Ramble Ventures
 */

namespace PublishPress\Future\Framework;

defined('ABSPATH') or die('Direct access not allowed.');

interface ModuleInterface
{
    /**
     * @return void
     */
    public function initialize();
}

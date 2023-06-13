<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Interfaces;

defined('ABSPATH') or die('Direct access not allowed.');

interface MigrationInterface
{
    public function migrate();
}

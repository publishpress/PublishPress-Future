
<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Interfaces;

defined('ABSPATH') or die('Direct access not allowed.');

interface TableSchemaInterface
{
    public static function getTableName(): string;

    public static function isTableHealthy(): bool;

    public static function isTableExistent(): bool;

    public static function fixTable(): void;

    public static function createTable(): void;

    public static function getErrors(): array;
}

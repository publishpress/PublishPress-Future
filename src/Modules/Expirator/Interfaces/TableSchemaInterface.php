
<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Interfaces;

defined('ABSPATH') or die('Direct access not allowed.');

interface TableSchemaInterface
{
    public static function getTableName(): string;

    public static function isTableSchemaHealthy(): bool;

    public static function isTableExistent(): bool;

    public static function fixTableSchema(): void;

    public static function createTable(): void;

    public static function getSchemaHealthErrors(): array;
}

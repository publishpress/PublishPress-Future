<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Framework\Database\Interfaces;

defined('ABSPATH') or die('Direct access not allowed.');

interface DBTableSchemaInterface
{
    public function getTableName(): string;

    public function createTable(): bool;

    public function dropTable(): bool;

    public function isTableHealthy(): bool;

    public function isTableExistent(): bool;

    public function fixTable(): void;

    public function getErrors(): array;
}

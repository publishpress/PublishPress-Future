<?php

namespace PublishPress\Future\Framework\Cache;

defined('ABSPATH') or die('Direct access not allowed.');

interface GenericCacheHandlerInterface
{
    public function addValue(string $value): void;

    public function hasValue(string $value): bool;
}

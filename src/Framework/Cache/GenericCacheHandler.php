<?php

namespace PublishPress\Future\Framework\Cache;

defined('ABSPATH') or die('Direct access not allowed.');

class GenericCacheHandler implements GenericCacheHandlerInterface
{
    private array $cache = [];

    public function addValue(string $value): void
    {
        $this->cache[] = $value;
    }

    public function hasValue(string $value): bool
    {
        return in_array($value, $this->cache);
    }
}

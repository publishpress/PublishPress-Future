<?php

/**
 * This constant is specially used by the Pro plugin to detect the free plugin
 * on non standard folders when loaded by composer.
 * This file should be automatically loaded by composer.
 */
if (! defined('PUBLISHPRESS_FUTURE_BASE_PATH')) {
        define('PUBLISHPRESS_FUTURE_BASE_PATH', __DIR__);
}

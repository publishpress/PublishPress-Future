<?php

namespace PublishPress\WorkflowMotorLibrary;

class Autoloader
{
    public static function register()
    {
        spl_autoload_register(function ($class) {
            $prefix = 'PublishPress\\WorkflowMotorLibrary\\';
            $baseDir = __DIR__ . '/';

            $len = strlen($prefix);
            if (strncmp($prefix, $class, $len) !== 0) {
                return;
            }

            $relativeClass = substr($class, $len);
            $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

            if (file_exists($file)) {
                require $file;
            }
        });
    }
}

<?php

class Autoloader
{
    public function autoload($class)
    {
        $prefix = 'PublishPress\\FuturePro\\';
        $base_dir = __DIR__ . '/../../src/classes/';

        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            return;
        }

        $relative_class = substr($class, $len);
        $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

        if (file_exists($file)) {
            require $file;
        }
    }

}

spl_autoload_register([new Autoloader(), 'autoload']);

function __(string $text, string $textDomain )
{
    return $text;
}

function esc_html(string $text)
{
    return $text;
}

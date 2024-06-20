<?php

$finder = (new PhpCsFixer\Finder())
    ->in(__DIR__)
    ->exclude([
        '.vscode',
        'tests/_output',
        'tests/Support',
        'assets_wp',
        'bin',
        'vendor',
        'lib/vendor',
        'dist',
        'languages',
        'node_modules',
        'dev-workspace',
        'tmp',
    ])
;

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        '@PHP71Migration' => true,
    ])
    ->setFinder($finder)
;

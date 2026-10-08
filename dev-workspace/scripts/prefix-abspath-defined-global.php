<?php

/**
 * Prefix ABSPATH guard defined() with global namespace in namespaced PHP files.
 *
 * Replaces: defined('ABSPATH') || exit  ->  \defined('ABSPATH') || exit
 * (single or double quotes; preserves leading whitespace; idempotent.)
 *
 * @package     PublishPress\Future
 * @copyright   Copyright (c) 2026, PublishPress
 * @license     GPLv2 or later
 */

declare(strict_types=1);

$root = dirname(__DIR__, 2);

/**
 * @return list<string>
 */
function collectTargetFiles(string $root): array
{
    $files = [];

    $extra = [
        $root . '/post-expirator.php',
        $root . '/services.php',
    ];

    foreach (['src', 'tests'] as $dir) {
        $path = $root . '/' . $dir;
        if (! is_dir($path)) {
            continue;
        }

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $fileInfo) {
            if ($fileInfo->isFile() && $fileInfo->getExtension() === 'php') {
                $files[] = $fileInfo->getPathname();
            }
        }
    }

    foreach ($extra as $file) {
        if (is_file($file)) {
            $files[] = $file;
        }
    }

    $files = array_values(array_unique($files));
    sort($files);

    return $files;
}

function fileHasNamespace(string $contents): bool
{
    return (bool) preg_match('/^\s*namespace\s+[\w\\\\]+/m', $contents);
}

/**
 * @return array{0: string, 1: int} Updated contents and replacement count.
 */
function updateAbspathGuard(string $contents): array
{
    $count = 0;

    $updated = preg_replace_callback(
        '/^(\s*)(?<!\\\\)defined\((["\'])ABSPATH\2\)\s*\|\|\s*exit/m',
        static function (array $matches) use (&$count): string {
            ++$count;

            return $matches[1] . '\\defined(' . $matches[2] . 'ABSPATH' . $matches[2] . ') || exit';
        },
        $contents,
        -1,
        $replaceCount
    );

    if ($updated === null) {
        return [$contents, 0];
    }

    return [$updated, $count];
}

$dryRun = in_array('--dry-run', $argv, true);
$verifyOnly = in_array('--verify', $argv, true);

$changedFiles = [];
$totalReplacements = 0;
$violations = [];

foreach (collectTargetFiles($root) as $file) {
    $contents = file_get_contents($file);
    if ($contents === false) {
        fwrite(STDERR, "Could not read: {$file}\n");
        exit(1);
    }

    if (! fileHasNamespace($contents)) {
        continue;
    }

    if (preg_match('/^\s*(?<!\\\\)defined\((["\'])ABSPATH\1\)\s*\|\|\s*exit/m', $contents)) {
        $violations[] = $file;
    }

    if ($verifyOnly) {
        continue;
    }

    [$newContents, $replacements] = updateAbspathGuard($contents);

    if ($replacements === 0) {
        continue;
    }

    $totalReplacements += $replacements;

    if ($dryRun) {
        $changedFiles[] = $file;
        echo "[dry-run] {$file} ({$replacements} replacement(s))\n";
        continue;
    }

    if (file_put_contents($file, $newContents) === false) {
        fwrite(STDERR, "Could not write: {$file}\n");
        exit(1);
    }

    $changedFiles[] = $file;
}

if ($verifyOnly || ! $dryRun) {
    $remaining = count($violations);
    if ($verifyOnly) {
        // Re-scan after verify-only mode (no writes).
        $violations = [];
        foreach (collectTargetFiles($root) as $file) {
            $contents = file_get_contents($file);
            if ($contents === false || ! fileHasNamespace($contents)) {
                continue;
            }
            if (preg_match('/^\s*(?<!\\\\)defined\((["\'])ABSPATH\1\)\s*\|\|\s*exit/m', $contents)) {
                $violations[] = $file;
            }
        }
        $remaining = count($violations);
    } else {
        $remaining = 0;
        foreach (collectTargetFiles($root) as $file) {
            $contents = file_get_contents($file);
            if ($contents === false || ! fileHasNamespace($contents)) {
                continue;
            }
            if (preg_match('/^\s*(?<!\\\\)defined\((["\'])ABSPATH\1\)\s*\|\|\s*exit/m', $contents)) {
                $violations[] = $file;
                ++$remaining;
            }
        }
    }

    echo "Namespaced files with unprefixed guard: {$remaining}\n";
    if ($remaining > 0) {
        foreach ($violations as $file) {
            echo "  - {$file}\n";
        }
        exit(1);
    }
}

if (! $verifyOnly) {
    echo 'Files changed: ' . count($changedFiles) . "\n";
    echo 'Total replacements: ' . $totalReplacements . "\n";
}

exit(0);

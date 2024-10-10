<?php

/**
 * @author PublishPress
 * @copyright Copyright (c) 2024, Ramble Ventures
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuture
 */

namespace PublishPress\Future {

    use Exception;

    defined('ABSPATH') or die('No direct script access allowed.');

    if (! function_exists(__NAMESPACE__ . '\\logError')) {

        function logError(string $message, Exception $e = null, bool $addTrace = false): void
        {
            if (! function_exists('error_log')) {
                return;
            }

            if (! defined('WP_DEBUG') || ! WP_DEBUG) {
                return;
            }


            $message = sprintf("PUBLISHPRESS FUTURE PRO - %s", $message);

            if (! is_null($e) && is_a($e, Exception::class)) {
                $message .= ' ' . sprintf(
                    "[%s: %s]",
                    get_class($e),
                    $e->getMessage()
                );
            }

            if ($addTrace) {
                // Add the backtrace to the log
                $traceItems = array_map(function ($item) {
                    return $item['file'] . ':' . $item['line'] . ' ' . $item['function'] . '()';
                }, $e->getTrace());

                $message .= ' Trace: ' . implode(' > ', $traceItems);
            }


            // Make the log message binary safe removing any non-printable chars.
            $message = addcslashes($message, "\000..\037\177..\377\\");

            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log($message);
        }
    }
}

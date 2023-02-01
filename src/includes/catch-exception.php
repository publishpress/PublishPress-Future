<?php
/**
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPressFuturePro {

    function logCatchedException(\Throwable $e)
    {
        if (! function_exists('error_log')) {
            return;
        }

        $traceItems = array_map(function ($item) {
            return $item['file'] . ':' . $item['line'] . ' ' . $item['function'] . '(), ';
        }, $e->getTrace());

        $message = sprintf(
            "PUBLISHPRESS FUTURE PRO Exception: %s: %s. Backtrace: %s",
            get_class($e),
            $e->getMessage(),
            implode("\n", $traceItems)
        );

        // Make the log message binary safe removing any non-printable chars.
        $message = addcslashes($message, "\000..\037\177..\377\\");

        // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
        error_log($message);
    }
}

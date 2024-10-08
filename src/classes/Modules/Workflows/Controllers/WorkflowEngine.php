<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract as FreeHooksAbstract;

class WorkflowEngine implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            FreeHooksAbstract::FILTER_INTERVAL_IN_SECONDS,
            [$this, 'filterIntervalInSeconds'],
            10,
            2
        );
    }

    public function filterIntervalInSeconds(int $interval, array $nodeSettings)
    {
        $unit = sanitize_key($nodeSettings['schedule']['repeatIntervalUnit'] ?? 'seconds');

        if (empty($unit)) {
            $unit = 'seconds';
        }

        // Convert interval to seconds
        if ($interval > 0) {
            switch ($unit) {
                case 'seconds':
                    $interval *= 1;
                    break;
                case 'minutes':
                    $interval *= MINUTE_IN_SECONDS;
                    break;
                case 'hours':
                    $interval *= HOUR_IN_SECONDS;
                    break;
                case 'days':
                    $interval *= DAY_IN_SECONDS;
                    break;
                case 'weeks':
                    $interval *= WEEK_IN_SECONDS;
                    break;
                case 'months':
                    $interval *= MONTH_IN_SECONDS;
                    break;
                case 'years':
                    $interval *= YEAR_IN_SECONDS;
                    break;
                default:
                    $interval = 0;
                    break;
            }
        }

        return $interval;
    }
}

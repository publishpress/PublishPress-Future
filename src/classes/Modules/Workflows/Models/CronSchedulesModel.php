<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\CronSchedulesModelInterface;

class CronSchedulesModel implements CronSchedulesModelInterface
{
    public function getCronSchedules(): array
    {
        return wp_get_schedules();
    }

    public function getCronSchedulesAsOptions(): array
    {
        $schedules = $this->getCronSchedules();

        $options = [];

        foreach ($schedules as $key => $schedule) {
            $options[] = [
                'value' => $key,
                'label' => $schedule['display'],
            ];
        }

        return $options;
    }
}

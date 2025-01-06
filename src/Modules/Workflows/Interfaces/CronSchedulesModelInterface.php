<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface CronSchedulesModelInterface
{
    public function getCronSchedules(): array;

    public function getCronSchedulesAsOptions(): array;

    public function getCronScheduleValueByName(string $name): string;
}

<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Models;

use function get_post_stati;

class CustomStatusesModel
{
    public const OUTPUT_OBJECTS = 'objects';
    public const OUTPUT_NAMES = 'names';

    /**
     * @return \stdClass[]
     */
    public function getCustomStatuses($output = self::OUTPUT_OBJECTS): array
    {
        $statuses = get_post_stati([], $output);
        $statusesToIgnore = [
            'publish',
            'draft',
            'future',
            'pending',
            'private',
            'trash',
            'auto-draft',
            'inherit',
            'request-confirmed',
            'request-failed',
            'request-completed',
            'request-pending',
        ];

        $filteredStatuses = [];

        foreach ($statuses as $statusName => $status) {
            if (in_array($statusName, $statusesToIgnore)) {
                continue;
            }

            $filteredStatuses[$statusName] = $status;
        }

        return $filteredStatuses;
    }

    public function getCustomStatusesAsOptions(): array
    {
        $statuses = $this->getCustomStatuses();
        $options = [];

        foreach ($statuses as $status => $statusObject) {
            $options[] = [
                'value' => $status,
                'label' => $statusObject->label,
            ];
        }

        return $options;
    }

    public function getStatusObject($statusName): ?\stdClass
    {
        $statuses = $this->getCustomStatuses();

        if (isset($statuses[$statusName])) {
            return $statuses[$statusName];
        }

        return null;
    }
}

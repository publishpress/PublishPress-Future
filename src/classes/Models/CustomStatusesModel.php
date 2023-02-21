<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Models;

use function get_post_stati;

class CustomStatusesModel
{
    /**
     * @return \stdClass[]
     */
    public function getCustomStatuses(): array
    {
        $statuses = get_post_stati([], 'objects');
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

        foreach ($statuses as $status => $statusObject) {
            if (in_array($status, $statusesToIgnore)) {
                continue;
            }

            $filteredStatuses[$status] = $statusObject;
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
}

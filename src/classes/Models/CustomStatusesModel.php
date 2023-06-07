<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Models;

use function get_post_stati;

defined('ABSPATH') or die('No direct script access allowed.');

class CustomStatusesModel
{
    const OUTPUT_OBJECTS = 'objects';
    const OUTPUT_NAMES = 'names';

    /**
     * @return \stdClass[]
     */
    public function getCustomStatuses($output = self::OUTPUT_OBJECTS)
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

    /**
     * @return array
     */
    public function getCustomStatusesAsOptions()
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

    /**
     * @param string $statusName
     * @return \stdClass|null
     */
    public function getStatusObject($statusName)
    {
        $statuses = $this->getCustomStatuses();

        if (isset($statuses[$statusName])) {
            return $statuses[$statusName];
        }

        return null;
    }
}

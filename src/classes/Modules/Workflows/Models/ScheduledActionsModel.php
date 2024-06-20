<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\ScheduledActionsModelInterface;

class ScheduledActionsModel implements ScheduledActionsModelInterface
{
    /**
     * @var array
     */
    private $data = [];

    public function load(int $id)
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $this->data = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM %i WHERE action_id = %d",
                $wpdb->prefix . 'actionscheduler_actions',
                $id
            ),
            ARRAY_A
        );

        return $this;
    }

    public function getHook(): string
    {
        return $this->data['hook'] ?? '';
    }

    public function getArgs(): array
    {
        $args = $this->data['extended_args'] ?? [];

        if (is_string($args)) {
            $args = json_decode($args, true);
        }

        return $args;
    }
}

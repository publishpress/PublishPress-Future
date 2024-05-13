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

        $query = $wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}actionscheduler_actions WHERE action_id = %d",
            $id
        );

        $this->data = $wpdb->get_row($query, ARRAY_A);

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

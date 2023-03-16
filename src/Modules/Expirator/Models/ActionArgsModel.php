<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Models;

use PublishPressFuture\Modules\Expirator\Schemas\ActionArgsSchema;

class ActionArgsModel
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $tableName;

    /**
     * @var int
     */
    private $cronActionId;

    /**
     * @var int
     */
    private $postId;

    /**
     * @var string
     */
    private $scheduledDate;

    /**
     * @var array
     */
    private $args;

    /**
     * @var string
     */
    private $createdAt;

    public function __construct()
    {
        $this->tableName = ActionArgsSchema::getTableName();
    }

    private function setAttributesFromRow($row): void
    {
        if (is_object($row)) {
            $this->id = $row->id;
            $this->cronActionId = $row->cron_action_id;
            $this->postId = $row->post_id;
            $this->scheduledDate = $row->scheduled_date;
            $this->createdAt = $row->created_at;
            $this->args = json_decode($row->args, true);
        }
    }

    public function load(int $id): void
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $row = $wpdb->get_row(
            $wpdb->prepare(
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                "SELECT * FROM {$this->tableName} WHERE id = %d",
                $id
            )
        );

        $this->setAttributesFromRow($row);
    }

    public function loadByActionId(int $actionid): void
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $row = $wpdb->get_row(
            $wpdb->prepare(
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                "SELECT * FROM {$this->tableName} WHERE cron_action_id = %d LIMIT 1",
                $actionid
            )
        );

        $this->setAttributesFromRow($row);
    }

    public function loadByPostId(int $postId): void
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $row = $wpdb->get_row(
            $wpdb->prepare(
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                "SELECT * FROM {$this->tableName} WHERE post_id = %d LIMIT 1",
                $postId
            )
        );

        $this->setAttributesFromRow($row);
    }

    public function save(): void
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->update(
            $this->tableName,
            [
                'cron_action_id' => $this->cronActionId,
                'post_id'   => $this->postId,
                'args'      => wp_json_encode($this->args),
                'scheduled_date' => $this->scheduledDate,
            ],
            [
                'id' => $this->id,
            ]
        );
    }

    public function add(): int
    {
        global $wpdb;

        $wpdb->insert(
            $this->tableName,
            [
                'cron_action_id' => $this->cronActionId,
                'post_id'   => $this->postId,
                'args'      => wp_json_encode($this->args),
                'created_at' => current_time('mysql'),
                'scheduled_date' => $this->scheduledDate,
            ]
        );

        return $wpdb->insert_id;
    }

    public function delete(): void
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->delete(
            $this->tableName,
            [
                'id' => $this->id,
            ]
        );
    }

    public function getId(): int
    {
        return (int)$this->id;
    }

    /**
     * @return int
     */
    public function getCronActionId(): int
    {
        return (int)$this->cronActionId;
    }

    /**
     * @param int $cronActionId
     * @return ActionArgsModel
     */
    public function setCronActionId(int $cronActionId): ActionArgsModel
    {
        $this->cronActionId = $cronActionId;
        return $this;
    }


    /**
     * @return int
     */
    public function getPostId(): int
    {
        return (int)$this->postId;
    }

    /**
     * @param int $postId
     * @return ActionArgsModel
     */
    public function setPostId(int $postId): ActionArgsModel
    {
        $this->postId = $postId;
        return $this;
    }

    /**
     * @return array
     */
    public function getArgs(): array
    {
        return (array)$this->args;
    }

    /**
     * @param array $args
     * @return ActionArgsModel
     */
    public function setArgs(array $args): ActionArgsModel
    {
        $this->args = $args;
        return $this;
    }

    /**
     * @return string
     */
    public function getCreatedAt(): string
    {
        return (string)$this->createdAt;
    }

    /**
     * @param string $createdAt
     * @return ActionArgsModel
     */
    public function setCreatedAt(string $createdAt): ActionArgsModel
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * @return string
     */
    public function getScheduledDate(): string
    {
        return (string)$this->scheduledDate;
    }

    /**
     * @return int
     */
    public function getScheduledDateAsUnixTime(): int
    {
        return date('U', strtotime($this->getScheduledDate()));
    }

    /**
     * @param string $scheduledDate
     * @return ActionArgsModel
     */
    public function setScheduledDate(string $scheduledDate): ActionArgsModel
    {
        $this->scheduledDate = $scheduledDate;
        return $this;
    }

    /**
     * @param int $scheduledDate
     * @return ActionArgsModel
     */
    public function setScheduledDateFromUnixTime(int $scheduledDate): ActionArgsModel
    {
        $this->scheduledDate = date('Y-m-d H:i:s', $scheduledDate);
        return $this;
    }
}

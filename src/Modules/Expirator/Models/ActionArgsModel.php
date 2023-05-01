<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

defined('ABSPATH') or die('Direct access not allowed.');

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

    /**
     * @var bool
     */
    private $enabled;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Models\ExpirationActionsModel
     */
    private $expirationActionsModel;

    public function __construct(ExpirationActionsModel $expirationActionsModel)
    {
        $this->tableName = ActionArgsSchema::getTableName();

        $this->expirationActionsModel = $expirationActionsModel;
    }

    private function setAttributesFromRow($row): void
    {
        if (is_object($row)) {
            $this->id = $row->id;
            $this->cronActionId = $row->cron_action_id;
            $this->postId = $row->post_id;
            $this->scheduledDate = $row->scheduled_date;
            $this->createdAt = $row->created_at;
            $this->enabled = absint($row->enabled) === 1;
            $this->args = json_decode($row->args, true);
        }
    }

    public function load(int $id): bool
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

        if (! empty($row)) {
            $this->setAttributesFromRow($row);
        }

        return is_object($row);
    }

    public function loadByActionId(int $actionid): bool
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

        if (! empty($row)) {
            $this->setAttributesFromRow($row);
        }

        return is_object($row);
    }

    /**
     * Load the enabled action by post ID. We can have only one enabled per post.
     */
    public function loadByPostId(int $postId): bool
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $row = $wpdb->get_row(
            $wpdb->prepare(
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                "SELECT * FROM {$this->tableName} WHERE enabled = 1 AND post_id = %d LIMIT 1",
                $postId
            )
        );

        if (! empty($row)) {
            $this->setAttributesFromRow($row);
        }

        return is_object($row);
    }

    public function save(): void
    {
        global $wpdb;

        // For now we only support one action per post
        $this->disableAllForPost($this->postId);

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->update(
            $this->tableName,
            [
                'cron_action_id' => $this->cronActionId,
                'post_id'   => $this->postId,
                'enabled'   => $this->enabled ? 1 : 0,
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
                'enabled'   => 1,
                'args'      => wp_json_encode($this->args),
                'created_at' => current_time('mysql'),
                'scheduled_date' => $this->scheduledDate,
            ]
        );

        return $wpdb->insert_id;
    }

    public function disableAllForPost(int $postId = null): void
    {
        global $wpdb;

        if (empty($postId)) {
            $postId = $this->postId;
        }

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->update(
            $this->tableName,
            [
                'enabled' => 0,
            ],
            [
                'post_id' => $postId,
            ]
        );
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
        return absint($this->id);
    }

    /**
     * @return int
     */
    public function getCronActionId(): int
    {
        return absint($this->cronActionId);
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

    public function getAction(): string
    {
        return $this->args['expireType'] ?? '';
    }

    public function getActionLabel(): string
    {
        return $this->expirationActionsModel->getLabelForAction($this->getAction());
    }

    public function getTaxonomyTerms(): array
    {
        return $this->args['category'] ?? [];
    }

    public function getTaxonomyTermsNames(): array
    {
        $terms = $this->getTaxonomyTerms();

        $names = [];
        foreach ($terms as $term) {
            $term = get_term($term);
            if ($term instanceof \WP_Term) {
                $names[] = $term->name;
            }
        }

        return $names;
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

    public function setEnabled(bool $enabled): ActionArgsModel
    {
        $this->enabled = $enabled;
        return $this;
    }

    public function getEnabled(): bool
    {
        return (bool)$this->enabled;
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

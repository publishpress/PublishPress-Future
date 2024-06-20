<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\ActionArgsModelInterface;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

defined('ABSPATH') or die('Direct access not allowed.');

class ActionArgsModel implements ActionArgsModelInterface
{
    private const DATE_FORMAT_ISO_8601 = 'Y-m-d H:i:s';

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

    private function setAttributesFromRow($row)
    {
        if (is_object($row)) {
            $this->id = $row->id;
            $this->cronActionId = $row->cron_action_id;
            $this->postId = $row->post_id;
            $this->scheduledDate = $row->scheduled_date;
            $this->createdAt = $row->created_at;
            $this->enabled = absint($row->enabled) === 1;
            $this->args = json_decode($row->args, true);

            if (isset($this->args['expireType'])) {
                if ($this->args['expireType'] === ExpirationActionsAbstract::POST_STATUS_TO_DRAFT) {
                    $this->args['expireType'] = ExpirationActionsAbstract::CHANGE_POST_STATUS;
                    $this->args['newStatus'] = 'draft';
                }

                if ($this->args['expireType'] === ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE) {
                    $this->args['expireType'] = ExpirationActionsAbstract::CHANGE_POST_STATUS;
                    $this->args['newStatus'] = 'private';
                }

                if ($this->args['expireType'] === ExpirationActionsAbstract::POST_STATUS_TO_TRASH) {
                    $this->args['expireType'] = ExpirationActionsAbstract::CHANGE_POST_STATUS;
                    $this->args['newStatus'] = 'trash';
                }
            }
        }
    }

    public function load(int $id): bool
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
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

    public function loadByActionId(int $actionId): bool
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $row = $wpdb->get_row(
            $wpdb->prepare(
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                "SELECT * FROM {$this->tableName} WHERE cron_action_id = %d LIMIT 1",
                $actionId
            )
        );

        if (! empty($row)) {
            $this->setAttributesFromRow($row);
        }

        return is_object($row);
    }

    public function loadByPostId(int $postId, bool $filterEnabled = false): bool
    {
        global $wpdb;

        $row = null;
        if ($filterEnabled) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
            $row = $wpdb->get_row(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT * FROM {$this->tableName} WHERE post_id = %d AND enabled = 1 ORDER BY enabled DESC, id DESC LIMIT 1",
                    $postId
                )
            );
        } else {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
            $row = $wpdb->get_row(
                $wpdb->prepare(
                    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                    "SELECT * FROM {$this->tableName} WHERE post_id = %d ORDER BY enabled DESC, id DESC LIMIT 1",
                    $postId
                )
            );
        }

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

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
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

    public function insert(): int
    {
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
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

    /**
     * @param int|null $postId
     */
    public function disableAllForPost($postId = null): void
    {
        global $wpdb;

        if (empty($postId)) {
            $postId = $this->postId;
        }

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
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

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery
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

    public function setCronActionId(int $cronActionId): ActionArgsModelInterface
    {
        $this->cronActionId = $cronActionId;
        return $this;
    }

    public function getPostId(): int
    {
        return (int)$this->postId;
    }

    public function setPostId(int $postId): ActionArgsModelInterface
    {
        $this->postId = $postId;
        return $this;
    }

    public function getArgs(): array
    {
        return (array)$this->args;
    }

    public function getArg(string $key): string
    {
        return isset($this->args[$key]) ? $this->args[$key] : '';
    }

    public function getAction(): string
    {
        return isset($this->args['expireType']) ? $this->args['expireType'] : '';
    }

    public function getActionLabel(string $postType = ''): string
    {
        $label = $this->expirationActionsModel->getLabelForAction($this->getAction(), $postType);

        if (empty($label)) {
            $label = $this->getArg('actionLabel');
        }

        return $label;
    }

    public function getTaxonomyTerms(): array
    {
        $terms = isset($this->args['category']) ? $this->args['category'] : [];

        if (! is_array($terms)) {
            $terms = explode(',', $terms);
        }

        return $terms;
    }

    public function getTaxonomy(): string
    {
        return isset($this->args['categoryTaxonomy']) ? $this->args['categoryTaxonomy'] : '';
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

    public function setArgs(array $args): ActionArgsModelInterface
    {
        $this->args = $args;

        return $this;
    }

    public function setArg(string $key, $value): ActionArgsModelInterface
    {
        $this->args[$key] = $value;

        return $this;
    }

    public function getCreatedAt(): string
    {
        return (string)$this->createdAt;
    }

    public function setCreatedAt(string $createdAt): ActionArgsModelInterface
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * @deprecated version 3.4.0, use getScheduledDateAsISO8601 or getScheduledDateAsUnixTime
     */
    public function getScheduledDate(): string
    {
        return $this->getScheduledDateAsISO8601();
    }

    public function getScheduledDateAsISO8601(): string
    {
        if (is_numeric($this->scheduledDate)) {
            $this->scheduledDate = $this->convertUnixTimeDateToISO8601($this->scheduledDate);
        }

        return (string)$this->scheduledDate;
    }

    public function setEnabled(bool $enabled): ActionArgsModelInterface
    {
        $this->enabled = $enabled;
        return $this;
    }

    public function getEnabled(): bool
    {
        return (bool)$this->enabled;
    }

    public function getScheduledDateAsUnixTime(): int
    {
        return $this->convertISO8601DateToUnixTime($this->getScheduledDateAsISO8601());
    }

    /**
     * @deprecated version 3.4.0, use setScheduledDateFromISO8601 or setScheduledDateFromUnixTime
     */
    public function setScheduledDate(string $scheduledDate): ActionArgsModelInterface
    {
        $this->scheduledDate = $this->setScheduledDateFromISO8601($scheduledDate);

        return $this;
    }

    public function setScheduledDateFromISO8601(string $scheduledDate): ActionArgsModelInterface
    {
        // We convert the date to unix time and then back to ISO8601 to ensure the date is valid.
        $unixTime = $this->convertISO8601DateToUnixTime($scheduledDate);
        $this->scheduledDate = $this->convertUnixTimeDateToISO8601($unixTime);

        return $this;
    }

    public function setScheduledDateFromUnixTime(int $scheduledDate): ActionArgsModelInterface
    {
        $this->scheduledDate = $this->convertUnixTimeDateToISO8601($scheduledDate);

        return $this;
    }

    private function convertUnixTimeDateToISO8601(int $date): string
    {
        // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
        return date(self::DATE_FORMAT_ISO_8601, $date);
    }

    private function convertISO8601DateToUnixTime(string $date): int
    {
        return (int) strtotime($date);
    }
}

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
        }
    }

    /**
     * @param int $id
     * @return bool
     */
    public function load($id)
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

    /**
     * @param int $actionId
     * @return bool
     */
    public function loadByActionId($actionId)
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
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

    /**
     * Load the enabled action by post ID. We can have only one enabled per post.
     *
     * @param int $postId
     * @return bool
     */
    public function loadByPostId($postId)
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $row = $wpdb->get_row(
            $wpdb->prepare(
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                "SELECT * FROM {$this->tableName} WHERE post_id = %d ORDER BY enabled DESC, id DESC LIMIT 1",
                $postId
            )
        );

        if (! empty($row)) {
            $this->setAttributesFromRow($row);
        }

        return is_object($row);
    }

    public function save()
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

    /**
     * @return int
     */
    public function add()
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

    /**
     * @param int|null $postId
     * @return void
     */
    public function disableAllForPost($postId = null)
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

    public function delete()
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

    /**
     * @return int
     */
    public function getId()
    {
        return absint($this->id);
    }

    /**
     * @return int
     */
    public function getCronActionId()
    {
        return absint($this->cronActionId);
    }

    /**
     * @param int $cronActionId
     * @return ActionArgsModel
     */
    public function setCronActionId($cronActionId)
    {
        $this->cronActionId = $cronActionId;
        return $this;
    }


    /**
     * @return int
     */
    public function getPostId()
    {
        return (int)$this->postId;
    }

    /**
     * @param int $postId
     * @return ActionArgsModel
     */
    public function setPostId($postId)
    {
        $this->postId = $postId;
        return $this;
    }

    /**
     * @return array
     */
    public function getArgs()
    {
        return (array)$this->args;
    }

    public function getAction()
    {
        return isset($this->args['expireType']) ? $this->args['expireType'] : '';
    }

    /**
     * @return string
     */
    public function getActionLabel()
    {
        return $this->expirationActionsModel->getLabelForAction($this->getAction());
    }

    /**
     * @return array
     */
    public function getTaxonomyTerms()
    {
        return isset($this->args['category']) ? $this->args['category'] : [];
    }

    /**
     * @return array
     */
    public function getTaxonomyTermsNames()
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
    public function setArgs($args)
    {
        $this->args = $args;
        return $this;
    }

    /**
     * @return string
     */
    public function getCreatedAt()
    {
        return (string)$this->createdAt;
    }

    /**
     * @param string $createdAt
     * @return ActionArgsModel
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * @return string
     */
    public function getScheduledDate()
    {
        return (string)$this->scheduledDate;
    }

    /**
     * @param bool $enabled
     * @return $this
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
        return $this;
    }

    /**
     * @return bool
     */
    public function getEnabled()
    {
        return (bool)$this->enabled;
    }

    /**
     * @return int
     */
    public function getScheduledDateAsUnixTime()
    {
        return date('U', strtotime($this->getScheduledDate()));
    }

    /**
     * @param string $scheduledDate
     * @return ActionArgsModel
     */
    public function setScheduledDate($scheduledDate)
    {
        $this->scheduledDate = $scheduledDate;
        return $this;
    }

    /**
     * @param int $scheduledDate
     * @return ActionArgsModel
     */
    public function setScheduledDateFromUnixTime($scheduledDate)
    {
        $this->scheduledDate = gmdate('Y-m-d H:i:s', $scheduledDate);
        return $this;
    }
}

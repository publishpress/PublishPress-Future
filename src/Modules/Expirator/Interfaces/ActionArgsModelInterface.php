<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Interfaces;

use PublishPress\Future\Modules\Expirator\Models\ExpirationActionsModel;

defined('ABSPATH') or die('Direct access not allowed.');

interface ActionArgsModelInterface
{
    public function __construct(ExpirationActionsModel $expirationActionsModel);

    /**
     * @param int $id
     * @return bool
     */
    public function load($id);

    /**
     * @param int $actionId
     * @return bool
     */
    public function loadByActionId($actionId);

    /**
     * Load the enabled action by post ID. We can have only one enabled per post.
     *
     * @param int $postId
     * @return bool
     */
    public function loadByPostId($postId, $filterEnabled = false);

    public function save();

    /**
     * @return int
     */
    public function insert();

    /**
     * @param int|null $postId
     * @return void
     */
    public function disableAllForPost($postId = null);

    public function delete();

    /**
     * @return int
     */
    public function getId();

    /**
     * @return int
     */
    public function getCronActionId();

    /**
     * @param int $cronActionId
     * @return ActionArgsModel
     */
    public function setCronActionId($cronActionId);


    /**
     * @return int
     */
    public function getPostId();

    /**
     * @param int $postId
     * @return ActionArgsModel
     */
    public function setPostId($postId);

    /**
     * @return array
     */
    public function getArgs();

    public function getArg(string $key): string;

    public function getAction();

    /**
     * @return string
     */
    public function getActionLabel($postType = '');

    /**
     * @return array
     */
    public function getTaxonomyTerms();

    public function getTaxonomy();

    /**
     * @return array
     */
    public function getTaxonomyTermsNames();

    /**
     * @param array $args
     * @return ActionArgsModel
     */
    public function setArgs($args);

    /**
     * @param string $key
     * @param mixed $value
     * @return ActionsArgsModel
     */
    public function setArg(string $key, $value);

    /**
     * @return string
     */
    public function getCreatedAt();

    /**
     * @param string $createdAt
     * @return ActionArgsModel
     */
    public function setCreatedAt($createdAt);

    /**
     * @deprecated version 3.4.0, use getCreatedAtAsISO8601 or getCreatedAtAsUnixTime
     */
    public function getScheduledDate(): string;

    public function getScheduledDateAsISO8601(): string;

    /**
     * @param bool $enabled
     * @return $this
     */
    public function setEnabled($enabled);

    /**
     * @return bool
     */
    public function getEnabled();

    public function getScheduledDateAsUnixTime(): int;

    /**
     * @deprecated version 3.4.0, use setScheduledDateFromISO8601 or setScheduledDateFromUnixTime
     */
    public function setScheduledDate(string $scheduledDate): ActionArgsModelInterface;

    public function setScheduledDateFromISO8601(string $scheduledDate): ActionArgsModelInterface;

    public function setScheduledDateFromUnixTime(int $scheduledDate): ActionArgsModelInterface;
}

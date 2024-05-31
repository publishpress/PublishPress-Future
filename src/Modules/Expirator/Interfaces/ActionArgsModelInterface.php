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

    public function load(int $id): bool;

    public function loadByActionId(int $actionId): bool;

    public function loadByPostId(int $postId, bool $filterEnabled = false): bool;

    public function save(): void;

    /**
     * @return int
     */
    public function insert(): int;

    /**
     * @param int|null $postId
     */
    public function disableAllForPost($postId = null): void;

    public function delete(): void;

    public function getId(): int;

    public function getCronActionId(): int;

    public function setCronActionId(int $cronActionId): ActionArgsModelInterface;

    public function getPostId(): int;

    public function setPostId(int $postId): ActionArgsModelInterface;

    public function getArgs(): array;

    public function getArg(string $key): string;

    public function getAction(): string;

    public function getActionLabel(string $postType = ''): string;

    public function getTaxonomyTerms(): array;

    public function getTaxonomy(): string;

    public function getTaxonomyTermsNames(): array;

    public function setArgs(array $args): ActionArgsModelInterface;

    /**
     * @param string $key
     * @param mixed $value
     * @return ActionsArgsModel
     */
    public function setArg(string $key, $value): ActionArgsModelInterface;

    public function getCreatedAt(): string;

    public function setCreatedAt(string $createdAt): ActionArgsModelInterface;

    /**
     * @deprecated version 3.4.0, use getCreatedAtAsISO8601 or getCreatedAtAsUnixTime
     */
    public function getScheduledDate(): string;

    public function getScheduledDateAsISO8601(): string;

    public function setEnabled(bool $enabled): ActionArgsModelInterface;

    public function getEnabled(): bool;

    public function getScheduledDateAsUnixTime(): int;

    /**
     * @deprecated version 3.4.0, use setScheduledDateFromISO8601 or setScheduledDateFromUnixTime
     */
    public function setScheduledDate(string $scheduledDate): ActionArgsModelInterface;

    public function setScheduledDateFromISO8601(string $scheduledDate): ActionArgsModelInterface;

    public function setScheduledDateFromUnixTime(int $scheduledDate): ActionArgsModelInterface;
}

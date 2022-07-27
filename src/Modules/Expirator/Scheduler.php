<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Framework\Helpers\DateTimeHelper;
use PublishPressFuture\Framework\HookableInterface;
use PublishPressFuture\Framework\Logger\LoggerInterface;
use PublishPressFuture\Framework\WordPress\CronFacade;
use PublishPressFuture\Framework\WordPress\ErrorFacade;
use PublishPressFuture\Framework\WordPress\PostModel;
use PublishPressFuture\Modules\Expirator\Hooks\ActionsAbstract;
use WP_Error;

class Scheduler implements SchedulerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var CronFacade
     */
    private $cron;

    /**
     * @var ErrorFacade
     */
    private $error;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var DateTimeHelper
     */
    private $dateTimeHelper;

    /**
     * @param HookableInterface $hooksFacade
     * @param CronFacade $cronFacade
     * @param ErrorFacade $errorFacade
     * @param LoggerInterface $logger
     * @param DateTimeHelper $dateTimeHelper
     */
    public function __construct($hooksFacade, $cronFacade, $errorFacade, $logger, $dateTimeHelper)
    {
        $this->hooks = $hooksFacade;
        $this->cron = $cronFacade;
        $this->error = $errorFacade;
        $this->logger = $logger;
        $this->dateTimeHelper = $dateTimeHelper;
    }

    /**
     * @param int $postId
     * @param int $timestamp
     * @param array $opts
     * @return void
     */
    public function scheduleExpirationForPost($postId, $timestamp, $opts)
    {
        $postId = (int)$postId;

        $this->hooks->doAction(ActionsAbstract::LEGACY_SCHEDULE, $postId, $timestamp, $opts);

        $this->unscheduleExpirationForPostIfScheduled($postId, $timestamp);

        $scheduled = $this->cron->scheduleSingleEvent($timestamp, ActionsAbstract::LEGACY_EXPIRE_POST, [$postId], true);

        if (! $scheduled) {
            $this->logger->debug(
                sprintf(
                    '%d  -> TRIED TO SCHEDULE CRON EVENT at %s (%s) with options %s %s',
                    $postId,
                    $this->dateTimeHelper->getWpDate('r', $timestamp),
                    $timestamp,
                    print_r($opts, true),
                    $this->error->isWpError($scheduled) ? $this->error->getWpErrorMessage(
                        $scheduled
                    ) : 'no errors found'
                )
            );

            return;
        }

        $this->storeExpirationDataInPostMeta($postId, $timestamp, $opts);

        $this->logger->debug(
            sprintf(
                '%d  -> CRON EVENT SCHEDULED at %s (%s) with options %s, no errors found',
                $postId,
                $this->dateTimeHelper->getWpDate('r', $timestamp),
                $timestamp,
                print_r($opts, true)
            )
        );
    }

    private function unscheduleExpirationForPostIfScheduled($postId, $timestamp)
    {
        if ($this->expirationIsScheduledForPost($timestamp)) {
            $result = $this->removeExistentExpirationsForPost($postId);

            $errorDetails = $this->error->isWpError($result) ? $this->error->getWpErrorMessage(
                $result
            ) : 'no errors found';
            $message = $postId . ' -> EXISTING CRON EVENT FOUND - UNSCHEDULED - ' . $errorDetails;

            $this->logger->debug($message);
        }
    }

    private function expirationIsScheduledForPost($postId)
    {
        return $this->cron->getNextScheduleForEvent($postId, ActionsAbstract::LEGACY_EXPIRE_POST);
    }

    /**
     * @param int $postId
     * @return false|int|WP_Error
     */
    private function removeExistentExpirationsForPost($postId)
    {
        return $this->cron->clearScheduledHook(ActionsAbstract::LEGACY_EXPIRE_POST, [$postId], true);
    }

    /**
     * @param $postId
     * @param $timestamp
     * @param $opts
     * @return void
     */
    private function storeExpirationDataInPostMeta($postId, $timestamp, $opts)
    {
        $postModel = new PostModel($postId);
        $postModel->updateMeta(
            [
                '_expiration-date' => $timestamp,
                '_expiration-date-status' => 'saved',
                '_expiration-date-options' => $opts,
                '_expiration-date-type' => $opts['expireType'],
                '_expiration-date-categories' => isset($opts['category']) ? $opts['category'] : [],
                '_expiration-date-taxonomy' => isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : '',
            ]
        );
    }

    public function unscheduleExpirationForPost($postId)
    {
        $this->hooks->doAction(ActionsAbstract::LEGACY_UNSCHEDULE, $postId);

        if ($this->expirationIsScheduledForPost($postId)) {
            $this->cron->clearScheduledHook(ActionsAbstract::LEGACY_EXPIRE_POST, [$postId]);

            $this->logger->debug(sprintf('%d -> UNSCHEDULED, no errors found', $postId));
        }

        $this->removeExpirationDataFromPostMeta($postId);
    }

    private function removeExpirationDataFromPostMeta($postId)
    {
        $postModel = new PostModel($postId);
        $postModel->deleteMeta(
            [
                '_expiration-date',
                '_expiration-date-status',
                '_expiration-date-options',
                '_expiration-date-type',
                '_expiration-date-categories',
                '_expiration-date-taxonomy',
            ]
        );
    }
}

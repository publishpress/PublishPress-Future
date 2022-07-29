<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Core\Framework\Logger\LoggerInterface;
use PublishPressFuture\Core\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\DateTimeFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\ErrorFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\PostModel;
use PublishPressFuture\Core\HookableInterface;
use WP_Error;

class ExpirationScheduler implements SchedulerInterface
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
     * @var DateTimeFacade
     */
    private $datetime;

    /**
     * @var \PublishPressFuture\Core\Framework\WordPress\Facade\PostModelFactory
     */
    private $postModelFactory;

    /**
     * @param HookableInterface $hooksFacade
     * @param CronFacade $cronFacade
     * @param ErrorFacade $errorFacade
     * @param LoggerInterface $logger
     * @param DateTimeFacade $datetime
     * @param \PublishPressFuture\Core\Framework\WordPress\Facade\PostModelFactory $postModelFactory
     */
    public function __construct($hooksFacade, $cronFacade, $errorFacade, $logger, $datetime, $postModelFactory)
    {
        $this->hooks = $hooksFacade;
        $this->cron = $cronFacade;
        $this->error = $errorFacade;
        $this->logger = $logger;
        $this->datetime = $datetime;
        $this->postModelFactory = $postModelFactory;
    }

    /**
     * @param int $postId
     * @param int $timestamp
     * @param array $opts
     * @return void
     */
    public function schedule($postId, $timestamp, $opts)
    {
        $postId = (int)$postId;

        $this->hooks->doAction(AbstractHooks::LEGACY_SCHEDULE, $postId, $timestamp, $opts);

        $this->unscheduleIfScheduled($postId, $timestamp);

        $scheduled = $this->cron->scheduleSingleEvent($timestamp, AbstractHooks::LEGACY_EXPIRE_POST, [$postId], true);

        if (! $scheduled) {
            $this->logger->debug(
                sprintf(
                    '%d  -> TRIED TO SCHEDULE CRON EVENT at %s (%s) with options %s %s',
                    $postId,
                    $this->datetime->getWpDate('r', $timestamp),
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
                $this->datetime->getWpDate('r', $timestamp),
                $timestamp,
                print_r($opts, true)
            )
        );
    }

    private function unscheduleIfScheduled($postId, $timestamp)
    {
        if ($this->isScheduled($timestamp)) {
            $result = $this->removeSchedule($postId);

            $errorDetails = $this->error->isWpError($result) ? $this->error->getWpErrorMessage(
                $result
            ) : 'no errors found';
            $message = $postId . ' -> EXISTING CRON EVENT FOUND - UNSCHEDULED - ' . $errorDetails;

            $this->logger->debug($message);
        }
    }

    public function isScheduled($postId)
    {
        return $this->cron->getNextScheduleForEvent($postId, AbstractHooks::LEGACY_EXPIRE_POST);
    }

    /**
     * @param int $postId
     * @return false|int|WP_Error
     */
    private function removeSchedule($postId)
    {
        return $this->cron->clearScheduledHook(AbstractHooks::LEGACY_EXPIRE_POST, [$postId], true);
    }

    /**
     * @param $postId
     * @param $timestamp
     * @param $opts
     * @return void
     */
    private function storeExpirationDataInPostMeta($postId, $timestamp, $opts)
    {
        $postModel = $this->postModelFactory->getPostModel($postId);
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

    /**
     * @inheritDoc
     */
    public function unschedule($postId)
    {
        $this->hooks->doAction(AbstractHooks::LEGACY_UNSCHEDULE, $postId);

        if ($this->isScheduled($postId)) {
            $this->cron->clearScheduledHook(AbstractHooks::LEGACY_EXPIRE_POST, [$postId]);

            $this->logger->debug(sprintf('%d -> UNSCHEDULED, no errors found', $postId));
        }

        $this->removeExpirationDataFromPostMeta($postId);
    }

    private function removeExpirationDataFromPostMeta($postId)
    {
        $postModel = $this->postModelFactory->getPostModel($postId);
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

<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\Logger\LoggerInterface;
use PublishPressFuture\Framework\WordPress\Facade\DateTimeFacade;
use PublishPressFuture\Framework\WordPress\Facade\ErrorFacade;
use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface;

class ExpirationScheduler implements SchedulerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var CronInterface
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
     * @var \Closure
     */
    private $postModelFactory;

    /**
     * @param HookableInterface $hooksFacade
     * @param CronInterface $cron
     * @param ErrorFacade $errorFacade
     * @param LoggerInterface $logger
     * @param DateTimeFacade $datetime
     * @param \Closure $postModelFactory
     */
    public function __construct($hooksFacade, $cron, $errorFacade, $logger, $datetime, $postModelFactory)
    {
        $this->hooks = $hooksFacade;
        $this->cron = $cron;
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

        $this->hooks->doAction(HooksAbstract::ACTION_LEGACY_SCHEDULE, $postId, $timestamp, $opts);

        $this->unscheduleIfScheduled($postId, $timestamp);

        $scheduled = $this->cron->scheduleSingleAction($timestamp, HooksAbstract::ACTION_EXPIRE_POST, [$postId], true);

        if (! $scheduled) {
            $this->logger->debug(
                sprintf(
                    '%d  -> TRIED TO SCHEDULE ACTION at %s (%s) with options %s %s',
                    $postId,
                    $this->datetime->getWpDate('r', $timestamp),
                    $timestamp,
                    // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
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
                '%d  -> ACTION SCHEDULED at %s (%s) with options %s, no errors found',
                $postId,
                $this->datetime->getWpDate('r', $timestamp),
                $timestamp,
                // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
                print_r($opts, true)
            )
        );
    }

    private function unscheduleIfScheduled($postId, $timestamp)
    {
        if ($this->isScheduled($postId)) {
            $this->logger->debug($postId . ' -> FOUND SCHEDULED ACTION for the post');

            $this->unschedule($postId);
        }
    }

    public function isScheduled($postId)
    {
        $scheduledWithNewHook = $this->cron->getNextScheduleForAction(HooksAbstract::ACTION_EXPIRE_POST, [$postId]);

        if ($scheduledWithNewHook) {
            return true;
        }

        return $this->cron->getNextScheduleForAction(HooksAbstract::ACTION_LEGACY_EXPIRE_POST, [$postId]);
    }

    /**
     * @param $postId
     * @param $timestamp
     * @param $opts
     * @return void
     */
    private function storeExpirationDataInPostMeta($postId, $timestamp, $opts)
    {
        $postModelFactory = $this->postModelFactory;
        $postModel = $postModelFactory($postId);

        $postModel->updateMeta(
            [
                '_expiration-date' => $timestamp,
                '_expiration-date-status' => 'saved',
                '_expiration-date-options' => $opts,
                '_expiration-date-type' => $opts['expireType'],
                '_expiration-date-categories' => isset($opts['category']) ? (array)$opts['category'] : [],
                '_expiration-date-taxonomy' => isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : '',
            ]
        );
    }

    /**
     * @inheritDoc
     */
    public function unschedule($postId)
    {
        $this->hooks->doAction(HooksAbstract::ACTION_LEGACY_UNSCHEDULE, $postId);

        if ($this->isScheduled($postId)) {
            $legacyResult = $this->cron->clearScheduledAction(HooksAbstract::ACTION_LEGACY_EXPIRE_POST, [$postId]);
            $result = $this->cron->clearScheduledAction(HooksAbstract::ACTION_EXPIRE_POST, [$postId]);

            $errorFeedback = null;
            if ($this->error->isWpError($legacyResult)) {
                $errorFeedback = 'found error: ' . $this->error->getWpErrorMessage($legacyResult);
            }

            if ($this->error->isWpError($result)) {
                $errorFeedback = 'found error: ' . $this->error->getWpErrorMessage($result);
            }

            if (empty($errorFeedback)) {
                $errorFeedback = 'no errors found';
            }

            $message = $postId . ' -> CLEARED SCHEDULED ACTION, ' . $errorFeedback;

            $this->logger->debug($message);
        }

        $this->removeExpirationDataFromPostMeta($postId);
    }

    private function removeExpirationDataFromPostMeta($postId)
    {
        $postModelFactory = $this->postModelFactory;
        $postModel = $postModelFactory($postId);

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

        $this->logger->debug($postId . ' -> EXPIRATION DATA REMOVED from the post');
    }
}

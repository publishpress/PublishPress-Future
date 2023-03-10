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
    public function __construct(
        $hooksFacade,
        $cron,
        $errorFacade,
        $logger,
        $datetime,
        $postModelFactory
    ) {
        $this->hooks = $hooksFacade;
        $this->cron = $cron;
        $this->error = $errorFacade;
        $this->logger = $logger;
        $this->datetime = $datetime;
        $this->postModelFactory = $postModelFactory;
    }

    public function schedule(int $postId, int $timestamp, array $opts): void
    {
        $this->hooks->doAction(HooksAbstract::ACTION_LEGACY_SCHEDULE, $postId, $timestamp, $opts);

        $this->unscheduleIfScheduled($postId, $timestamp);

        $scheduled = $this->cron->scheduleSingleAction(
            $timestamp,
            HooksAbstract::ACTION_RUN_WORKFLOW,
            [
                'postId' => $postId,
                'action' => 'expire',
            ]
        );

        if (! $scheduled) {
            $this->logger->debug(
                sprintf(
                    '%d  -> TRIED TO SCHEDULE ACTION using %s at %s (%s) with options %s %s',
                    $postId,
                    $this->cron->getIdentifier(),
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
                '%d  -> ACTION SCHEDULED using %s at %s (%s) with options %s, no errors found',
                $postId,
                $this->cron->getIdentifier(),
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
            $this->logger->debug($postId . ' -> FOUND SCHEDULED ACTION for the post using ' . $this->cron->getIdentifier());

            $this->unschedule($postId);
        }
    }


    public function isScheduled($postId)
    {
        return $this->cron->getNextScheduleForAction(HooksAbstract::ACTION_RUN_WORKFLOW, ['postId' => $postId, 'action' => 'expire']);
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
                PostMetaAbstract::EXPIRATION_TIMESTAMP => $timestamp,
                PostMetaAbstract::EXPIRATION_STATUS => 'saved',
                PostMetaAbstract::EXPIRATION_DATE_OPTIONS => $opts,
                PostMetaAbstract::EXPIRATION_TYPE => $opts['expireType'],
                PostMetaAbstract::EXPIRATION_TERMS => isset($opts['category']) ? (array)$opts['category'] : [],
                PostMetaAbstract::EXPIRATION_TAXONOMY => isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : '',
                PostMetaAbstract::CRON_IDENTIFIER => $this->cron->getIdentifier(),
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
            $result = $this->cron->clearScheduledAction(HooksAbstract::ACTION_RUN_WORKFLOW, ['postId' => $postId, 'action' => 'expire']);

            $errorFeedback = null;
            if ($this->error->isWpError($result)) {
                $errorFeedback = 'found error: ' . $this->error->getWpErrorMessage($result);
            }

            if (empty($errorFeedback)) {
                $errorFeedback = 'no errors found';
            }

            $message = $postId . ' -> CLEARED SCHEDULED ACTION using ' . $this->cron->getIdentifier() . ', ' . $errorFeedback;

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
                PostMetaAbstract::EXPIRATION_TIMESTAMP,
                PostMetaAbstract::EXPIRATION_STATUS,
                PostMetaAbstract::EXPIRATION_DATE_OPTIONS,
                PostMetaAbstract::EXPIRATION_TYPE,
                PostMetaAbstract::EXPIRATION_TERMS,
                PostMetaAbstract::EXPIRATION_TAXONOMY,
                PostMetaAbstract::CRON_IDENTIFIER,
            ]
        );

        $this->logger->debug($postId . ' -> EXPIRATION DATA REMOVED from the post using ' . $this->cron->getIdentifier());
    }
}

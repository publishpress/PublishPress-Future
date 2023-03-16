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
     * @var \Closure
     */
    private $actionArgsModelFactory;

    /**
     * @param HookableInterface $hooksFacade
     * @param CronInterface $cron
     * @param ErrorFacade $errorFacade
     * @param LoggerInterface $logger
     * @param DateTimeFacade $datetime
     * @param \Closure $postModelFactory
     * @param $actionArgsModelFactory
     */
    public function __construct(
        $hooksFacade,
        $cron,
        $errorFacade,
        $logger,
        $datetime,
        $postModelFactory,
        $actionArgsModelFactory
    ) {
        $this->hooks = $hooksFacade;
        $this->cron = $cron;
        $this->error = $errorFacade;
        $this->logger = $logger;
        $this->datetime = $datetime;
        $this->postModelFactory = $postModelFactory;
        $this->actionArgsModelFactory = $actionArgsModelFactory;
    }

    public function schedule(int $postId, int $timestamp, array $opts): void
    {
        $this->hooks->doAction(HooksAbstract::ACTION_LEGACY_SCHEDULE, $postId, $timestamp, $opts);

        $this->unscheduleIfScheduled($postId, $timestamp);

        $actionId = $this->cron->scheduleSingleAction(
            $timestamp,
            HooksAbstract::ACTION_RUN_WORKFLOW,
            [
                'postId' => $postId,
                'workflow' => 'expire'
            ]
        );

        if (! $actionId) {
            $this->logger->debug(
                sprintf(
                    '%d  -> TRIED TO SCHEDULE ACTION using %s at %s (%s) with options %s',
                    $postId,
                    $this->cron->getIdentifier(),
                    $this->datetime->getWpDate('r', $timestamp),
                    $timestamp,
                    // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
                    print_r($opts, true)
                )
            );

            return;
        }

        $actionArgsModel = ($this->actionArgsModelFactory)();
        $actionArgsModel->setCronActionId($actionId)
            ->setPostId($postId)
            ->setScheduledDateFromUnixTime($timestamp)
            ->setArgs($opts)
            ->add();

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
        return $this->cron->postHasScheduledActions($postId);
    }

    /**
     * @inheritDoc
     */
    public function unschedule($postId)
    {
        $this->hooks->doAction(HooksAbstract::ACTION_LEGACY_UNSCHEDULE, $postId);

        if ($this->isScheduled($postId)) {
            $result = $this->cron->clearScheduledAction(HooksAbstract::ACTION_RUN_WORKFLOW, ['postId' => $postId, 'workflow' => 'expire']);

            $errorFeedback = null;
            if ($this->error->isWpError($result)) {
                $errorFeedback = 'found error: ' . $this->error->getWpErrorMessage($result);
            }

            if (empty($errorFeedback)) {
                $errorFeedback = 'no errors found';
            }

            $actionArgsModel = ($this->actionArgsModelFactory)();
            $actionArgsModel->loadByPostId($postId);
            $actionArgsModel->delete();

            $message = $postId . ' -> CLEARED SCHEDULED ACTION using ' . $this->cron->getIdentifier() . ', ' . $errorFeedback;

            $this->logger->debug($message);
        }
    }
}

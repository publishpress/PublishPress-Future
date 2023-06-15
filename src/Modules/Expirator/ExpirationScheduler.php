<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\WordPress\Facade\DateTimeFacade;
use PublishPress\Future\Framework\WordPress\Facade\ErrorFacade;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface;

use function tad\WPBrowser\vendorDir;

defined('ABSPATH') or die('Direct access not allowed.');

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

    /**
     * @inheritDoc
     */
    public function schedule($postId, $timestamp, $opts)
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

        $factory = $this->actionArgsModelFactory;

        $actionArgsModel = $factory();
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

        $postModelFactory = $this->postModelFactory;
        $postModel = $postModelFactory($postId);

        // Metadata is used by 3rd party plugins.
        $postModel->updateMeta('_expiration-date-type', isset($opts['expireType']) ? $opts['expireType'] : '');
        $postModel->updateMeta('_expiration-date-status', 'saved');
        $postModel->updateMeta('_expiration-date-taxonomy', isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : '');
        $postModel->updateMeta('_expiration-date-categories', isset($opts['category']) ? $opts['category'] : '');
        $postModel->updateMeta('_expiration-date', $timestamp);
        $postModel->updateMeta('_expiration-date-options', $opts);
    }

    private function unscheduleIfScheduled($postId, $timestamp)
    {
        if ($this->postIsScheduled($postId)) {
            $this->logger->debug($postId . ' -> FOUND SCHEDULED ACTION for the post using ' . $this->cron->getIdentifier());

            $this->unschedule($postId);
        }
    }

    /**
     * @param $postId
     * @return bool
     */
    public function postIsScheduled($postId)
    {
        return $this->cron->postHasScheduledActions($postId);
    }

    /**
     * @inheritDoc
     */
    public function unschedule($postId)
    {
        $this->hooks->doAction(HooksAbstract::ACTION_LEGACY_UNSCHEDULE, $postId);

        if ($this->postIsScheduled($postId)) {
            $result = $this->cron->clearScheduledAction(HooksAbstract::ACTION_RUN_WORKFLOW, ['postId' => $postId, 'workflow' => 'expire']);

            $errorFeedback = null;
            if ($this->error->isWpError($result)) {
                $errorFeedback = 'found error: ' . $this->error->getWpErrorMessage($result);
            }

            if (empty($errorFeedback)) {
                $errorFeedback = 'no errors found';
            }

            $message = $postId . ' -> CLEARED SCHEDULED ACTION using ' . $this->cron->getIdentifier() . ', ' . $errorFeedback;

            $this->logger->debug($message);

            $this->deleteExpirationPostMeta($postId);
        }
    }

    protected function deleteExpirationPostMeta($postId)
    {
        $postModelFactory = $this->postModelFactory;
        $postModel = $postModelFactory($postId);
        $postModel->deleteExpirationPostMeta();
    }
}

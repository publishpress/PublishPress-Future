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
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\Future\Modules\Expirator\Models\ExpirationActionsModel;

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
     * @var ExpirationActionsModel
     */
    private $expirationActionsModel;

    /**
     * @param HookableInterface $hooksFacade
     * @param CronInterface $cron
     * @param ErrorFacade $errorFacade
     * @param LoggerInterface $logger
     * @param DateTimeFacade $datetime
     * @param \Closure $postModelFactory
     * @param $actionArgsModelFactory
     * @param ExpirationActionsModel $expirationActionsModel
     */
    public function __construct(
        $hooksFacade,
        $cron,
        $errorFacade,
        $logger,
        $datetime,
        $postModelFactory,
        $actionArgsModelFactory,
        $expirationActionsModel
    ) {
        $this->hooks = $hooksFacade;
        $this->cron = $cron;
        $this->error = $errorFacade;
        $this->logger = $logger;
        $this->datetime = $datetime;
        $this->postModelFactory = $postModelFactory;
        $this->actionArgsModelFactory = $actionArgsModelFactory;
        $this->expirationActionsModel = $expirationActionsModel;
    }

    private function convertLocalTimeToUtc($timestamp)
    {
        // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
        return get_gmt_from_date(date('Y-m-d H:i:s', $timestamp), 'U');
    }

    /**
     * @inheritDoc
     */
    public function schedule($postId, $timestamp, $opts)
    {
        $timestamp = $this->convertLocalTimeToUtc($timestamp);

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

        $postModelFactory = $this->postModelFactory;
        $postModel = $postModelFactory($postId);

        unset($opts['enabled']);
        unset($opts['id']);
        $opts['date'] = $timestamp;
        $opts['category'] = isset($opts['category']) ? $opts['category'] : [];
        $opts['categoryTaxonomy'] = isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : '';
        $opts['actionLabel'] = $this->expirationActionsModel->getLabelForAction($opts['expireType'], $postModel->getPostType());
        $opts['postTitle'] = $postModel->getTitle();
        $opts['postType'] = $postModel->getPostType();
        $opts['postLink'] = $postModel->getPermalink();
        $opts['postTypeLabel'] = $postModel->getPostTypeSingularLabel();

        $actionArgsModel = $factory();
        $id = $actionArgsModel->setCronActionId($actionId)
            ->setPostId($postId)
            ->setScheduledDateFromUnixTime($timestamp)
            ->setArgs($opts)
            ->insert();

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

        $this->updateLegacyPostMetaUsedBy3rdPartySoftware($postId, $timestamp, $opts);
    }

    private function updateLegacyPostMetaUsedBy3rdPartySoftware(int $postId, int $timestamp, array $opts): void
    {
        $postModelFactory = $this->postModelFactory;
        $postModel = $postModelFactory($postId);

        $type = isset($opts['expireType']) ? $opts['expireType'] : '';
        $taxonomy = isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : '';
        $terms = isset($opts['category']) ? $opts['category'] : '';
        $newStatus = isset($opts['newStatus']) ? $opts['newStatus'] : '';

        $postModel->updateMeta(PostMetaAbstract::EXPIRATION_TIMESTAMP, $timestamp);
        $postModel->updateMeta(PostMetaAbstract::EXPIRATION_STATUS, 'saved');
        $postModel->updateMeta(PostMetaAbstract::EXPIRATION_TYPE, $type);
        $postModel->updateMeta(PostMetaAbstract::EXPIRATION_POST_STATUS, $newStatus);
        $postModel->updateMeta(PostMetaAbstract::EXPIRATION_TAXONOMY, $taxonomy);
        $postModel->updateMeta(PostMetaAbstract::EXPIRATION_TERMS, $terms);
        $postModel->updateMeta(PostMetaAbstract::EXPIRATION_DATE_OPTIONS, $opts);

        $postModel->updateMeta(
            ExpirablePostModel::FLAG_METADATA_HASH,
            $postModel->calcMetadataHash()
        );

        $postModel->deleteMeta(ExpirablePostModel::LEGACY_FLAG_METADATA_HASH);
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
            // Try to clear the legacy actions if the new one was not found
            if (! $result) {
                $result = $this->cron->clearScheduledAction(HooksAbstract::ACTION_LEGACY_RUN_WORKFLOW, ['postId' => $postId, 'workflow' => 'expire']);
            }
            if (! $result) {
                $result = $this->cron->clearScheduledAction(HooksAbstract::ACTION_LEGACY_EXPIRE_POST1, $postId);
            }
            if (! $result) {
                $result = $this->cron->clearScheduledAction(HooksAbstract::ACTION_LEGACY_EXPIRE_POST2, $postId);
            }

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

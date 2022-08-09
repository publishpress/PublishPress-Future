<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Core\Framework\WordPress\Facade\OptionsFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\PostModel;
use PublishPressFuture\Core\Framework\WordPress\Facade\PostModelFactory;
use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Modules\Debug\DebugInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\RunnerInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface;

class ExpirationRunner implements RunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var SchedulerInterface
     */
    private $scheduler;

    /**
     * @var DebugInterface
     */
    private $debug;

    /**
     * @var OptionsFacade;
     */
    private $options;

    /**
     * @var callable
     */
    private $expirablePostModelFactory;

    /**
     * @var PostModel
     */
    private $postModel;

    /**
     * @var array
     */
    private $postExpirationData;

    /**
     * @param HookableInterface $hooksFacade
     * @param Interfaces\SchedulerInterface $scheduler
     * @param DebugInterface $debug
     * @param OptionsFacade $options
     * @param callable $expirablePostModelFactory
     */
    public function __construct($hooksFacade, $scheduler, $debug, $options, $expirablePostModelFactory)
    {
        $this->hooks = $hooksFacade;
        $this->scheduler = $scheduler;
        $this->debug = $debug;
        $this->options = $options;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    /**
     * @param int $postId
     * @return bool
     * @throws Exceptions\UndefinedActionException
     */
    public function run($postId)
    {
        $postId = (int)$postId;

        $this->debug->log('Called ' . __METHOD__ . ' with postId=' . $postId);

        if (empty($postId)) {
            $this->debug->log('Empty Post ID - exiting');

            return false;
        }

        $expirablePostModelFactory = $this->expirablePostModelFactory;
        $this->postModel = $expirablePostModelFactory($postId);

        if (! $this->postModel->postExists()) {
            $this->debug->log($postId . ' -> Post does not exist - exiting');

            return false;
        }

        $expirationData = new ExpirablePostModel($this->postModel);

        if ($expirationData['enabled'] === false) {
            $this->debug->log($postId . ' -> Post expire data exist but is not activated');

            return false;
        }

        $postType = $this->postModel->getType();

        $expireType = null;
        if (isset($postExpireOptions['expireType'])) {
            $expireType = $postExpireOptions['expireType'];
        }

        // Check for default expire type only if not provided.
        if (empty($expireType)) {
            if ($postType === 'page') {
                $expireType = $this->options->getOption(
                    'expirationdateExpiredPageStatus',
                    ExpirationActionsAbstract::POST_STATUS_TO_DRAFT
                );
            } elseif ($postType === 'post') {
                $expireType = $this->options->getOption(
                    'expirationdateExpiredPostStatus',
                    ExpirationActionsAbstract::POST_STATUS_TO_DRAFT
                );
            }

            /**
             * @deprecated
             */
            $expireType = $this->hooks->applyFilters(
                HooksAbstract::FILTER_LEGACY_CUSTOM_EXPIRATION_TYPE,
                $expireType,
                $postType
            );

            $expireType = $this->hooks->applyFilters(
                HooksAbstract::FILTER_CUSTOM_EXPIRATION_TYPE,
                $expireType,
                $postType
            );
        }

        $expireType = sanitize_key($expireType);

        // Remove KSES - wp_cron runs as an unauthenticated user, which will by default trigger kses filtering,
        // even if the post was published by a admin user.  It is fairly safe here to remove the filter call since
        // we are only changing the post status/meta information and not touching the content.
        kses_remove_filters();

        $expirationLog = [
            'type' => sanitize_text_field($expireType),
            'scheduled_for' => date('Y-m-d H:i:s', $expirationData['date'])
        ];

        $actionMapper = $this->getActionMapper();

        $actionClass = $actionMapper->map($expireType);

        if (! class_exists($actionClass)) {
            $this->debug->log('Action ' . $actionClass . ' is undefined');

            return false;
        }

        $action = $this->getActionByClass($actionClass, $postId, $expirationData);
        $postHasExpired = $action->execute();

        $debugMessage = $postHasExpired ?
            $this->postId . ' -> FAILED ' . $actionClass . ' ' . print_r($expirationData, true)
            : $this->postId . ' -> PROCESSED ' . $actionClass . ' ' . print_r($expirationData, true);
        $this->debug->log($debugMessage);

        $expirationLog = array_merge(
            $expirationLog,
            $action->getExpirationLog()
        );

        $emailEnabled = $this->options->getOption('expirationdateEmailNotification', POSTEXPIRATOR_EMAILNOTIFICATION);

        $expirationLog['email_enabled'] = (bool)$emailEnabled;

        if ($emailEnabled) {
            $expirationLog['email_sent'] = $this->sendEmail($postId, $action, $expirationData);
        }

        if ($postHasExpired) {
            $this->registerExpirationMeta($postId, $expirationLog);
            $this->scheduler->unschedule($postId);
        }
    }

    private function getExpirationType()
    {

    }

    private function registerExpirationMeta($postId, $log)
    {
        $log['expired_on'] = date('Y-m-d H:i:s');

        $this->postModel->addMeta('expiration_log', wp_json_encode($log));
    }

    /**
     * @param int $postId
     * @param ExpirationActionInterface $action
     * @param array $expirationData
     * @return bool
     */
    protected function sendEmail($postId, ExpirationActionInterface $action, $expirationData)
    {
        // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
        $emailBody = $action->getNotificationText();

        if (empty($emailBody)) {
            return false;
        }

        $postType = $this->postModel->getType();
        $postTitle = $this->postModel->getTitle();
        $postPermalink = $this->postModel->getPermalink();

        $emailSubject = sprintf(__('Post Expiration Complete "%s"', 'post-expirator'), $postTitle);
        $emailBody = str_replace('##POSTTITLE##', $postTitle, $emailBody);
        $emailBody = str_replace('##POSTLINK##', $postPermalink, $emailBody);
        $emailBody = str_replace(
            '##EXPIRATIONDATE##',
            get_date_from_gmt(
                gmdate('Y-m-d H:i:s', $expirationData['date']),
                $this->options->getOption('date_format') . ' ' . $this->options->getOption('time_format')
            ),
            $emailBody
        );

        $emailsToSend = array();

        // Get Blog Admins
        $blogAdmins = $this->options->getOption(
            'expirationdateEmailNotificationAdmins',
            POSTEXPIRATOR_EMAILNOTIFICATIONADMINS
        );
        // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
        if ($blogAdmins == 1) {
            $blogUsers = get_users('role=Administrator');
            foreach ($blogUsers as $user) {
                $emailsToSend[] = $user->user_email;
            }
        }

        // Get Global Notification Emails
        $emailsList = $this->options->getOption('expirationdateEmailNotificationList');
        if (! empty($emailsList)) {
            $values = explode(',', $emailsList);
            foreach ($values as $value) {
                $emailsToSend[] = trim($value);
            }
        }

        // Get Post Type Notification Emails
        $defaults = $this->options->getOption('expirationdateDefaults' . ucfirst($postType));
        if (isset($defaults['emailnotification']) && ! empty($defaults['emailnotification'])) {
            $values = explode(',', $defaults['emailnotification']);
            foreach ($values as $value) {
                $emailsToSend[] = trim($value);
            }
        }

        $emailsToSend = array_unique($emailsToSend);
        $emailSent = false;

        if (! empty($emailsToSend)) {
            $this->debug->log($postId . ' -> SENDING EMAIL TO (' . implode(', ', $emailsToSend) . ')');

            // Send Emails
            foreach ($emailsToSend as $email) {
                if (wp_mail(
                    $email,
                    sprintf(__('[%1$s] %2$s'), $this->options->getOption('blogname'), $emailSubject),
                    $emailBody
                )) {
                    $this->debug->log($postId . ' -> EXPIRATION EMAIL SENT (' . $email . ')');

                    $emailSent = true;
                } else {
                    $this->debug->log($postId . ' -> EXPIRATION EMAIL FAILED (' . $email . ')');
                }
            }
        }

        return $emailSent;
    }

    protected function getActionMapper()
    {
        return new ExpirationActionMapper();
    }

    /**
     * @param string $class
     * @param int $postId
     * @param array $expirationData
     * @return ExpirationActionInterface
     */
    protected function getActionByClass($class, $postId, $expirationData)
    {
        return new $class($postId, $this->postModelFactory, $this->debug, $expirationData);
    }

    /**
     * @return array
     */
    private function getPostExpirationData($postId)
    {
        if (empty($this->postExpirationData)) {
            $expireType = $categories = $taxonomyName = $expireStatus = '';

            $expireTypeNew = $this->postModel->getMeta('_expiration-date-type', true);
            if (! empty($expireTypeNew)) {
                $expireType = $expireTypeNew;
            }

            $categoriesNew = $this->postModel->getMeta('_expiration-date-categories', true);
            if (! empty($categoriesNew)) {
                $categories = $categoriesNew;
            }

            $taxonomyNameNew = $this->postModel->getMeta('_expiration-date-taxonomy', true);
            if (! empty($taxonomyNameNew)) {
                $taxonomyName = $taxonomyNameNew;
            }

            $expireStatusNew = $this->postModel->getMeta('_expiration-date-status', true);
            if (! empty($expireStatusNew)) {
                $expireStatus = $expireStatusNew;
            }

            // _expiration-date-options is deprecated when using block editor
            $opts = $this->postModel->getMeta('_expiration-date-options', true);
            if (empty($expireType) && isset($opts['expireType'])) {
                $expireType = $opts['expireType'];
            }

            if (empty($categories)) {
                $categories = isset($opts['category']) ? $opts['category'] : false;
            }

            if (empty($taxonomyName)) {
                $taxonomyName = isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : '';
            }

            $this->postExpirationData = [
                'expireType' => $expireType,
                'category' => $categories,
                'categoryTaxonomy' => $taxonomyName,
                'enabled' => $this->postHasExpirationData($postId),
                'date' => (int)$this->postModel->getMeta('_expiration-date', true),
            ];
        }

        return $this->postExpirationData;
    }

    /**
     * @return bool
     */
    private function postHasExpirationData($postId)
    {
        $statusEnabled = $this->postModel->getMeta('_expiration-date-status', true) === 'saved';
        $date = (int)$this->postModel->getMeta('_expiration-date', true);

        return $statusEnabled && false === empty($date);
    }
}

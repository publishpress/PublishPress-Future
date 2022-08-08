<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirableActionInterface;
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
     * @var \PublishPressFuture\Modules\Debug\Debug
     */
    private $debug;

    /**
     * @var \PublishPressFuture\Core\Framework\WordPress\Facade\OptionsFacade;
     */
    private $options;

    /**
     * @var \PublishPressFuture\Core\Framework\WordPress\Facade\PostModelFactory
     */
    private $postModelFactory;

    /**
     * @param HookableInterface $hooksFacade
     * @param \PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface $scheduler
     * @param \PublishPressFuture\Modules\Debug\Debug $debug
     * @param \PublishPressFuture\Core\Framework\WordPress\Facade\OptionsFacade $options
     * @param \PublishPressFuture\Core\Framework\WordPress\Facade\PostModelFactory $postModelFactory
     */
    public function __construct($hooksFacade, $scheduler, $debug, $options, $postModelFactory)
    {
        $this->hooks = $hooksFacade;
        $this->scheduler = $scheduler;
        $this->debug = $debug;
        $this->options = $options;
        $this->postModelFactory = $postModelFactory;
    }

    /**
     * @param int $postId
     * @return bool
     * @throws \PublishPressFuture\Modules\Expirator\Exceptions\UndefinedActionException
     */
    public function run($postId)
    {
        $postId = (int)$postId;

        if ($this->debug) {
            $this->debug->log('Called ' . __METHOD__ . ' with postId=' . $postId);
        }

        if (empty($postId)) {
            if ($this->debug) {
                $this->debug->log('Empty Post ID - exiting');
            }

            return false;
        }

        $model = $this->postModelFactory->getPostModel($postId);

        if (! $model->postExists()) {
            if ($this->debug) {
                $this->debug->log($postId . ' -> Post does not exist - exiting');
            }

            return false;
        }

        $expirationData = $this->getPostExpirationData($postId);

        if ($expirationData['enabled'] === false) {
            if ($this->debug) {
                $this->debug->log($postId . ' -> Post expire data exist but is not activated');
            }

            return false;
        }

        $postType = $model->getType();

        $expireType = $expireCategory = $expireCategoryTaxonomy = null;

        if (isset($postExpireOptions['expireType'])) {
            $expireType = $postExpireOptions['expireType'];
        }

        if (isset($postExpireOptions['category'])) {
            $expireCategory = $postExpireOptions['category'];
        }

        if (isset($postExpireOptions['categoryTaxonomy'])) {
            $expireCategoryTaxonomy = $postExpireOptions['categoryTaxonomy'];
        }

        // Check for default expire only if not passed in
        if (empty($expireType)) {
            if ($postType === 'page') {
                $expireType = strtolower($this->options->getOption('expirationdateExpiredPageStatus', 'draft'));
            } elseif ($postType === 'post') {
                $expireType = strtolower($this->options->getOption('expirationdateExpiredPostStatus', 'draft'));
            } else {
                $expireType = $this->hooks->applyFilters(
                    'postexpirator_custom_posttype_expire',
                    $expireType,
                    $postType
                );
            }
        }

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
            if ($this->debug) {
                $this->debug->log('Action ' . $actionClass . ' is undefined');
            }

            return false;
        }

        $action = $this->getActionByClass($actionClass, $postId, $expirationData);
        $postHasExpired = $action->execute();

        if ($this->debug) {
            $message = $postHasExpired ?
                $this->postId . ' -> FAILED ' . $actionClass . ' ' . print_r($expirationData, true)
                : $this->postId . ' -> PROCESSED ' . $actionClass . ' ' . print_r($expirationData, true);
            $this->debug->log($message);
        }

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

    private function registerExpirationMeta($postId, $log)
    {
        $model = $this->postModelFactory->getPostModel($postId);

        $log['expired_on'] = date('Y-m-d H:i:s');

        $model->addMeta('expiration_log', wp_json_encode($log));
    }

    /**
     * @param int $postId
     * @param \PublishPressFuture\Modules\Expirator\Interfaces\ExpirableActionInterface $action
     * @param array $expirationData
     * @return bool
     */
    protected function sendEmail($postId, ExpirableActionInterface $action, $expirationData)
    {
        // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
        $emailBody = $action->getNotificationText();

        if (empty($emailBody)) {
            return false;
        }

        $model = $this->postModelFactory->getPostModel($postId);

        $postType = $model->getType();
        $postTitle = $model->getTitle();
        $postPermalink = $model->getPermalink();

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
            if ($this->debug) {
                $this->debug->log($postId . ' -> SENDING EMAIL TO (' . implode(', ', $emailsToSend) . ')');
            }

            // Send Emails
            foreach ($emailsToSend as $email) {
                if (wp_mail(
                    $email,
                    sprintf(__('[%1$s] %2$s'), $this->options->getOption('blogname'), $emailSubject),
                    $emailBody
                )) {
                    if ($this->debug) {
                        $this->debug->log($postId . ' -> EXPIRATION EMAIL SENT (' . $email . ')');
                    }

                    $emailSent = true;
                } elseif ($this->debug) {
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
     * @return \PublishPressFuture\Modules\Expirator\Interfaces\ExpirableActionInterface
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
        $expireType = $categories = $taxonomyName = $expireStatus = '';

        $model = $this->postModelFactory->getPostModel($postId);

        $expireTypeNew = $model->getMeta('_expiration-date-type', true);
        if (! empty($expireTypeNew)) {
            $expireType = $expireTypeNew;
        }

        $categoriesNew = $model->getMeta('_expiration-date-categories', true);
        if (! empty($categoriesNew)) {
            $categories = $categoriesNew;
        }

        $taxonomyNameNew = $model->getMeta('_expiration-date-taxonomy', true);
        if (! empty($taxonomyNameNew)) {
            $taxonomyName = $taxonomyNameNew;
        }

        $expireStatusNew = $model->getMeta('_expiration-date-status', true);
        if (! empty($expireStatusNew)) {
            $expireStatus = $expireStatusNew;
        }

        // _expiration-date-options is deprecated when using block editor
        $opts = $model->getMeta('_expiration-date-options', true);
        if (empty($expireType) && isset($opts['expireType'])) {
            $expireType = $opts['expireType'];
        }

        if (empty($categories)) {
            $categories = isset($opts['category']) ? $opts['category'] : false;
        }

        if (empty($taxonomyName)) {
            $taxonomyName = isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : '';
        }

        return [
            'expireType' => $expireType,
            'category' => $categories,
            'categoryTaxonomy' => $taxonomyName,
            'enabled' => $this->postHasExpirationData($postId),
            'date' => (int)$model->getMeta('_expiration-date', true),
        ];
    }

    /**
     * @return bool
     */
    private function postHasExpirationData($postId)
    {
        $model = $this->postModelFactory->getPostModel($postId);

        $statusEnabled = $model->getMeta('_expiration-date-status', true) === 'saved';
        $date = (int)$model->getMeta('_expiration-date', true);

        return $statusEnabled && false === empty($date);
    }
}

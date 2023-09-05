<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use Closure;
use PublishPress\Future\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPress\Future\Framework\WordPress\Models\PostModel;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPress\Future\Modules\Expirator\PostMetaAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

class ExpirablePostModel extends PostModel
{
    /**
     * @var \PublishPress\Future\Modules\Debug\Debug
     */
    private $debug;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\HooksFacade
     */
    private $hooks;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\UsersFacade
     */
    private $users;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface
     */
    private $scheduler;

    /**
     * @var \PublishPress\Future\Modules\Settings\SettingsFacade
     */
    private $settings;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\EmailFacade
     */
    private $email;

    /**
     * @var string
     */
    private $expirationType = '';

    /**
     * @var string[]
     */
    private $expirationCategories = [];

    /**
     * @var string
     */
    private $expirationTaxonomy = '';

    /**
     * @var bool
     */
    private $expirationIsEnabled = null;

    /**
     * @var int
     */
    private $expirationDate = null;

    /**
     * @var array
     */
    private $expirationOptions = [];

    /**
     * @var \PublishPress\Future\Modules\Expirator\Interfaces\ExpirationActionInterface
     */
    private $expirationActionInstance = null;

    /**
     * @var \Closure
     */
    protected $termModelFactory;

    /**
     * @var \Closure
     */
    protected $expirationActionFactory;
    /**
     * @var int
     */
    private $postId;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Models\ActionArgsModel
     */
    private $actionArgsModel;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Models\DefaultDataModel
     */
    private $defaultDataModel;

    /**
     * @param int $postId
     * @param \PublishPress\Future\Modules\Debug\Debug $debug
     * @param \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade $options
     * @param \PublishPress\Future\Framework\WordPress\Facade\HooksFacade $hooks
     * @param \PublishPress\Future\Framework\WordPress\Facade\UsersFacade $users
     * @param \PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface $scheduler
     * @param \PublishPress\Future\Modules\Settings\SettingsFacade $settings
     * @param \PublishPress\Future\Framework\WordPress\Facade\EmailFacade $email
     * @param \Closure $termModelFactory
     * @param \Closure $expirationActionFactory
     * @param \Closure $actionArgsModelFactory
     * @param \PublishPress\Future\Modules\Expirator\Models\DefaultDataModel $defaultDataModel
     */
    public function __construct(
        $postId,
        $debug,
        $options,
        $hooks,
        $users,
        $scheduler,
        $settings,
        $email,
        $termModelFactory,
        $expirationActionFactory,
        $actionArgsModelFactory,
        $defaultDataModel
    ) {
        parent::__construct($postId, $termModelFactory);

        $this->postId = $postId;
        $this->debug = $debug;
        $this->options = $options;
        $this->hooks = $hooks;
        $this->scheduler = $scheduler;
        $this->users = $users;
        $this->settings = $settings;
        $this->email = $email;
        $this->termModelFactory = $termModelFactory;
        $this->expirationActionFactory = $expirationActionFactory;
        $this->defaultDataModel = $defaultDataModel;

        $this->actionArgsModel = $actionArgsModelFactory();
        $this->actionArgsModel->loadByPostId($this->postId);
    }

    public function getExpirationDataAsArray()
    {
        return [
            'expireType' => $this->getExpirationType(),
            'category' => $this->getExpirationCategoryIDs(),
            'categoryTaxonomy' => $this->getExpirationTaxonomy(),
            'enabled' => $this->isExpirationEnabled(),
            'date' => $this->getExpirationDateAsUnixTime(),
        ];
    }

    /**
     * @return string
     */
    public function getExpirationType()
    {
        if (empty($this->expirationType)) {
            $postType = $this->getPostType();

            try {
                if ($this->getPostStatus() === 'auto-draft') {
                    $settings = $this->settings->getPostTypeDefaults($this->getPostType());

                    if (! empty($settings['expireType'])) {
                        $this->expirationType = $this->hooks->applyFilters(
                            HooksAbstract::FILTER_CUSTOM_EXPIRATION_TYPE,
                            $settings['expireType'],
                            $postType
                        );

                        return $this->expirationType;
                    }
                }
            } catch (NonexistentPostException $e) {
            }

            $options = $this->getExpirationOptions();

            $this->expirationType = isset($options['expireType']) ? $options['expireType'] : '';

            /**
             * @deprecated
             */
            $this->expirationType = $this->hooks->applyFilters(
                HooksAbstract::FILTER_LEGACY_CUSTOM_EXPIRATION_TYPE,
                $this->expirationType,
                $postType
            );

            $this->expirationType = $this->hooks->applyFilters(
                HooksAbstract::FILTER_CUSTOM_EXPIRATION_TYPE,
                $this->expirationType,
                $postType
            );
        }

        return $this->expirationType;
    }

    // FIXME: Rename "category" with "term"
    /**
     * @return int[]
     */
    public function getExpirationCategoryIDs()
    {
        if (empty($this->expirationCategories)) {
            $postType = $this->getPostType();

            try {
                if ($this->getPostStatus() === 'auto-draft') {
                    $settings = $this->settings->getPostTypeDefaults($this->getPostType());

                    if (! empty($settings['terms'])) {
                        $this->expirationCategories = $settings['terms'];

                        return explode(',', $this->expirationCategories);
                    }
                }
            } catch (NonexistentPostException $e) {
            }

            $options = $this->getExpirationOptions();

            $this->expirationCategories = isset($options['category']) ? $options['category'] : [];
            $this->expirationCategories = (array)$this->expirationCategories;

            foreach ($this->expirationCategories as &$categoryID) {
                $categoryID = (int)$categoryID;
            }

            $this->expirationCategories = array_unique($this->expirationCategories);
        }

        return $this->expirationCategories;
    }

    /**
     * @return string[]
     */
    public function getExpirationCategoryNames()
    {
        $categories = $this->getExpirationCategoryIDs();

        $categoryNames = [];

        foreach ($categories as $categoryId) {
            if (empty($categoryId)) {
                continue;
            }

            $termModelFactory = $this->termModelFactory;
            $termModel = $termModelFactory($categoryId);

            $categoryNames[] = $termModel->getName();
        }

        return $categoryNames;
    }

    /**
     * @return string|false
     */
    public function getExpirationTaxonomy()
    {
        if (empty($this->expirationTaxonomy)) {
            try {
                if ($this->getPostStatus() === 'auto-draft') {
                    $settings = $this->settings->getPostTypeDefaults($this->getPostType());

                    if (! empty($settings['taxonomy'])) {
                        return $settings['taxonomy'];
                    }
                }
            } catch (NonexistentPostException $e) {
            }

            $options = $this->getExpirationOptions();

            $this->expirationTaxonomy = isset($options['categoryTaxonomy']) ? $options['categoryTaxonomy'] : '';

            // Default value.
            if (empty($this->expirationTaxonomy)) {
                $defaults = $this->settings->getPostTypeDefaults($this->getPostType());
            }
        }

        return $this->expirationTaxonomy;
    }

    /**
     * @return bool
     */
    public function isExpirationEnabled()
    {
        if (is_null($this->expirationIsEnabled)) {
            try {
                if ($this->getPostStatus() === 'auto-draft') {
                    $settings = $this->settings->getPostTypeDefaults($this->getPostType());

                    if ($settings['autoEnable']) {
                        return true;
                    }
                }
            } catch (NonexistentPostException $e) {
            }

            $this->expirationIsEnabled = $this->scheduler->postIsScheduled($this->postId);
        }

        return (bool)$this->expirationIsEnabled;
    }

    /**
     * @return int|false
     */
    public function getExpirationDateAsUnixTime()
    {
        $this->expirationDate = $this->getExpirationDateString();

        return (int)strtotime($this->expirationDate);
    }

    /**
     * @return int|false
     */
    public function getExpirationDateString($gmt = true)
    {
        if (is_null($this->expirationDate)) {
            try {
                if ($this->getPostStatus() === 'auto-draft') {
                    $defaultData = $this->defaultDataModel->getDefaultExpirationDateForPostType($this->getPostType());

                    if (! empty($defaultData['ts'])) {
                        return $defaultData['ts'];
                    }
                }
            } catch (NonexistentPostException $e) {
            }

            $this->expirationDate = $this->actionArgsModel->getScheduledDate();
        }

        if (! $gmt) {
            return wp_date('Y-m-d H:i:s', $this->getExpirationDateAsUnixTime());
        }

        return $this->expirationDate;
    }

    /**
     * @return array|false
     */
    public function getExpirationOptions()
    {
        if (empty($this->expirationOptions)) {
            // Option _expiration-date-options is deprecated when using block editor.
            $this->expirationOptions = $this->actionArgsModel->getArgs();
        }

        return $this->expirationOptions;
    }

    /**
     * @param bool $force
     * @return bool
     * @throws \PublishPress\Future\Framework\WordPress\Exceptions\NonexistentPostException
     */
    public function expire($force = false)
    {
        $postId = $this->getPostId();

        if (! $this->isExpirationEnabled() && ! $force) {
            $this->debug->log($postId . ' -> Tried to run action but future action is NOT ACTIVATED for the post');

            return false;
        }

        if (! $this->isExpirationEnabled() && $force) {
            $this->debug->log(
                $postId . ' -> Future action is not activated for the post, but $force = true'
            );
        }

        // Stores the post title and post type in the action args for using if the post is deleted later.
        $args = $this->actionArgsModel->getArgs();
        $args['post_title'] = $this->getTitle();
        $args['post_type'] = $this->getPostType();
        $this->actionArgsModel->setArgs($args);
        $this->actionArgsModel->save();

        /*
         * Remove KSES - wp_cron runs as an unauthenticated user, which will by default trigger kses filtering,
         * even if the post was published by a admin user.  It is fairly safe here to remove the filter call since
         * we are only changing the post status/meta information and not touching the content.
         */
        $this->hooks->ksesRemoveFilters();

        $expirationAction = $this->getExpirationAction();

        if (! $expirationAction) {
            $this->debug->log($postId . ' -> Future action cancelled, expiration action is not found');

            return false;
        }

        if (! $expirationAction instanceof ExpirationActionInterface) {
            $this->debug->log($postId . ' -> Future action cancelled, expiration action is not valid');

            return false;
        }

        $result = $expirationAction->execute();

        if (! is_bool($result)) {
            $this->debug->log($postId . ' -> ACTION ' . $expirationAction . ' returned a non boolean value');

            return false;
        }

        if (! $result) {
            $this->debug->log(
                // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
                $postId . ' -> FAILED ' . print_r($this->getExpirationDataAsArray(), true)
            );

            return false;
        }

        $this->debug->log(
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
            $postId . ' -> PROCESSED ' . print_r($this->getExpirationDataAsArray(), true)
        );

        $expirationLog = $expirationAction->getNotificationText() . ' ';

        if (! $this->expirationEmailIsEnabled()) {
            $expirationLog .= __('Email is disabled', 'post-expirator');
        } else {
            $emailSent = $this->sendEmail($expirationAction);
            $expirationLog .= $emailSent
                ? __('Email sent', 'post-expirator') : __('Email not sent', 'post-expirator');
        }

        $this->logOnAction($expirationLog);

        $this->hooks->doAction(HooksAbstract::ACTION_POST_EXPIRED, $postId, $expirationLog);
        $this->hooks->doAction(HooksAbstract::ACTION_UNSCHEDULE_POST_EXPIRATION, $postId);

        $this->deleteExpirationPostMeta();

        return true;
    }

    /**
     * @param string $message
     * @return void
     */
    private function logOnAction($message)
    {
        $log = \ActionScheduler_Logger::instance();
        $log->log($this->actionArgsModel->getCronActionId(), $message);
    }

    private function expirationEmailIsEnabled()
    {
        return (bool)$this->options->getOption(
            'expirationdateEmailNotification',
            POSTEXPIRATOR_EMAILNOTIFICATION
        );
    }

    /**
     * @throws \PublishPress\Future\Framework\WordPress\Exceptions\NonexistentPostException
     */
    public function getExpirationAction()
    {
        if (empty($this->expirationActionInstance)) {
            $factory = $this->expirationActionFactory;
            $actionInstance = $factory(
                $this->getExpirationType(),
                $this
            );

            if ($actionInstance instanceof ExpirationActionInterface) {
                $this->expirationActionInstance = $actionInstance;
            }
        }

        return $this->expirationActionInstance;
    }

    public function getPostType()
    {
        $postType = parent::getPostType();

        if (empty($postType)) {
            $args = $this->actionArgsModel->getArgs();

            if (! empty($args['post_type'])) {
                $postType = $args['post_type'];
            }
        }

        return $postType;
    }

    public function getTitle()
    {
        $title = parent::getTitle();

        if (empty($title)) {
            $args = $this->actionArgsModel->getArgs();

            if (! empty($args['post_title'])) {
                $title = $args['post_title'];
            }
        }

        return $title;
    }


    /**
     * @param \PublishPress\Future\Modules\Expirator\Interfaces\ExpirationActionInterface $expirationAction
     * #[Deprecated]
     * @param string $deprecatedActionNotificationText Deprecated since 3.0.0
     *
     * @return bool
     */
    private function sendEmail(ExpirationActionInterface $expirationAction, string $deprecatedActionNotificationText = '')
    {
        if (! empty($deprecatedActionNotificationText)) {
            _deprecated_argument(
                __METHOD__,
                '3.0.0',
                'Message now comes from ExpirationActionInterface::getNotificationText() instead of from the second parameter'
            );
        }

        // Remove period of the end to not break the sentence.
        $notificationText = rtrim($expirationAction->getNotificationText(), '.');

        $emailBody = sprintf(
            __(
                 '%s. %s on %s. The post link is %s',
                'post-expirator'
            ),
            '##POSTTITLE##',
            $notificationText,
            '##ACTIONDATE##',
            '##POSTLINK##'
        );

        if (empty($emailBody)) {
            $this->debug->log($this->getPostId() . ' -> Tried to send email, but notification text is empty');

            return false;
        }

        $emailSubject = sprintf(
            __('Future Action Complete "%s"', 'post-expirator'),
            $this->getTitle()
        );
        $emailSubject = sprintf(__('[%1$s] %2$s', 'post-expirator'), $this->options->getOption('blogname'), $emailSubject);

        /**
         * Allows changing the email subject.
         * @param string $emailSubject
         * @param ExpirablePostModel $this
         * @param ExpirationActionInterface $expirationAction
         * @return string
         */
        $emailSubject = apply_filters(
            HooksAbstract::FILTER_EXPIRED_EMAIL_SUBJECT,
            $emailSubject,
            $this,
            $expirationAction
        );

        $dateTimeFormat = $this->options->getOption('date_format') . ' ' . $this->options->getOption('time_format');

        $emailBody = str_replace('##POSTTITLE##', $this->getTitle(), $emailBody);
        $emailBody = str_replace('##POSTLINK##', $this->getPermalink(), $emailBody);

        // Replace the expiration date with the action date using the old placeholder
        $emailBody = str_replace(
            '##EXPIRATIONDATE##',
            get_date_from_gmt(
                gmdate('Y-m-d H:i:s', $this->getExpirationDateAsUnixTime()),
                $dateTimeFormat
            ),
            $emailBody
        );
        // Replace the expiration date with the action date using the new placeholder
        $emailBody = str_replace(
            '##ACTIONDATE##',
            get_date_from_gmt(
                gmdate('Y-m-d H:i:s', $this->getExpirationDateAsUnixTime()),
                $dateTimeFormat
            ),
            $emailBody
        );

        /**
         * Allows changing the email body.
         * @param string $emailBody
         * @param ExpirablePostModel $this
         * @param ExpirationActionInterface $expirationAction
         * @return string
         */
        $emailBody = apply_filters(HooksAbstract::FILTER_EXPIRED_EMAIL_BODY, $emailBody, $this, $expirationAction);

        $emailAddresses = array();

        if ($this->settings->getSendEmailNotificationToAdmins()) {
            $blogAdmins = $this->users->getUsers('role=Administrator');

            foreach ($blogAdmins as $user) {
                $emailAddresses[] = $user->user_email;
            }
        }

        // Get Global Notification Emails
        $emailsList = $this->settings->getEmailNotificationAddressesList();

        $emailAddresses = array_merge(
            $emailsList,
            $emailAddresses
        );

        // Get Post Type Notification Emails
        $defaults = $this->settings->getPostTypeDefaults($this->getPostType());

        if (! empty($defaults['emailnotification'])) {
            $values = explode(',', $defaults['emailnotification']);

            foreach ($values as $value) {
                $emailAddresses[] = filter_var(trim($value), FILTER_SANITIZE_EMAIL);
            }
        }

        /**
         * Allows changing the email addresses.
         * @param array<string> $emailAddresses
         * @param ExpirablePostModel $this
         * @param ExpirationActionInterface $expirationAction
         * @return array<string>
         */
        $emailAddresses = apply_filters(
            HooksAbstract::FILTER_EXPIRED_EMAIL_ADDRESSES,
            $emailAddresses,
            $this,
            $expirationAction
        );
        $emailAddresses = array_unique($emailAddresses);

        $emailHeaders = '';
        /**
         * Allows changing the email headers.
         * @param string $emailHeaders
         * @param ExpirablePostModel $this
         * @param ExpirationActionInterface $expirationAction
         * @return string|array<string>
         */
        $emailHeaders = apply_filters(
            HooksAbstract::FILTER_EXPIRED_EMAIL_HEADERS,
            $emailHeaders,
            $this,
            $expirationAction
        );

        $emailAttachments = [];
        /**
         * Allows changing the email attachments.
         * @param array<string> $emailAttachments
         * @param ExpirablePostModel $this
         * @param ExpirationActionInterface $expirationAction
         * @return string|array<string>
         */
        $emailAttachments = apply_filters(
            HooksAbstract::FILTER_EXPIRED_EMAIL_ATTACHMENTS,
            $emailAttachments,
            $this,
            $expirationAction
        );

        $emailSent = false;

        if (! empty($emailAddresses)) {
            $this->debug->log($this->getPostId() . ' -> SENDING EMAIL TO (' . implode(', ', $emailAddresses) . ')');

            // Send each email.
            foreach ($emailAddresses as $email) {
                if (empty($email)) {
                    $this->debug->log($this->getPostId() . ' -> EMPTY EMAIL ADDRESS, SKIPPING');

                    continue;
                }

                $emailSent = $this->email->send(
                    $email,
                    $emailSubject,
                    $emailBody,
                    $emailHeaders,
                    $emailAttachments
                );

                $this->debug->log(
                    sprintf(
                        '%d -> %s (%s)',
                        $this->getPostId(),
                        $emailSent ? 'EXPIRATION EMAIL SENT' : 'EXPIRATION EMAIL FAILED',
                        $email
                    )
                );
            }
        }

        return $emailSent;
    }

    public function deleteExpirationPostMeta()
    {
        $this->deleteMeta(PostMetaAbstract::EXPIRATION_TYPE);
        $this->deleteMeta(PostMetaAbstract::EXPIRATION_STATUS);
        $this->deleteMeta(PostMetaAbstract::EXPIRATION_TAXONOMY);
        $this->deleteMeta(PostMetaAbstract::EXPIRATION_TERMS);
        $this->deleteMeta(PostMetaAbstract::EXPIRATION_TIMESTAMP);
        $this->deleteMeta(PostMetaAbstract::EXPIRATION_DATE_OPTIONS);
    }
}

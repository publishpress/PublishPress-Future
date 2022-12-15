<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Models;

use PublishPressFuture\Framework\WordPress\Models\PostModel;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\HooksAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;

class ExpirablePostModel extends PostModel
{
    /**
     * @var \PublishPressFuture\Modules\Debug\Debug
     */
    private $debug;

    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\HooksFacade
     */
    private $hooks;

    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\UsersFacade
     */
    private $users;

    /**
     * @var \PublishPressFuture\Modules\Expirator\ExpirationActionMapper
     */
    private $expirationActionMapper;

    /**
     * @var \PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface
     */
    private $scheduler;

    /**
     * @var \PublishPressFuture\Modules\Settings\SettingsFacade
     */
    private $settings;

    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\EmailFacade
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
     * @var \PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface
     */
    private $expirationActionInstance;

    /**
     * @var callable
     */
    protected $termModelFactory;

    /**
     * @var callable
     */
    protected $expirationActionFactory;

    /**
     * @param int $postId
     * @param \PublishPressFuture\Modules\Debug\Debug $debug
     * @param \PublishPressFuture\Framework\WordPress\Facade\OptionsFacade $options
     * @param \PublishPressFuture\Framework\WordPress\Facade\HooksFacade $hooks
     * @param \PublishPressFuture\Framework\WordPress\Facade\UsersFacade $users
     * @param \PublishPressFuture\Modules\Expirator\ExpirationActionMapper $expirationActionMapper
     * @param \PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface $scheduler
     * @param \PublishPressFuture\Modules\Settings\SettingsFacade $settings
     * @param \PublishPressFuture\Framework\WordPress\Facade\EmailFacade $email
     * @param callable $termModelFactory
     * @param callable $expirationActionFactory
     */
    public function __construct(
        $postId,
        $debug,
        $options,
        $hooks,
        $users,
        $expirationActionMapper,
        $scheduler,
        $settings,
        $email,
        $termModelFactory,
        $expirationActionFactory
    ) {
        parent::__construct($postId, $termModelFactory);

        $this->debug = $debug;
        $this->options = $options;
        $this->hooks = $hooks;
        $this->expirationActionMapper = $expirationActionMapper;
        $this->scheduler = $scheduler;
        $this->users = $users;
        $this->settings = $settings;
        $this->email = $email;
        $this->termModelFactory = $termModelFactory;
        $this->expirationActionFactory = $expirationActionFactory;
    }

    public function getExpirationDataAsArray()
    {
        return [
            'expireType' => $this->getExpirationType(),
            'category' => $this->getExpirationCategoryIDs(),
            'categoryTaxonomy' => $this->getExpirationTaxonomy(),
            'enabled' => $this->isExpirationEnabled(),
            'date' => $this->getExpirationDate(),
        ];
    }

    /**
     * @return string
     */
    public function getExpirationType()
    {
        if (empty($this->expirationType)) {
            $this->expirationType = $this->getMeta('_expiration-date-type', true);

            $options = $this->getExpirationOptions();

            if (empty($this->expirationType)) {
                $this->expirationType = isset($options['expireType'])
                    ? $options['expireType'] : '';
            }

            $postType = $this->getPostType();

            if (empty($this->expirationType)) {
                switch ($postType) {
                    case 'page':
                        $this->expirationType = $this->options->getOption(
                            'expirationdateExpiredPageStatus',
                            ExpirationActionsAbstract::POST_STATUS_TO_DRAFT
                        );
                        break;
                    case 'post':
                        $this->expirationType = $this->options->getOption(
                            'expirationdateExpiredPostStatus',
                            ExpirationActionsAbstract::POST_STATUS_TO_DRAFT
                        );
                        break;
                }
            }

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

    /**
     * @return int[]
     */
    public function getExpirationCategoryIDs()
    {
        if (empty($this->expirationCategories)) {
            $this->expirationCategories = (array)$this->getMeta('_expiration-date-categories', true);

            $options = $this->getExpirationOptions();

            if (empty($this->expirationCategories)) {
                $this->expirationCategories = isset($options['category']) ? $options['category'] : [];
            }

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
            $this->expirationTaxonomy = $this->getMeta('_expiration-date-taxonomy', true);

            // Legacy value.
            if (empty($this->expirationTaxonomy)) {
                $options = $this->getExpirationOptions();

                $this->expirationTaxonomy = isset($options['categoryTaxonomy']) ? $options['categoryTaxonomy'] : '';
            }

            // Default value.
            if (empty($this->expirationTaxonomy)) {
                $defaults = $this->settings->getPostTypeDefaults($this->getPostType());
                ray($defaults)->green();
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
            $date = $this->getExpirationDate();

            $this->expirationIsEnabled = $this->getMeta('_expiration-date-status', true) === 'saved'
                && ! (empty($date));
        }

        return (bool)$this->expirationIsEnabled;
    }

    /**
     * @return int|false
     */
    public function getExpirationDate()
    {
        if (is_null($this->expirationDate)) {
            $this->expirationDate = $this->getMeta('_expiration-date', true);
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
            $this->expirationOptions = $this->getMeta('_expiration-date-options', true);
        }

        return $this->expirationOptions;
    }

    /**
     * @param bool $force
     * @return bool
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException
     */
    public function expire($force = false)
    {
        $postId = $this->getPostId();

        if (! $this->isExpirationEnabled() && ! $force) {
            $this->debug->log($postId . ' -> Post expiration is not activated for the post');

            return false;
        }

        if (! $this->isExpirationEnabled() && $force) {
            $this->debug->log(
                $postId . ' -> Post expiration is not activated for the post, but $force = true'
            );
        }

        /*
         * Remove KSES - wp_cron runs as an unauthenticated user, which will by default trigger kses filtering,
         * even if the post was published by a admin user.  It is fairly safe here to remove the filter call since
         * we are only changing the post status/meta information and not touching the content.
         */
        $this->hooks->ksesRemoveFilters();

        $expirationAction = $this->getExpirationAction();

        if (! $expirationAction) {
            $this->debug->log(
                $postId . ' -> Post expiration cancelled, action is not found'
            );

            return false;
        }

        $result = $expirationAction->execute();

        if (! is_bool($result)) {
            $this->debug->log($postId . ' -> ACTION  ' . $expirationAction . ' returned a non boolean value');

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

        $expirationPostLogData = $expirationAction->getExpirationLog();
        $expirationPostLogData['expiration_type'] = $this->getExpirationType();
        $expirationPostLogData['scheduled_for'] = $this->getExpirationDate();
        $expirationPostLogData['executed_on'] = date('Y-m-d H:i:s');
        $expirationPostLogData['email_enabled'] = $this->expirationEmailIsEnabled();

        if ($expirationPostLogData['email_enabled']) {
            $expirationPostLogData['email_sent'] = $this->sendEmail($expirationAction);
        }

        $this->addMeta('expiration_log', wp_json_encode($expirationPostLogData));

        do_action(HooksAbstract::ACTION_UNSCHEDULE_POST_EXPIRATION, $postId);

        return true;
    }

    private function expirationEmailIsEnabled()
    {
        return (bool)$this->options->getOption('expirationdateEmailNotification', POSTEXPIRATOR_EMAILNOTIFICATION);
    }

    /**
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException
     */
    private function getExpirationActionClassName()
    {
        return $this->expirationActionMapper->map($this->getExpirationType());
    }

    /**
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException
     */
    private function getExpirationAction()
    {
        if (empty($this->expirationActionInstance)) {
            $actionClassName = $this->getExpirationActionClassName();

            $factory = $this->expirationActionFactory;

            $this->expirationActionInstance = $factory($actionClassName, $this);
        }


        return $this->expirationActionInstance;
    }


    /**
     * @param ExpirationActionInterface $expirationAction
     * @return bool
     */
    private function sendEmail($expirationAction)
    {
        $actionNotificationText = $expirationAction->getNotificationText();

        $emailBody = sprintf(
            __(
                '%1$s (%2$s) has expired at %3$s. %4$s',
                'post-expirator'
            ),
            '##POSTTITLE##',
            '##POSTLINK##',
            '##EXPIRATIONDATE##',
            $actionNotificationText
        );

        if (empty($emailBody)) {
            $this->debug->log($this->getPostId() . ' -> Tried to send email, but notification text is empty');

            return false;
        }

        $emailSubject = sprintf(
            __('Post Expiration Complete "%s"', 'post-expirator'),
            $this->getTitle()
        );

        $dateTimeFormat = $this->options->getOption('date_format') . ' ' . $this->options->getOption('time_format');

        $emailBody = str_replace('##POSTTITLE##', $this->getTitle(), $emailBody);
        $emailBody = str_replace('##POSTLINK##', $this->getPermalink(), $emailBody);
        $emailBody = str_replace(
            '##EXPIRATIONDATE##',
            get_date_from_gmt(
                gmdate('Y-m-d H:i:s', $this->getExpirationDate()),
                $dateTimeFormat
            ),
            $emailBody
        );

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

        $emailAddresses = array_unique($emailAddresses);
        $emailSent = false;

        if (! empty($emailAddresses)) {
            $this->debug->log($this->getPostId() . ' -> SENDING EMAIL TO (' . implode(', ', $emailAddresses) . ')');

            // Send each email.
            foreach ($emailAddresses as $email) {
                $emailSent = $this->email->send(
                    $email,
                    sprintf(__('[%1$s] %2$s'), $this->options->getOption('blogname'), $emailSubject),
                    $emailBody
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
}

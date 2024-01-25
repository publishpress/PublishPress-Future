<?php

namespace PublishPress\FuturePro\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooksAbstract;
use PublishPress\FuturePro\Models\SettingsModel;

use function current_user_can;
use function wp_die;
use function wp_verify_nonce;

defined('ABSPATH') or die('No direct script access allowed.');

class BaseDateController implements ModuleInterface
{
    /**
     * @var \PublishPress\Future\Core\HookableInterface
     */
    private $hooks;

    /**
     * @var \PublishPress\FuturePro\Models\SettingsModel
     */
    private $settingsModel;

    /**
     * @param \PublishPress\Future\Core\HookableInterface $hooks
     */
    public function __construct(HookableInterface $hooks, SettingsModel $settingsModel)
    {
        $this->hooks = $hooks;
        $this->settingsModel = $settingsModel;
    }


    public function initialize()
    {
        $this->hooks->addFilter(
            ExpiratorHooksAbstract::FILTER_ACTION_BASE_DATE_STRING,
            [$this, 'filterActionBaseDateString'],
            10,
            3
        );
    }

    /**
     * @param mixed $baseDateString
     * @param string $postType
     * @param integer|null $postId
     * @return string
     */
    public function filterActionBaseDateString($baseDateString, string $postType, int $postId = null): string
    {
        if (
            $this->settingsModel->getBaseDate() !== SettingsModel::BASE_DATE_PUBLISHING
            || empty($postId)
        ) {
            return $baseDateString;
        }

        $post = get_post($postId);

        if (empty($post) || is_wp_error($post)) {
            return $baseDateString;
        }

        $baseDateString = $post->post_date_gmt;

        return $baseDateString;
    }
}

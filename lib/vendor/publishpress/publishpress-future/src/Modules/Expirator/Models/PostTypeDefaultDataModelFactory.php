<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;
use PublishPress\Future\Modules\Settings\SettingsFacade;

defined('ABSPATH') or die('Direct access not allowed.');

class PostTypeDefaultDataModelFactory
{
    /**
     * @var \PublishPress\Future\Modules\Settings\SettingsFacade
     */
    private $settings;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @param \PublishPress\Future\Modules\Settings\SettingsFacade $settings
     * @param \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade $options
     */
    public function __construct($settings, $options, HooksFacade $hooks)
    {
        $this->settings = $settings;
        $this->options = $options;
        $this->hooks = $hooks;
    }

    public function create(string $postType)
    {
        return new PostTypeDefaultDataModel(
            $this->settings,
            $this->options,
            $postType,
            $this->hooks
        );
    }
}

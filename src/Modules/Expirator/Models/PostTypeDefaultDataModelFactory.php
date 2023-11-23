<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

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
     * @param \PublishPress\Future\Modules\Settings\SettingsFacade $settings
     * @param \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade $options
     */
    public function __construct($settings, $options)
    {
        $this->settings = $settings;
        $this->options = $options;
    }

    public function create(string $postType)
    {
        return new PostTypeDefaultDataModel(
            $this->settings,
            $this->options,
            $postType
        );
    }
}

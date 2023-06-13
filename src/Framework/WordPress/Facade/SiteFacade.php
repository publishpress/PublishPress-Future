<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Framework\WordPress\Facade;

defined('ABSPATH') or die('Direct access not allowed.');

class SiteFacade
{
    /**
     * @return int
     */
    public function getBlogId()
    {
        if ($this->isMultisite()) {
            global $current_blog;

            return (int)$current_blog->blog_id;
        }

        return 0;
    }

    /**
     * @return bool
     */
    public function isMultisite()
    {
        return \is_multisite();
    }
}

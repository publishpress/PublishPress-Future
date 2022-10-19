<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Facade;

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

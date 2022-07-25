<?php

namespace PublishPressFuture\Core\WordPress;

class SiteFacade
{
    /**
     * @return bool
     */
    public function isMultisite()
    {
        return is_multisite();
    }

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
}

<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

defined('ABSPATH') or die('Direct access not allowed.');

class PostTypeModel
{
    /**
     * @var \WP_Post_Type
     */
    private $postType;

    public function load($postType)
    {
        $postType = get_post_type_object($postType);

        if (!$postType) {
            return false;
        }

        $this->postType = $postType;

        return true;
    }

    public function getPostType()
    {
        if (empty($this->postType)) {
            return '';
        }

        return $this->postType->name;
    }

    public function getLabel()
    {
        if (empty($this->postType)) {
            return '';
        }

        return $this->postType->label;
    }

    public function getSingularLabel()
    {
        if (empty($this->postType)) {
            return '';
        }

        return $this->postType->labels->singular_name;
    }
}

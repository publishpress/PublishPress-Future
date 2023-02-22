<?php
/**
 * Copyright (c) 2022-2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings\Models;

class TaxonomiesModel
{
    private function getPostTypes()
    {
        return postexpirator_get_post_types();
    }

    public function getTaxonomiesByPostType($hierarchical = true)
    {
        $postTypes = $this->getPostTypes();

        $taxonomiesByPostType = [];

        foreach ($postTypes as $postType) {
            $taxonomies = get_object_taxonomies($postType, 'object');

            if ($hierarchical) {
                $taxonomies = wp_filter_object_list($taxonomies, array('hierarchical' => true));
            }

            $taxonomiesByPostType[$postType] = $taxonomies;
        }

        return $taxonomiesByPostType;
    }
}

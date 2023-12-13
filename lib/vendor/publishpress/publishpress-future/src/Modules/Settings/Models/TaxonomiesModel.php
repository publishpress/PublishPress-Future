<?php
/**
 * Copyright (c) 2022-2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Settings\Models;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Modules\Expirator\Models\PostTypesModel;

defined('ABSPATH') or die('Direct access not allowed.');

class TaxonomiesModel
{
    private function getPostTypes()
    {
        $container = Container::getInstance();
        $postTypesModel = new PostTypesModel($container);

        return $postTypesModel->getPostTypes();
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

    public function getTermIdByName($taxonomy, $termName)
    {
        $term = get_term_by('name', $termName, $taxonomy);

        if (!$term) {
            return 0;
        }

        return $term->term_id;
    }

    public function createTermAndReturnId($taxonomy, $termName)
    {
        $term = wp_insert_term($termName, $taxonomy);

        if (is_wp_error($term)) {
            return 0;
        }

        return $term['term_id'];
    }

    public function normalizeTermsCreatingIfNecessary($taxonomy, $terms)
    {
        $newTerms = array_filter($terms, function($item) {
            return ! is_numeric($item);
        });

        if (! empty($newTerms)) {
            $existingTerms = array_values(array_filter($terms, 'is_numeric'));

            $newTerms = array_values(array_map('sanitize_text_field', $newTerms));

            $newTerms = array_map(function($newTerm) use ($taxonomy) {
                $newTerm = wp_insert_term($newTerm, $taxonomy);

                if (is_wp_error($newTerm) && $newTerm->get_error_code() === 'term_exists') {
                    return $newTerm->get_error_data('term_exists');
                }

                if (is_wp_error($newTerm)) {
                    // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
                    error_log('PUBLISHPRESS FUTURE: ' . $newTerm->get_error_message());
                    return 0;
                }

                return $newTerm['term_id'];
            }, $newTerms);

            $terms = array_merge($existingTerms, $newTerms);
            $terms = array_map('intval', $terms);
        }

        return $terms;
    }
}

<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Framework\WordPress\Models;

defined('ABSPATH') or die('Direct access not allowed.');

class TermsModel
{
    public function getTermNamesByIdAsString($termIds, $taxonomy)
    {
        $termNames = [];
        foreach ($termIds as $termId) {
            $term = get_term($termId, $taxonomy);
            if ($term instanceof \WP_Term) {
                $termNames[] = $term->name;
            }
        }

        return implode(', ', $termNames);
    }
}

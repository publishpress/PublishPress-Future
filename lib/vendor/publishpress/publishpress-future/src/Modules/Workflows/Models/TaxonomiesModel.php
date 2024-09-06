<?php

namespace PublishPress\Future\Modules\Workflows\Models;

use PublishPress\Future\Modules\Workflows\Interfaces\TaxonomiesModelInterface;

class TaxonomiesModel implements TaxonomiesModelInterface
{
    public function getTaxonomies(): array
    {
        return get_taxonomies([], 'objects');
    }

    public function getTaxonomiesAsOptions(): array
    {
        $taxonomies = $this->getTaxonomies();

        $options = [];

        foreach ($taxonomies as $taxonomy) {
            $options[] = [
                'label' => $taxonomy->label,
                'value' => $taxonomy->name,
            ];
        }

        return $options;
    }
}

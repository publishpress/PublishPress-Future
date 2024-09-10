<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface TaxonomiesModelInterface
{
    public function getTaxonomies(): array;

    public function getTaxonomiesAsOptions(): array;
}

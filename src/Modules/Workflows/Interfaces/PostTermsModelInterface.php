<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface PostTermsModelInterface
{
    public function getAllTerms(): array;

    public function getAllTermsAsOptions(): array;
}

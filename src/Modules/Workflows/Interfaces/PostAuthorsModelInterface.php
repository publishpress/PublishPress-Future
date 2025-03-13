<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface PostAuthorsModelInterface
{
    public function getAuthors(): array;

    public function getAuthorsAsOptions(): array;
}

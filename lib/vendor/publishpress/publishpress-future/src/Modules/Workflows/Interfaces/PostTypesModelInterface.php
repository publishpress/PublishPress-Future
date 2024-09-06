<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface PostTypesModelInterface
{
    public function getPostTypes(): array;

    public function getPostTypesAsOptions(): array;
}

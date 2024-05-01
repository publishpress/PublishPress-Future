<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface PostTypesModelInterface
{
    public function getPostTypes(): array;

    public function getPostTypesAsOptions(): array;
}

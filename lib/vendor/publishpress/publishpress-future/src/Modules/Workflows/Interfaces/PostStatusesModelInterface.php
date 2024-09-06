<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface PostStatusesModelInterface
{
    public function getPostStatuses(): array;

    public function getPostStatusesAsOptions(): array;
}

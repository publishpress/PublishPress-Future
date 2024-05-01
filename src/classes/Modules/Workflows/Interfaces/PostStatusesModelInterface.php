<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface PostStatusesModelInterface
{
    public function getPostStatuses(): array;

    public function getPostStatusesAsOptions(): array;
}

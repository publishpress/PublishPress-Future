<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\PostStatusesModelInterface;

class PostStatusesModel implements PostStatusesModelInterface
{
    public function getPostStatuses(): array
    {
        return get_post_stati([], 'objects');
    }

    public function getPostStatusesAsOptions(): array
    {
        $postStatuses = $this->getPostStatuses();

        $options = [];

        foreach ($postStatuses as $postStatus) {
            $options[] = [
                'label' => $postStatus->label,
                'value' => $postStatus->name,
            ];
        }

        return $options;
    }
}

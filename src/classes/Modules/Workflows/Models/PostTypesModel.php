<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\PostTypesModelInterface;

class PostTypesModel implements PostTypesModelInterface
{
    public function getPostTypes(): array
    {
        return get_post_types([], "objects");
    }

    public function getPostTypesAsOptions(): array
    {
        $postTypes = $this->getPostTypes();

        $options = [];
        $keys = [];

        foreach ($postTypes as $postType) {
            if (in_array($postType->name, $keys)) {
                continue;
            }

            $keys[] = $postType->name;

            $options[] = [
                'label' => $postType->label,
                'value' => $postType->name,
            ];
        }

        return $options;
    }
}

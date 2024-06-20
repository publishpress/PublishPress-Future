<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\DataType;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\DataTypeInterface;

class PostQuery implements DataTypeInterface
{
    public function getName(): string
    {
        return "postQuery";
    }

    public function getLabel(): string
    {
        return __("Post Query", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("A query to select posts", "publishpress-future-pro");
    }
}

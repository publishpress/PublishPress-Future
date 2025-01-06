<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface InputValidatorsInterface
{
    public function validate(array $args): bool;
}

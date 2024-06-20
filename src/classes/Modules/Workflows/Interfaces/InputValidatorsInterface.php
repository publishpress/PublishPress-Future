<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface InputValidatorsInterface
{
    public function validate(array $args): bool;
}

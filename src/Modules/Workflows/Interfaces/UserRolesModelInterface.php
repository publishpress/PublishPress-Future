<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface UserRolesModelInterface
{
    public function getUserRoles(): array;

    public function getUserRolesAsOptions(): array;
}

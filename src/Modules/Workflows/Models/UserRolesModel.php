<?php

namespace PublishPress\Future\Modules\Workflows\Models;

use PublishPress\Future\Modules\Workflows\Interfaces\UserRolesModelInterface;

class UserRolesModel implements UserRolesModelInterface
{
    public function getUserRoles($filtered = false): array
    {
        if ($filtered) {
            return get_editable_roles();
        }

        return wp_roles()->roles;
    }

    public function getUserRolesAsOptions($filtered = false): array
    {
        $userRoles = $this->getUserRoles($filtered);

        $options = [];

        foreach ($userRoles as $userRole) {
            $options[] = [
                'label' => $userRole['name'],
                'value' => $userRole['name'],
            ];
        }

        return $options;
    }
}

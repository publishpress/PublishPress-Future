<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use PublishPress\Future\Modules\Expirator\CapabilitiesAbstract as Capabilities;

class CurrentUserModel extends \PublishPress\Future\Framework\WordPress\Models\CurrentUserModel
{
    public function userCanExpirePosts()
    {
        $user = $this->getUserInstance();

        return is_object($user)
            && $user->has_cap(Capabilities::EXPIRE_POST);
    }
}

<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Models;

use PublishPressFuture\Modules\Expirator\CapabilitiesAbstract as Capabilities;

class CurrentUserModel extends \PublishPressFuture\Framework\WordPress\Models\CurrentUserModel
{
    public function userCanExpirePosts()
    {
        $user = $this->getUserInstance();

        return is_object($user)
            && $user->has_cap(Capabilities::EXPIRE_POST);
    }
}

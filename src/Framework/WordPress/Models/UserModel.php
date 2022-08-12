<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Models;

class UserModel
{
    /**
     * @var int
     */
    private $userId;

    /**
     * @var \WP_User
     */
    private $userInstance;

    /**
     * @param \WP_User|int $user
     */
    public function __construct($user)
    {
        if (is_object($user)) {
            $this->userInstance = $user;
            $this->userId = $user->ID;
        }

        if (is_numeric($user)) {
            $this->userId = (int)$user;
        }
    }

    public function getUserInstance()
    {
        if (empty($this->userInstance)) {
            $this->userInstance = get_user_by('ID', $this->userId);
        }

        return $this->userInstance;
    }

    /**
     * @param string $capability
     * @return bool
     */
    public function hasCapability($capability)
    {
        $userInstance = $this->getUserInstance();

        return $userInstance->has_cap($capability);
    }
}

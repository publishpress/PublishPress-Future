<?php

namespace Steps;

use function sq;

trait Users
{
    /**
     * @Given the user :userLogin exists with role :userRole
     */
    public function theUserExistsWithRole($userLogin, $userRole)
    {
        $userLogin = sq($userLogin);

        $this->factory()->user->create(
            [
                'user_login' => $userLogin,
                'user_pass'  => $userLogin,
                'user_email' => sprintf('%s@example.com', $userLogin),
                'role'       => $userRole
            ]
        );
    }

    /**
     * @Given I am logged in as :userLogin
     */
    public function iAmLoggedInAsUser($userLogin)
    {
        $userLogin = sq($userLogin);

        $this->loginAs($userLogin, $userLogin);

        $user = get_user_by('login', $userLogin);

        global $current_user;
        $current_user = $user;
    }
}

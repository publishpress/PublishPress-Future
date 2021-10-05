<?php

namespace Steps;

trait Users
{
    /**
     * @Given the user :userLogin exists with role :userRole
     */
    public function theUserExistsWithRole($userLogin, $userRole)
    {
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
        $this->loginAs($userLogin, $userLogin);

        $user = get_user_by('login', $userLogin);

        global $current_user;
        $current_user = $user;
    }
}

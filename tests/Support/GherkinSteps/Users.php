<?php

namespace Tests\Support\GherkinSteps;

use function sq;

trait Users
{
    /**
     * @Given the user :userLogin exists with role :userRole
     */
    public function theUserExistsWithRole($userLogin, $userRole)
    {
        $userLogin = sq($userLogin);

        $this->haveUserInDatabase(
            $userLogin,
            $userRole,
            [
                'user_email' => sprintf('%s@example.com', $userLogin),
                'user_pass' => $userLogin,
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

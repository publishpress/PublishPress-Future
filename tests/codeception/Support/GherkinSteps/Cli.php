<?php

namespace Tests\Support\GherkinSteps;

use function sq;

trait Cli
{
    /**
     * @When I run expiring cron for post :postSlug
     */
    public function iRunExpiringCronForPost($postSlug)
    {
        $postId = $this->getPostIdFromSlug(sq($postSlug));

        $this->amOnAdminPage('edit.php?tests-future-expire-id=' . $postId);
    }
}

<?php

namespace Tests\EndToEnd;

use Tests\Support\EndToEndTester;

class MetadatamappingCest
{
    public function test_action_is_scheduled_using_unfiltered_metadata(EndToEndTester $I): void
    {
        $I->loginAsAdmin();

        $postId = $I->havePostInDatabase(['post_title' => 'Test post 2']);
        $I->havePostmetaInDatabase($postId, '_expiration-date', '2050-12-31 23:59:59');
        $I->havePostmetaInDatabase($postId, '_expiration-date-status', 'saved');
        $I->havePostmetaInDatabase($postId, '_expiration-date-type', 'draft');
        $I->havePostmetaInDatabase($postId, '_expiration-date-categories', '');
        $I->havePostmetaInDatabase($postId, '_expiration-date-taxonomy', 'category');
        $I->havePostmetaInDatabase($postId, 'pp_future_metadata_hash', '');
    }
}

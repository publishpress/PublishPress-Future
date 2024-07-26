<?php

namespace Tests\Support\GherkinSteps;

trait Post
{
    public function getPostIdFromLastPost()
    {
        $posts = $this->grabEntriesFromDatabase($this->grabPostsTableName(), ['post_type' => 'ppfuture_workflow']);
        $lastPost = end($posts);

        return $lastPost['ID'];
    }
}

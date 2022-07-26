<?php

namespace PublishPressFuture\Domain\PostExpiration;


use PublishPressFuture\Domain\PostExpiration\Interfaces\ActionableInterface;
use PublishPressFuture\Domain\PostExpiration\Interfaces\ExecutableInterface;

class ExpirationEvent implements ActionableInterface, ExecutableInterface
{
    /**
     * @var int
     */
    private $postId;

    /**
     * Undocumented variable
     *
     * @var ExecutableInterface
     */
    private $action;

    /**
     * @param int $postId
     */
    public function __construct($postId)
    {
        $this->postId = $postId;
    }

    /**
     * @param [type] $action
     * @return void
     */
    public function setAction($action)
    {
        $this->action = $action;
    }

    public function execute()
    {
        $this->action->execute();
    }
}

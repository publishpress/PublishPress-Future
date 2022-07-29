<?php

namespace PublishPressFuture\Modules\Expirator;


class ExpirationEvent implements ActionableInterface, ExpirableActionInterface
{
    /**
     * @var int
     */
    private $postId;

    /**
     * Undocumented variable
     *
     * @var ExpirableActionInterface
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

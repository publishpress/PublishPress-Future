<?php

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentPostException;
use PublishPressFuture\Modules\Expirator\Interfaces\ActionMapperInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel;

class ExpirationActionMapper implements ActionMapperInterface
{
    /**
     * @param array
     */
    private $actionsClassMap;

    /**
     * @var \PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel
     */
    private $actionsModel;

    public function __construct(ExpirationActionsModel $actionsModel)
    {
        $this->actionsModel = $actionsModel;
    }

    /**
     * @return string[]
     */
    private function getActionsClassMap()
    {
        if (empty($this->actionsClassMap)) {
            $this->actionsClassMap = [];
            $actions = $this->actionsModel->getActions();

            foreach ($actions as $action) {
                $this->actionsClassMap[$action[ExpirationActionsModel::ACTION_NAME_ATTRIBUTE]] = $action[ExpirationActionsModel::ACTION_CLASS_ATTRIBUTE];
            }
        }

        return $this->actionsClassMap;
    }

    /**
     * @param string $actionName
     *
     * @return string
     *
     * @throws NonexistentPostException
     */
    public function mapToClass($actionName)
    {
        $actionsClassMap = $this->getActionsClassMap();

        if (! isset($actionsClassMap[$actionName])) {
            throw new NonexistentPostException();
        }

        return $actionsClassMap[$actionName];
    }
}

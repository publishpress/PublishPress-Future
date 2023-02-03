<?php

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Core\DI\ContainerInterface;

class ExpirationActionFactory
{
    /**
     * @var array
     */
    private $expirationActions = [];

    /**
     * @var \PublishPressFuture\Core\DI\ContainerInterface
     */
    private $container;

    /**
     * @param string $servicesPrefix
     */
    private $servicesPrefix;

    public function __construct(ContainerInterface $container, $servicesPrefix)
    {
        $this->container = $container;
        $this->servicesPrefix = $servicesPrefix;
    }

    /**
     * @param string $expirationAction
     * @param \PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel $postModel
     * @return \PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface
     */
    public function getExpirationAction($expirationAction, $postModel)
    {
        $expirationAction = preg_replace('/[^a-z_\.\-0-9]/', '', $expirationAction);

        if (! isset($this->expirationActions[$expirationAction])) {
            $this->expirationActions[$expirationAction] = $this->createExpirationAction(
                $expirationAction,
                $postModel
            );
        }

        return $this->expirationActions[$expirationAction];
    }

    /**
     * @param string $expirationAction
     * @param \PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel $postModel
     * @return \PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface
     */
    private function createExpirationAction($expirationAction, $postModel)
    {
        return $this->container->get($this->servicesPrefix . $expirationAction, $postModel);
    }
}

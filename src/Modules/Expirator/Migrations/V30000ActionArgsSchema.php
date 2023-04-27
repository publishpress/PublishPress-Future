<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Migrations;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\MigrationInterface;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

class V30000ActionArgsSchema implements MigrationInterface
{
    public const HOOK = ExpiratorHooks::ACTION_MIGRATE_CREATE_ACTION_ARGS_SCHEMA;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Interfaces\CronInterface
     */
    private $cronAdapter;

    private $hooksFacade;

    /**
     * @param \PublishPress\Future\Modules\Expirator\Interfaces\CronInterface $cronAdapter
     * @param \PublishPress\Future\Core\HookableInterface $hooksFacade
     */
    public function __construct(
        CronInterface $cronAdapter,
        HookableInterface $hooksFacade
    ) {
        $this->cronAdapter = $cronAdapter;
        $this->hooksFacade = $hooksFacade;

        $this->hooksFacade->addAction(self::HOOK, [$this, 'migrate']);
    }

    public function migrate(): void
    {
        ActionArgsSchema::createTableIfNotExists();
    }
}

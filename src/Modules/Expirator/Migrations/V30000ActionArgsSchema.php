<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Migrations;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Modules\Expirator\HooksAbstract;
use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\MigrationInterface;
use PublishPressFuture\Modules\Expirator\Schemas\ActionArgsSchema;

class V30000ActionArgsSchema implements MigrationInterface
{
    public const HOOK = ExpiratorHooks::ACTION_MIGRATE_CREATE_ACTION_ARGS_SCHEMA;

    /**
     * @var \PublishPressFuture\Modules\Expirator\Interfaces\CronInterface
     */
    private $cronAdapter;

    private $hooksFacade;

    /**
     * @param \PublishPressFuture\Modules\Expirator\Interfaces\CronInterface $cronAdapter
     * @param \PublishPressFuture\Core\HookableInterface $hooksFacade
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

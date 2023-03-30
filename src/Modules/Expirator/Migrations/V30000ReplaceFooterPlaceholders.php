<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Migrations;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\WordPress\Facade\OptionsFacade;
use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\MigrationInterface;
use PublishPressFuture\Modules\Expirator\Schemas\ActionArgsSchema;

class V30000ReplaceFooterPlaceholders implements MigrationInterface
{
    public const HOOK = ExpiratorHooks::ACTION_MIGRATE_WPCRON_EXPIRATIONS;

    private $hooksFacade;
    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\OptionsFacade
     */
    private $optionsFacade;

    /**
     * @param \PublishPressFuture\Core\HookableInterface $hooksFacade
     * @param OptionsFacade $optionsFacade
     */
    public function __construct(
        HookableInterface $hooksFacade,
        OptionsFacade $optionsFacade
    ) {
        $this->hooksFacade = $hooksFacade;
        $this->optionsFacade = $optionsFacade;

        $this->hooksFacade->addAction(self::HOOK, [$this, 'migrate']);
    }

    public function migrate(): void
    {
        // FIXME: Add a flag to know if the migration was already executed. Add a way to force the migration.
        // FIXME: Use the settings facade to get the option, not it directly.
        $currentText = $this->optionsFacade->getOption('expirationdateFooterContents');

        if (empty($currentText)) {
            return;
        }

        $currentText = str_replace('EXPIRATIONFULL', 'ACTIONFULL', $currentText);
        $currentText = str_replace('EXPIRATIONDATE', 'ACTIONDATE', $currentText);
        $currentText = str_replace('EXPIRATIONTIME', 'ACTIONTIME', $currentText);

        $this->optionsFacade->updateOption('expirationdateFooterContents', $currentText);
    }
}

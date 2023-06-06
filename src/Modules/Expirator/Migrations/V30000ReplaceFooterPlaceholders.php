<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Migrations;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\MigrationInterface;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

defined('ABSPATH') or die('Direct access not allowed.');

class V30000ReplaceFooterPlaceholders implements MigrationInterface
{
    const HOOK = ExpiratorHooks::ACTION_MIGRATE_REPLACE_FOOTER_PLACEHOLDERS;

    private $hooksFacade;
    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade
     */
    private $optionsFacade;

    /**
     * @param \PublishPress\Future\Core\HookableInterface $hooksFacade
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

    public function migrate()
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

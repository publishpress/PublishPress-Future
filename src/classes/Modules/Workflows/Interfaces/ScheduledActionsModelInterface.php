<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface ScheduledActionsModelInterface
{
    public function load(int $id);

    public function getHook(): string;
}

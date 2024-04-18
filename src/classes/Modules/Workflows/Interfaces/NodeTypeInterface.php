<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface NodeTypeInterface
{
    public function getType(): string;

    public function getName(): string;

    public function getLabel(): string;

    public function getDescription(): string;

    public function getIcon(): string;

    public function getFrecency(): int;

    public function getCategory(): string;

    public function getSettingsSchema(): array;
}

<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface NodeTypeInterface
{
    public function getElementarType(): string;

    public function getType(): string;

    public function getName(): string;

    public function getLabel(): string;

    public function getDescription(): string;

    public function getIcon(): string;

    public function getFrecency(): int;

    public function getVersion(): int;

    public function getCategory(): string;

    public function getSettingsSchema(): array;

    public function getOutputSchema(): array;

    public function getCSSClass(): string;
}

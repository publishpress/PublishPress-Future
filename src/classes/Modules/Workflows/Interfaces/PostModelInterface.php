<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface PostModelInterface
{
    public function load(int $id): bool;

    public function getId(): int;

    public function getTitle(): string;

    public function getManuallyEnabledWorkflows(): array;
}

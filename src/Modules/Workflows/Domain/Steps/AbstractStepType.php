<?php

/**
 * Base implementation for workflow step type definitions.
 *
 * @package     PublishPress\Future
 * @author      PublishPress
 * @copyright   Copyright (c) 2026, PublishPress
 * @license     GPLv2 or later
 */

namespace PublishPress\Future\Modules\Workflows\Domain\Steps;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

/**
 * Shared defaults for workflow step type definition classes.
 *
 * @since 4.3.1
 */
abstract class AbstractStepType implements StepTypeInterface
{
    /**
     * @since 4.3.1
     */
    abstract public function getElementaryType(): string;

    /**
     * @since 4.3.1
     */
    abstract public function getBaseSlug(): string;

    /**
     * @since 4.3.1
     */
    abstract public function getLabel(): string;

    /**
     * @since 4.3.1
     */
    abstract public function getDescription(): string;

    /**
     * @since 4.3.1
     */
    abstract public function getCategory(): string;

    /**
     * @since 4.3.1
     */
    abstract public function getSettingsSchema(): array;

    /**
     * @since 4.3.1
     */
    abstract public function getValidationSchema(): array;

    /**
     * @since 4.3.1
     */
    public function getReactFlowNodeType(): string
    {
        if ($this->getElementaryType() === StepTypesModel::STEP_TYPE_TRIGGER) {
            return "trigger";
        }

        return "generic";
    }

    /**
     * @since 4.3.1
     */
    public function getIcon(): string
    {
        return "media-document";
    }

    /**
     * @since 4.3.1
     */
    public function getFrecency(): int
    {
        return 1;
    }

    /**
     * @since 4.3.1
     */
    public function getVersion(): int
    {
        return 1;
    }

    /**
     * @since 4.3.1
     */
    public function getStepScopedVariablesSchema(): array
    {
        return [];
    }

    /**
     * @since 4.3.1
     */
    public function getCSSClass(): string
    {
        $elementaryType = $this->getElementaryType();

        if ($elementaryType === StepTypesModel::STEP_TYPE_TRIGGER) {
            return "react-flow__node-genericTrigger";
        }

        if ($elementaryType === StepTypesModel::STEP_TYPE_ACTION) {
            return "react-flow__node-genericAction";
        }

        return "react-flow__node-genericAdvanced";
    }

    /**
     * @since 4.3.1
     */
    public function isProFeature(): bool
    {
        return false;
    }
}

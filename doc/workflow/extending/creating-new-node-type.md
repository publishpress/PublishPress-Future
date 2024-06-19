# Creating a new Node Type

A "Node Type" definition class is used at design time and runtime. It specifies the node's properties such as:

- name
- label
- validation schema
- settings schema
- handle schema
- output schema

## Node Elementary Types

There are three elementary types used to separate different types of nodes.

### Trigger

Type: `trigger`

Steps executed when an event of specific conditions happens to initiate a workflow. An special type of node that do not receive input from other nodes, but support outgoing connections to create the flow of steps that should be executed.

### Action

Type: `action`

Steps that execute tasks.

### Advanced Action

Type: `advanced`

Steps that execute advanced tasks like scheduling, decision-making, and others.

Both action and advanced actions are defined similarly, distinguishing only the concept that advanced actions are more specialized steps in the workflow. Some examples of advanced actions are steps that allow to change flow direction depending of certain conditions, steps that schedule tasks for being executed asynchronously, and so on.

## Node Type Interface

Node types must implement the interface `PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface`.

```php
<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface NodeTypeInterface
{
    /**
     * The name of the node type. This must be unique and must be
     * lower case with no spaces. It must be a compound name
     * initiating with the node elementary type, separated by a slash "/".
     */
    public static function getNodeTypeName(): string;

    /**
     * There are three elementary types: trigger, action, and advanced.
     */
    public function getElementaryType(): string;

    /**
     * There are two types: generic and trigger. This is used by
     * the workflow editor to differentiate between the two for
     * rendering purposes.
     */
    public function getReactFlowNodeType(): string;

    /**
     * The label displayed in the workflow editor.
     */
    public function getLabel(): string;

    /**
     * A brief description of the node type.
     */
    public function getDescription(): string;

    /**
     * The icon displayed in the workflow editor. It accepts dashicons or
     * custom icons. Custom icons must be registered in the plugin.
     */
    public function getIcon(): string;

    /**
     * The frecency is a number that determines the order in which the
     * node type is displayed in the workflow editor in the recent nodes
     * panel. The lower the number, the higher the node type will be displayed.
     */
    public function getFrecency(): int;

    /**
     * The version of the node type. This is used to determine if the
     * node type has been updated and the flow needs to be updated
     * accordingly.
     */
    public function getVersion(): int;

    /**
     * The category of the node type. This is used to group the node types
     * in the workflow editor.
     *
     * The available categories are:
     *  - post
     *  - future
     *  - site
     *  - conditional
     *  - async
     *  - debug
     *  - db-query
     *  - messages
     */
    public function getCategory(): string;

    /**
     * The schema of the settings of the node type. This is used to
     * render the settings panel when the node is selected in the
     * workflow editor.
     */
    public function getSettingsSchema(): array;

    /**
     * The schema of the validation of the node type. This is used to
     * validate the settings and connections of the node in the
     * workflow editor.
     */
    public function getValidationSchema(): array;

    /**
     * The schema of the output of the node type. This is used to
     * specify the output of the node in the workflow editor.
     */
    public function getOutputSchema(): array;

    /**
     * The CSS class of the node type. This is used to apply custom
     * styles to the node in the workflow editor.
     */
    public function getCSSClass(): string;

    /**
     * The base slug of the node type, the prefix. This is used to generate the
     * unique slug of the node type.
     */
    public function getBaseSlug(): string;

    /**
     * The schema of the handles of the node type. This is used to
     * specify the handles of the node in the workflow editor, for
     * source or target handles. The handles are used to connect
     * the nodes in the workflow editor.
     */
    public function getHandleSchema(): array;
}
```

## Node Type Class Example

Here is an example of a node type class for implementing a trigger activated by the action `admin_init`:

```php
<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers; // You can change this to your own namespace

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;

class CoreOnAdminInit implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.admin-init";
    }

    public function getElementaryType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
    }

    public function getReactFlowNodeType(): string
    {
        return "trigger";
    }

    public function getBaseSlug(): string
    {
        return "onAdminInit";
    }

    public function getLabel(): string
    {
        return __("On Admin Init", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This trigger activates upon the initialization of the admin site.", "publishpress-future-pro");
    }

    public function getIcon(): string
    {
        return "media-document";
    }

    public function getFrecency(): int
    {
        return 1;
    }

    public function getVersion(): int
    {
        return 1;
    }

    public function getCategory(): string
    {
        return "site";
    }

    public function getSettingsSchema(): array
    {
        return [];
    }

    public function getValidationSchema(): array
    {
        return [
            "connections" => [
                "rules" => [
                    [
                        "rule" => "hasOutgoingConnection",
                    ],
                ]
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericTrigger";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [],
            "source" => [
                [
                    "id" => "output",
                    "left" => "50%",
                    "label" => __("Next", "publishpress-future-pro"),
                ]
            ]
        ];
    }
}
```

The schemas for settings, validation, output, and handles will be described in more detail in the next sections.

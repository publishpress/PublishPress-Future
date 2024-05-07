# Defining a workflow step

## Register the node type

Create a class that implements `NodeTypeInterface` and put it in the folder `src/classes/Modules/Workflows/Domain/NodeTypes`.

The workflow engine supports 3 types of steps:

- `Trigger`: A step that initiates the workflow.
- `Action`: A step that performs an action.
- `Flow`: A step that controls the flow of the workflow.

Add your new class inside the specific subfolder for the type of step you are creating.

## Register the node type in the model

Edit the class `PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel` and add the new node type to one of the methods: `getDefaultTriggers`, `getDefaultActions`, or `getDefaultFlows`.

## Create the node runner

Create a class that implements `NodeRunnerInterface` and put it in the folder `src/classes/Modules/Workflows/Domain/Engine/NodeRunners`.


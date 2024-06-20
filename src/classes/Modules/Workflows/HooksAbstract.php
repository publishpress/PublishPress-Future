<?php

namespace PublishPress\FuturePro\Modules\Workflows;

abstract class HooksAbstract
{
    public const FILTER_WORKFLOW_TRIGGER_NODES = 'publishpressfuturepro_workflow_trigger_nodes';
    public const FILTER_WORKFLOW_ACTION_NODES = 'publishpressfuturepro_workflow_action_nodes';
    public const FILTER_WORKFLOW_ADVANCED_NODES = 'publishpressfuturepro_workflow_advanced_nodes';
    public const FILTER_WORKFLOW_NODE_CATEGORIES = 'publishpressfuturepro_workflow_node_categories';
    public const ACTION_WORKFLOW_ENGINE_LOAD = 'publishpressfuturepro_workflow_engine_load';
    public const ACTION_WORKFLOW_ENGINE_START = 'publishpressfuturepro_workflow_engine_start';
    public const ACTION_SAVE_POST = 'save_post';
    public const ACTION_POST_UPDATED = 'post_updated';
    public const ACTION_INIT = 'init';
    public const ACTION_ADMIN_INIT = 'admin_init';
    public const ACTION_TRIGGER_FIRED = 'publishpressfuturepro_workflow_trigger_fired_';
    public const FILTER_WORKFLOW_ENGINE_MAP_TRIGGER = 'publishpressfuturepro_workflow_engine_map_trigger';
    public const ACTION_EXECUTE_NODE = 'publishpressfuturepro_workflow_execute_node';
    public const ACTION_ASYNC_EXECUTE_NODE = 'publishpressfuturepro_workflow_async_execute_node';
    public const ACTION_UNSCHEDULE_RECURRING_NODE_ACTION =
        'publishpressfuturepro_workflow_unschedule_recurring_node_action';
    public const ACTION_LEGACY_ACTION = 'publishpressfuturepro_legacy_action';
    public const ACTION_RENDER_WORKFLOW_EDITOR_PAGE = 'publishpressfuturepro_render_workflow_editor_page';
    public const ACTION_MANUALLY_TRIGGERED_WORKFLOW = 'publishpressfuturepro_manually_triggered_workflow';
    public const FILTER_ACTION_SCHEDULER_LIST_COLUMN_ARGS = 'action_scheduler_list_table_column_args';
}

<?php

namespace PublishPress\FuturePro\Modules\Workflows;

abstract class HooksAbstract
{
    public const ACTION_WORKFLOW_ENGINE_LOAD = 'publishpressfuturepro_workflow_engine_load';
    public const ACTION_WORKFLOW_ENGINE_START = 'publishpressfuturepro_workflow_engine_start';
    public const ACTION_SAVE_POST = 'save_post';
    public const ACTION_POST_UPDATED = 'post_updated';
    public const ACTION_INIT = 'init';
    public const ACTION_ADMIN_INIT = 'admin_init';
    public const ACTION_TRIGGER_FIRED = 'publishpressfuturepro_workflow_trigger_fired_';
    public const ACTION_EXECUTE_NODE = 'publishpressfuturepro_workflow_execute_node';
    public const ACTION_ASYNC_EXECUTE_NODE = 'publishpressfuturepro_workflow_async_execute_node';
    public const ACTION_UNSCHEDULE_RECURRING_NODE_ACTION =
        'publishpressfuturepro_workflow_unschedule_recurring_node_action';
    public const ACTION_LEGACY_ACTION = 'publishpressfuturepro_legacy_action';
    public const ACTION_RENDER_WORKFLOW_EDITOR_PAGE = 'publishpressfuturepro_render_workflow_editor_page';
    public const ACTION_MANUALLY_TRIGGERED_WORKFLOW = 'publishpressfuturepro_manually_triggered_workflow';
    public const ACTION_UPDATE_WORKFLOW_STATUS = 'publishpressfuturepro_update_workflow_status';
    public const ACTION_MIGRATE_WORKFLOW_SCHEDULED_STEPS_SCHEMA =
        'publishpressfuturepro_migrate_workflow_scheduled_steps_schema';
    public const ACTION_CLEANUP_ORPHAN_WORKFLOW_ARGS = 'publishpressfuturepro_cleanup_orphan_workflow_args';
    public const ACTION_SCHEDULER_STORED_ACTION = 'action_scheduler_stored_action';
    public const ACTION_SCHEDULER_BEGIN_EXECUTE = 'action_scheduler_begin_execute';
    public const ACTION_WORKFLOW_SAVED = 'publishpressfuture_workflow_saved';
    public const ACTION_WORKFLOW_UPDATED = 'publishpressfuture_workflow_updated';
    public const ACTION_WORKFLOW_INSERTED = 'publishpressfuture_workflow_inserted';
    public const ACTION_WORKFLOW_UNPUBLISHED = 'publishpressfuture_workflow_unpublished';
    public const ACTION_WORKFLOW_PUBLISHED = 'publishpressfuture_workflow_published';
    public const ACTION_WORKFLOW_DELETED = 'publishpressfuture_workflow_deleted';
    public const FILTER_WORKFLOW_TRIGGER_NODES = 'publishpressfuturepro_workflow_trigger_nodes';
    public const FILTER_WORKFLOW_ACTION_NODES = 'publishpressfuturepro_workflow_action_nodes';
    public const FILTER_WORKFLOW_ADVANCED_NODES = 'publishpressfuturepro_workflow_advanced_nodes';
    public const FILTER_WORKFLOW_NODE_CATEGORIES = 'publishpressfuturepro_workflow_node_categories';
    public const FILTER_WORKFLOW_ENGINE_MAP_TRIGGER = 'publishpressfuturepro_workflow_engine_map_trigger';
    public const FILTER_ACTION_SCHEDULER_LIST_COLUMN_ARGS = 'action_scheduler_list_table_column_args';
    public const FILTER_IGNORE_SAVE_POST_EVENT = 'publishpressfuturepro_ignore_save_post_event';
    public const FILTER_ORPHAN_WORKFLOW_ARGS_CLEANUP_INTERVAL =
        'publishpressfuturepro_orphan_workflow_args_cleanup_interval';
    public const FILTER_CRON_SCHEDULE_RUNNER_TRANSIENT_TIMEOUT =
        'publishpressfuturepro_cron_schedule_runner_transient_timeout';
}

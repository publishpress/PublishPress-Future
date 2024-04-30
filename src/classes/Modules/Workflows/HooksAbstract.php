<?php

namespace PublishPress\FuturePro\Modules\Workflows;

abstract class HooksAbstract {
    const FILTER_WORKFLOW_TRIGGERS = 'publishpressfuturepro_workflow_triggers';
    const FILTER_WORKFLOW_ACTIONS = 'publishpressfuturepro_workflow_actions';
    const FILTER_WORKFLOW_FLOWS = 'publishpressfuturepro_workflow_flows';
    const FILTER_WORKFLOW_NODE_CATEGORIES = 'publishpressfuturepro_workflow_node_categories';
    const ACTION_WORKFLOW_ENGINE_LOAD = 'publishpressfuturepro_workflow_engine_load';
    const ACTION_WORKFLOW_ENGINE_START = 'publishpressfuturepro_workflow_engine_start';
    const ACTION_SAVE_POST = 'save_post';
    const ACTION_POST_UPDATED = 'post_updated';
    const ACTION_INIT = 'init';
    const ACTION_ADMIN_INIT = 'admin_init';
    const ACTION_TRIGGER_FIRED = 'publishpressfuturepro_workflow_trigger_fired_';
    const FILTER_WORKFLOW_ENGINE_MAP_TRIGGER = 'publishpressfuturepro_workflow_engine_map_trigger';
    const ACTION_EXECUTE_NODE = 'publishpressfuturepro_workflow_execute_node';
    const ACTION_LEGACY_ACTION = 'publishpressfuturepro_legacy_action';
}

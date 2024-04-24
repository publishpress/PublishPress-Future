<?php

namespace PublishPress\FuturePro\Modules\Workflows;

abstract class HooksAbstract {
    const FILTER_WORKFLOW_TRIGGERS = 'publishpressfuturepro_workflow_triggers';
    const FILTER_WORKFLOW_ACTIONS = 'publishpressfuturepro_workflow_actions';
    const FILTER_WORKFLOW_FLOWS = 'publishpressfuturepro_workflow_flows';
    const FILTER_WORKFLOW_NODE_CATEGORIES = 'publishpressfuturepro_workflow_node_categories';
    const ACTION_WORKFLOW_ENGINE_LOAD = 'publishpressfuturepro_workflow_engine_load';
    const ACTION_WORKFLOW_ENGINE_START = 'publishpressfuturepro_workflow_engine_start';
}

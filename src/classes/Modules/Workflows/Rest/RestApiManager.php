<?php

namespace PublishPress\FuturePro\Modules\Workflows\Rest;

use WP_Error;
use WP_REST_Server;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\RestApiManagerInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;

class RestApiManager implements RestApiManagerInterface
{
    const API_BASE = 'publishpress-future';

    const ERROR_WORKFLOW_NOT_FOUND = 'publishpressfuturepro_workflow_not_found';

    public function register()
    {
        $this->registerV1();
    }

    private function registerV1()
    {
        register_rest_route(
            self::API_BASE . '/v1',
            '/workflows/(?P<id>\d+)',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getWorkflow'],
                'permission_callback' => function () {
                    return true;
                },
                'args' => [
                    'id' => [
                        'description' => __('The ID of the workflow', 'publishpress-future-pro'),
                        'type' => 'integer',
                        'required' => true
                    ]
                ],
                'show_in_index' => false,
                'show_in_rest' => true,
            ]
        );
    }

    public function getWorkflow($request)
    {
        $id = (int) $request['id'];

        $workflowModel = new WorkflowModel();
        $workflowExists = $workflowModel->load($id);

        if (! $workflowExists) {
            return new WP_Error(
                self::ERROR_WORKFLOW_NOT_FOUND,
                __('Workflow not found', 'publishpress-future-pro'),
                ['status' => 404]
            );
        }

        return rest_ensure_response([
            'id' => $id,
            'name' => $workflowModel->getName(),
            'description' => $workflowModel->getDescription(),
            'flow' => $workflowModel->getFlow(),
        ]);
    }

    public function getWorkflowPermissions($request)
    {
        return true;
    }
}

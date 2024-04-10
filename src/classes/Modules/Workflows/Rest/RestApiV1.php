<?php

namespace PublishPress\FuturePro\Modules\Workflows\Rest;

use WP_Error;
use WP_REST_Server;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\RestApiManagerInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;

class RestApiV1 implements RestApiManagerInterface
{
    const ERROR_WORKFLOW_NOT_FOUND = 'publishpressfuturepro_workflow_not_found';

    const BASE_PATH = RestApiManager::API_BASE . '/v1';

    public function register()
    {
        register_rest_route(
            self::BASE_PATH,
            '/workflows/(?P<id>\d+)',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getWorkflow'],
                'permission_callback' => [$this, 'getWorkflowPermissions'],
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

        register_rest_route(
            self::BASE_PATH,
            '/workflows',
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'createWorkflow'],
                'permission_callback' => [$this, 'createWorkflowPermissions'],
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
            'title' => $workflowModel->getTitle(),
            'description' => $workflowModel->getDescription(),
            'flow' => $workflowModel->getFlow(),
            'postStatus' => $workflowModel->getPostStatus(),
        ]);
    }

    public function createWorkflow($request)
    {
        $workflowModel = new WorkflowModel();
        $workflowModel->createNew();

        return rest_ensure_response([
            'id' => $workflowModel->getId(),
            'title' => $workflowModel->getTitle(),
            'description' => $workflowModel->getDescription(),
            'flow' => $workflowModel->getFlow(),
            'postStatus' => $workflowModel->getPostStatus(),
        ]);

    }

    public function getWorkflowPermissions($request)
    {
        return current_user_can('edit_posts');
    }

    public function createWorkflowPermissions($request)
    {
        return current_user_can('edit_posts');
    }
}

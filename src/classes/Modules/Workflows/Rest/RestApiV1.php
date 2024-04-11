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

    const PERMISSION_READ = 'edit_posts';

    const PERMISSION_CREATE = 'edit_posts';

    const PERMISSION_UPDATE = 'edit_posts';

    const PERMISSION_DELETE = 'edit_posts';

    public function register()
    {
        // Read a single workflow
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

        // Create a new workflow
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

        // Update a workflow
        register_rest_route(
            self::BASE_PATH,
            '/workflows/(?P<id>\d+)',
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'updateWorkflow'],
                'permission_callback' => [$this, 'updateWorkflowPermissions'],
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

        // Delete a workflow
        register_rest_route(
            self::BASE_PATH,
            '/workflows/(?P<id>\d+)',
            [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => [$this, 'deleteWorkflow'],
                'permission_callback' => [$this, 'deleteWorkflowPermissions'],
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
            'id' => $workflowModel->getId(),
            'title' => $workflowModel->getTitle(),
            'description' => $workflowModel->getDescription(),
            'flow' => $workflowModel->getFlow(),
            'status' => $workflowModel->getStatus(),
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
            'status' => $workflowModel->getStatus(),
        ]);

    }

    public function updateWorkflow($request)
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

        if (isset($request['title'])) {
            $workflowModel->setTitle($request['title']);
        }

        if (isset($request['description'])) {
            $workflowModel->setDescription($request['description']);
        }

        if (isset($request['flow'])) {
            $workflowModel->setFlow($request['flow']);
        }

        if (isset($request['status'])) {
            $workflowModel->setStatus($request['status']);
        }

        $workflowModel->save();

        return rest_ensure_response([
            'id' => $workflowModel->getId(),
            'title' => $workflowModel->getTitle(),
            'description' => $workflowModel->getDescription(),
            'flow' => $workflowModel->getFlow(),
            'status' => $workflowModel->getStatus(),
        ]);
    }

    public function deleteWorkflow($request)
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

        $workflowModel->delete();

        return rest_ensure_response(true);
    }

    public function getWorkflowPermissions($request)
    {
        return current_user_can(self::PERMISSION_READ);
    }

    public function createWorkflowPermissions($request)
    {
        return current_user_can(self::PERMISSION_CREATE);
    }

    public function updateWorkflowPermissions($request)
    {
        return current_user_can(self::PERMISSION_UPDATE);
    }

    public function deleteWorkflowPermissions($request)
    {
        return current_user_can(self::PERMISSION_DELETE);
    }
}

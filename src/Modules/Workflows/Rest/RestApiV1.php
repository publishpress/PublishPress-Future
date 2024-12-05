<?php

namespace PublishPress\Future\Modules\Workflows\Rest;

use PublishPress\Future\Modules\Settings\SettingsFacade;
use WP_Error;
use WP_REST_Server;
use PublishPress\Future\Modules\Workflows\Interfaces\RestApiManagerInterface;
use PublishPress\Future\Modules\Workflows\Models\PostModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;

class RestApiV1 implements RestApiManagerInterface
{
    public const ERROR_WORKFLOW_NOT_FOUND = 'publishpressfuture_workflow_not_found';

    public const BASE_PATH = RestApiManager::API_BASE . '/v1';

    public const PERMISSION_READ = 'edit_posts';

    public const PERMISSION_CREATE = 'edit_posts';

    public const PERMISSION_UPDATE = 'edit_posts';

    public const PERMISSION_DELETE = 'edit_posts';

    /**
     * @var SettingsFacade
     */
    private SettingsFacade $settingsFacade;

    public function __construct(SettingsFacade $settingsFacade)
    {
        $this->settingsFacade = $settingsFacade;
    }

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
                        'description' => __('The ID of the workflow', 'post-expirator'),
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
                        'description' => __('The ID of the workflow', 'post-expirator'),
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
                        'description' => __('The ID of the workflow', 'post-expirator'),
                        'type' => 'integer',
                        'required' => true
                    ]
                ],
                'show_in_index' => false,
                'show_in_rest' => true,
            ]
        );

        // Get all terms for a taxonomy
        register_rest_route(
            self::BASE_PATH,
            '/terms/(?P<taxonomy>[a-zA-Z0-9_-]+)',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getTaxonomyTerms'],
                'permission_callback' => [$this, 'getTaxonomyTermsPermissions'],
                'args' => [
                    'taxonomy' => [
                        'description' => __('The taxonomy name', 'post-expirator'),
                        'type' => 'string',
                        'required' => true
                    ]
                ],
                'show_in_index' => false,
                'show_in_rest' => true,
            ]
        );

        // Get the post workflow settings
        register_rest_route(
            self::BASE_PATH,
            '/posts/workflow-settings/(?P<post>\d+)',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getPostWorkflowSettings'],
                'permission_callback' => [$this, 'getPostWorkflowSettingsPermissions'],
                'args' => [
                    'post' => [
                        'description' => __('The post ID', 'post-expirator'),
                        'type' => 'integer',
                        'required' => true
                    ]
                ],
                'show_in_index' => false,
                'show_in_rest' => true,
            ]
        );
    }

    private function getWorkflowForResponse(WorkflowModel $workflowModel)
    {
        return [
            'id' => $workflowModel->getId(),
            'title' => $workflowModel->getTitle(),
            'description' => $workflowModel->getDescription(),
            'flow' => $workflowModel->getFlow(),
            'status' => $workflowModel->getStatus(),
            'debugRayShowQueries' => $workflowModel->isDebugRayShowQueriesEnabled(),
            'debugRayShowEmails' => $workflowModel->isDebugRayShowEmailsEnabled(),
            'debugRayShowWordPressErrors' => $workflowModel->isDebugRayShowWordPressErrorsEnabled(),
            'debugRayShowCurrentRunningStep' => $workflowModel->isDebugRayShowCurrentRunningStepEnabled(),
        ];
    }

    public function getWorkflow($request)
    {
        $id = (int) $request['id'];

        $workflowModel = new WorkflowModel();
        $workflowExists = $workflowModel->load($id);

        if (! $workflowExists) {
            return new WP_Error(
                self::ERROR_WORKFLOW_NOT_FOUND,
                __('Workflow not found', 'post-expirator'),
                ['status' => 404]
            );
        }

        return rest_ensure_response($this->getWorkflowForResponse($workflowModel));
    }

    public function createWorkflow($request)
    {
        $workflowModel = new WorkflowModel();
        $workflowModel->createNew();

        return rest_ensure_response($this->getWorkflowForResponse($workflowModel));
    }

    public function updateWorkflow($request)
    {
        $id = (int) $request['id'];

        $workflowModel = new WorkflowModel();
        $workflowExists = $workflowModel->load($id);

        if (! $workflowExists) {
            return new WP_Error(
                self::ERROR_WORKFLOW_NOT_FOUND,
                __('Workflow not found', 'post-expirator'),
                ['status' => 404]
            );
        }

        $isPublishing = $workflowModel->getStatus() !== 'publish' && $request['status'] === 'publish';
        $isUnpublishing = $workflowModel->getStatus() === 'publish' && $request['status'] !== 'publish';

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

        if (isset($request['screenshot']) && $this->settingsFacade->getWorkflowScreenshotStatus()) {
            $workflowModel->setScreenshotFromBase64($request['screenshot']);
        }

        if (isset($request['debugRayShowQueries'])) {
            $workflowModel->setDebugRayShowQueries($request['debugRayShowQueries']);
        }

        if (isset($request['debugRayShowEmails'])) {
            $workflowModel->setDebugRayShowEmails($request['debugRayShowEmails']);
        }

        if (isset($request['debugRayShowWordPressErrors'])) {
            $workflowModel->setDebugRayShowWordPressErrors($request['debugRayShowWordPressErrors']);
        }

        if (isset($request['debugRayShowCurrentRunningStep'])) {
            $workflowModel->setDebugRayShowCurrentRunningStep($request['debugRayShowCurrentRunningStep']);
        }

        if ($isPublishing) {
            $workflowModel->publish();
        } elseif ($isUnpublishing) {
            $workflowModel->unpublish();
        } else {
            $workflowModel->save();
        }

        return rest_ensure_response($this->getWorkflowForResponse($workflowModel));
    }

    public function deleteWorkflow($request)
    {
        $id = (int) $request['id'];

        $workflowModel = new WorkflowModel();
        $workflowExists = $workflowModel->load($id);

        if (! $workflowExists) {
            return new WP_Error(
                self::ERROR_WORKFLOW_NOT_FOUND,
                __('Workflow not found', 'post-expirator'),
                ['status' => 404]
            );
        }

        $workflowModel->delete();

        return rest_ensure_response(true);
    }

    public function getTaxonomyTerms($request)
    {
        $taxonomy = $request['taxonomy'];

        $terms = get_terms([
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
        ]);

        $terms = array_map(function ($term) {
            return [
                'id' => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
            ];
        }, $terms);

        return rest_ensure_response($terms);
    }

    public function getPostWorkflowSettings($request)
    {
        $postId = (int) $request['post'];

        $postModel = new PostModel();
        $postModel->load($postId);

        $workflowsWithManualTrigger = $postModel->getValidWorkflowsWithManualTrigger($postId);
        $manuallyEnabledWorkflows = $postModel->getManuallyEnabledWorkflows();

        return rest_ensure_response([
            'workflowsWithManualTrigger' => $workflowsWithManualTrigger,
            'manuallyEnabledWorkflows' => $manuallyEnabledWorkflows,
        ]);
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

    public function getTaxonomyTermsPermissions($request)
    {
        return current_user_can(self::PERMISSION_READ);
    }

    public function getPostWorkflowSettingsPermissions($request)
    {
        return current_user_can(self::PERMISSION_READ);
    }
}

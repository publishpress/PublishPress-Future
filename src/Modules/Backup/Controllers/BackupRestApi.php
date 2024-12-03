<?php

namespace PublishPress\Future\Modules\Backup\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowsModel;
use WP_REST_Request;
use WP_REST_Response;

class BackupRestApi implements InitializableInterface
{
    private HookableInterface $hooks;

    private string $pluginVersion;

    public function __construct(HookableInterface $hooks, string $pluginVersion)
    {
        $this->hooks = $hooks;
        $this->pluginVersion = $pluginVersion;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_REST_API_INIT,
            [$this, 'registerRestRoutes']
        );
    }

    public function registerRestRoutes()
    {
        $apiNamespace = 'publishpress-future/v1';

        register_rest_route(
            $apiNamespace,
            '/backup/workflows',
            [
                'methods' => 'GET',
                'callback' => [$this, 'getWorkflows'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]
        );

        register_rest_route(
            $apiNamespace,
            '/backup/export',
            [
                'methods' => 'POST',
                'callback' => [$this, 'exportBackup'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
                'args' => [
                    'exportActionWorkflows' => [
                        'type' => 'boolean',
                    ],
                    'exportActionSettings' => [
                        'type' => 'boolean',
                    ],
                    'workflows' => [
                        'type' => 'array',
                    ],
                    'includeScreenshots' => [
                        'type' => 'boolean',
                    ],
                ],
            ]
        );
    }

    public function getWorkflows(WP_REST_Request $request)
    {
        /** @var WorkflowsModel $workflowsModel */
        $workflowsModel = new WorkflowsModel();

        $workflowsIds = $workflowsModel->getAllWorkflowsIds();

        $workflows = [];

        foreach ($workflowsIds as $workflowId) {
            $workflow = new WorkflowModel();
            $workflow->load($workflowId);

            $workflows[] = [
                'id' => $workflow->getId(),
                'title' => $workflow->getTitle(),
                'status' => $workflow->getStatus(),
            ];
        }

        return new WP_REST_Response(
            [
                'workflows' => $workflows,
            ],
            200
        );
    }

    public function exportBackup(WP_REST_Request $request)
    {
        $exportActionWorkflows = $request->get_param('exportActionWorkflows');
        $exportActionSettings = $request->get_param('exportActionSettings');
        $selectedWorkflows = $request->get_param('workflows');
        $includeScreenshots = $request->get_param('includeScreenshots');
        if (! $exportActionWorkflows && ! $exportActionSettings) {
            return new \WP_Error('invalid_request', 'Invalid request');
        }

        $exportData = [
            'version' => $this->pluginVersion,
            'date' => date('Y-m-d H:i:s'),
        ];

        if ($exportActionWorkflows) {
            $exportData['workflows'] = $this->exportWorkflows($selectedWorkflows, $includeScreenshots);
        }

        if ($exportActionSettings) {
            $exportData['settings'] = $this->exportSettings();
        }

        return [
            'message' => 'Exporting backup',
            'data' => $exportData,
        ];
    }

    private function exportWorkflows(array $selectedWorkflowIds = [], bool $includeScreenshots = false)
    {
        /** @var WorkflowsModel $workflowsModel */
        $workflowsModel = new WorkflowsModel();

        $workflowIds = $workflowsModel->getAllWorkflowsIds();

        $workflows = [];

        if (empty($selectedWorkflowIds)) {
            return [];
        }

        foreach ($workflowIds as $workflowId) {
            if (! in_array($workflowId, $selectedWorkflowIds)) {
                continue;
            }

            /** @var WorkflowModel $workflow */
            $workflow = new WorkflowModel();
            $workflow->load($workflowId);

            if ($workflow->getStatus() === 'trash') {
                continue;
            }

            if ($includeScreenshots) {
                $screenshotUrl = $workflow->getScreenshotUrl();
                $screenshotData = @file_get_contents($screenshotUrl);
                $screenshotData = base64_encode($screenshotData);
            } else {
                $screenshotData = null;
            }

            $workflows[] = [
                'id' => $workflow->getId(),
                'title' => $workflow->getTitle(),
                'description' => $workflow->getDescription(),
                'modified_at' => $workflow->getModifiedAt(),
                'status' => $workflow->getStatus(),
                'flow' => $workflow->getFlow(),
                'screenshot' => $screenshotData,
            ];
        }

        return $workflows;
    }

    private function exportSettings()
    {
        $settings = [];

        $settings = array_merge($settings, $this->getPostTypesSettings());
        $settings = array_merge($settings, $this->getGeneralSettings());
        $settings = array_merge($settings, $this->getNotificationsSettings());
        $settings = array_merge($settings, $this->getDisplaySettings());
        $settings = array_merge($settings, $this->getAdvancedSettings());

        return $settings;
    }

    private function getPostTypesSettings(): array
    {
        return [];
    }

    private function getGeneralSettings(): array
    {
        return [];
    }

    private function getNotificationsSettings(): array
    {
        return [];
    }

    private function getDisplaySettings(): array
    {
        return [];
    }

    private function getAdvancedSettings(): array
    {
        return [];
    }
}

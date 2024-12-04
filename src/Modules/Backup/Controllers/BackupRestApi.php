<?php

namespace PublishPress\Future\Modules\Backup\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Settings\Models\SettingsPostTypesModel;
use PublishPress\Future\Modules\Settings\SettingsFacade;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowsModel;
use WP_REST_Request;
use WP_REST_Response;

class BackupRestApi implements InitializableInterface
{
    private HookableInterface $hooks;

    private string $pluginVersion;

    private SettingsFacade $settingsFacade;

    public function __construct(
        HookableInterface $hooks,
        string $pluginVersion,
        SettingsFacade $settingsFacade
    ) {
        $this->hooks = $hooks;
        $this->pluginVersion = $pluginVersion;
        $this->settingsFacade = $settingsFacade;
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
                    'settings' => [
                        'type' => 'array',
                    ],
                ],
            ]
        );

        register_rest_route(
            $apiNamespace,
            '/backup/import',
            [
                'methods' => 'POST',
                'callback' => [$this, 'importBackup'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
                'accept_file_uploads' => true,
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
        $selectedSettings = $request->get_param('settings');

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
            $exportData['settings'] = $this->exportSettings($selectedSettings);
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

    private function exportSettings(array $selectedSettings = [])
    {
        $settings = [];

        if (empty($selectedSettings)) {
            return $settings;
        }

        if (in_array('postTypesDefaults', $selectedSettings)) {
            $settings = array_merge($settings, $this->getPostTypesSettings());
        }

        if (in_array('general', $selectedSettings)) {
            $settings = array_merge($settings, $this->getGeneralSettings());
        }

        if (in_array('notifications', $selectedSettings)) {
            $settings = array_merge($settings, $this->getNotificationsSettings());
        }

        if (in_array('display', $selectedSettings)) {
            $settings = array_merge($settings, $this->getDisplaySettings());
        }

        if (in_array('advanced', $selectedSettings)) {
            $settings = array_merge($settings, $this->getAdvancedSettings());
        }

        return $settings;
    }

    private function getPostTypesSettings(): array
    {
        /** @var SettingsPostTypesModel $settingsPostTypesModel */
        $settingsPostTypesModel = new SettingsPostTypesModel();


        $postTypes = $settingsPostTypesModel->getPostTypes();
        $defaults = [];

        foreach ($postTypes as $postType) {
            $defaults[$postType] = $this->settingsFacade->getPostTypeDefaults($postType);
        }

        return [
            'postTypesDefaults' => $defaults,
        ];
    }

    private function getGeneralSettings(): array
    {
        return [
            'general' => $this->settingsFacade->getGeneralSettings(),
        ];
    }

    private function getNotificationsSettings(): array
    {
        return [
            'notifications' => $this->settingsFacade->getNotificationsSettings(),
        ];
    }

    private function getDisplaySettings(): array
    {
        return [
            'display' => $this->settingsFacade->getDisplaySettings(),
        ];
    }

    private function getAdvancedSettings(): array
    {
        return [
            'advanced' => $this->settingsFacade->getAdvancedSettings(),
        ];
    }

    public function importBackup(WP_REST_Request $request)
    {
        ray(file_get_contents('php://input'))->label('Raw POST data');
        ray($_SERVER['CONTENT_TYPE'])->label('Content-Type header');
        ray($_SERVER['REQUEST_METHOD'])->label('Request method');
        ray($_FILES)->label('Files in $_FILES');


        $files = $request->get_file_params();
        $headers = $request->get_headers();

        $uploadedFile = null;

        $permittedTypes = ['application/json', 'text/json', 'text/plain'];

        if (!empty($files) && !empty($files['backupFile'])) {
            $uploadedFile = $files['backupFile'];
        }

        try {
            if (empty($uploadedFile) || !isset($uploadedFile['tmp_name'])) {
                return new \WP_Error('invalid_request', 'No backup file uploaded');
            }

            if (! is_uploaded_file($uploadedFile['tmp_name'])) {
                return new \WP_Error('invalid_request', 'Invalid backup file');
            }

            if ($uploadedFile['error'] !== UPLOAD_ERR_OK) {
                return new \WP_Error('invalid_request', 'Error uploading backup file');
            }

            $ext = pathinfo($uploadedFile['name'], PATHINFO_EXTENSION);

            if ($ext !== 'json') {
                return new \WP_Error('invalid_file_type', 'Invalid file type. Please upload a JSON file.');
            }

            $mimeType = mime_content_type($uploadedFile['tmp_name']);
            if (!in_array($uploadedFile['type'], $permittedTypes)
                || !in_array($mimeType, $permittedTypes)
            ) {
                return new \WP_Error('invalid_mime_type', 'Invalid mime type');
            }

            // Read and decode the JSON file
            $jsonContent = file_get_contents($uploadedFile['tmp_name']);
            $backupData = json_decode($jsonContent, true);
        } catch (\Exception $e) {
            return new \WP_Error('invalid_request', $e->getMessage());
        }

        return new WP_REST_Response([
            'message' => 'Backup imported successfully',
        ], 200);
    }
}

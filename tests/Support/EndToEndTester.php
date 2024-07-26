<?php

declare(strict_types=1);

namespace Tests\Support;

use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowsModel;
use PublishPress\FuturePro\Modules\Workflows\Module as WorkflowsModule;

/**
 * Inherited Methods
 * @method void wantTo($text)
 * @method void wantToTest($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method void pause($vars = [])
 *
 * @SuppressWarnings(PHPMD)
*/
class EndToEndTester extends \Codeception\Actor
{
    use _generated\EndToEndTesterActions;

    public function closeWorkflowEditorWelcomeGuide(): void
    {
        $this->click('.workflow-editor-welcome-guide .components-button');
    }

    public function amOnWorkflowEditorPage(int $postId, bool $autoCloseWelcomeGuide = true): void
    {
        $persistentFeatures = [
            'persistentFeatures' => [
                'fullscreenMode' => true,
                'welcomeGuide' => !$autoCloseWelcomeGuide,
                'controls' => true,
                'developerMode' => false,
                'advancedSettings' => false,
                'miniMap' => false,
            ]
        ];
        $this->executeJS('window.localStorage.setItem("FUTURE_PRO_WORKFLOW_PREFERENCES_1", \'' . json_encode($persistentFeatures) . '\');');
        $this->amOnAdminPage('admin.php?page=future_workflow_editor&workflow=' . $postId);

        // Wait until events (like unselect all nodes) are executed
        $this->wait(1);
    }

    public function selectWorkflowStep(string $stepId): void
    {
        // Click on the node to select it
        $this->wait(0.2);
        $this->click('.react-flow__node[data-id="' . $stepId . '"]');
    }

    public function haveWorkflowInDatabase(array $workflowData): int
    {
        $title = $workflowData['title'] ?? 'Test workflow ' . uniqid();
        $content = $workflowData['flow'] ?? '';

        $workflowId = $this->havePostInDatabase(
            [
                'post_title' => $title,
                'post_type' => WorkflowsModule::POST_TYPE_WORKFLOW,
                'post_status' => 'publish',
                'post_content' => $content,
            ]
        );

        return $workflowId;
    }

    public function resetWorkflows(): void
    {
        $this->updateInDatabase('wp_options', ['option_value' => '0'], ['option_name' => WorkflowsModel::OPTION_SAMPLE_WORKFLOWS_CREATED]);
        $this->dontHavePostInDatabase(['post_type' => WorkflowsModule::POST_TYPE_WORKFLOW]);
        $this->dontHavePostInDatabase(['post_type' => 'attachment']);
        $this->dontHavePostInDatabase(['post_type' => 'post']);
        $this->dontHavePostInDatabase(['post_type' => 'page']);
        $this->dontHavePostMetaInDatabase([]);
        $this->deleteDir($this->getUploadsPath() . '/publishpress-future/workflows');
    }

    public function grabFilesFromFolder(string $folder): array
    {
        $files = [];

        if (!is_dir($folder)) {
            return $files;
        }

        $directory = new \RecursiveDirectoryIterator($folder);
        $iterator = new \RecursiveIteratorIterator($directory);

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $files[] = $file->getFilename();
            }
        }

        return $files;
    }
}

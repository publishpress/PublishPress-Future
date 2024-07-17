<?php

declare(strict_types=1);

namespace Tests\Support;

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
        $this->amOnAdminPage('admin.php?page=future_workflow_editor&workflow=' . $postId);

        if ($autoCloseWelcomeGuide) {
            $this->closeWorkflowEditorWelcomeGuide();
        }

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
}

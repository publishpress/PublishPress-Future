<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\WordPress\Facade\EmailFacade;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CoreSendEmail as NodeTypeCoreSendEmail;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowEngineInterface;

class CoreSendEmail implements NodeRunnerInterface
{
    const NODE_NAME = NodeTypeCoreSendEmail::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    /**
     * @var EmailFacade
     */
    private $emailFacade;

    /**
     * @var WorkflowEngineInterface
     */
    private $workflowEngine;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer,
        EmailFacade $emailFacade,
        WorkflowEngineInterface $workflowEngine
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
        $this->emailFacade = $emailFacade;
        $this->workflowEngine = $workflowEngine;
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerPreparer->setup($step, [$this, 'processEmailSending'], $contextVariables);
    }

    public function processEmailSending(array $step, array $contextVariables)
    {
        try {
            $node = $this->nodeRunnerPreparer->getNodeFromStep($step);
            $nodeSettings = $this->nodeRunnerPreparer->getNodeSettings($node);

            $recipient = $nodeSettings['recipient']['recipient'] ?? 'global.site.admin_email';

            $variablesHandler = $this->workflowEngine->getVariablesHandler();

            $subject = $nodeSettings['subject'] ?? '';
            if (empty($subject)) {
                $subject = NodeTypeCoreSendEmail::getDefaultSubject();
            }
            $subject = $variablesHandler->replaceVariablesPlaceholdersInText($subject, $contextVariables);
            $subject = sanitize_text_field($subject);

            $message = $nodeSettings['message'] ?? '';
            if (empty($message)) {
                $message = NodeTypeCoreSendEmail::getDefaultMessage();
            }
            $message = $variablesHandler->replaceVariablesPlaceholdersInText($message, $contextVariables);
            // TODO: Add support for HTML emails. Block editor or separated email templates?
            $message = sanitize_textarea_field($message);


            if ($recipient === 'custom') {
                $customEmails = $nodeSettings['recipient']['custom'] ?? '';

                if (! empty($customEmails)) {
                    $recipient = explode(',', $customEmails);
                }
            } else {
                $recipient = $variablesHandler->parseVariableValue($recipient, $contextVariables);
            }

            if (empty($recipient)) {
                throw new Exception('Recipient is empty');
            }

            if (! is_array($recipient)) {
                $recipient = explode(',', $recipient);
            }

            $recipient = array_map('trim', $recipient);
            $recipient = array_unique($recipient);

            foreach ($recipient as $recipientAddress) {
                // Sanitize the recipient
                $recipientAddress = sanitize_email($recipientAddress);

                // Send the email
                $this->emailFacade->send($recipientAddress, $subject, $message);
            }
        } catch (\Exception $e) {
            // $rayMessage = 'Error: ' . $e->getMessage();
        }
    }
}

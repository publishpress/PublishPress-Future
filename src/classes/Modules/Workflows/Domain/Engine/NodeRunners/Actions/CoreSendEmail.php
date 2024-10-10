<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\WordPress\Facade\EmailFacade;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CoreSendEmail as NodeTypeCoreSendEmail;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;

use function PublishPress\FuturePro\logError;

class CoreSendEmail implements NodeRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var EmailFacade
     */
    private $emailFacade;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $runtimeVariablesHandler;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        EmailFacade $emailFacade,
        RuntimeVariablesHandlerInterface $runtimeVariablesHandler
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->emailFacade = $emailFacade;
        $this->runtimeVariablesHandler = $runtimeVariablesHandler;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCoreSendEmail::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'processEmailSending']);
    }

    public function processEmailSending(array $step)
    {
        try {
            $node = $this->nodeRunnerProcessor->getNodeFromStep($step);
            $nodeSettings = $this->nodeRunnerProcessor->getNodeSettings($node);

            $recipient = $nodeSettings['recipient']['recipient'] ?? 'global.site.admin_email';

            $subject = $nodeSettings['subject'] ?? '';
            if (empty($subject)) {
                $subject = NodeTypeCoreSendEmail::getDefaultSubject();
            }
            $subject = $this->runtimeVariablesHandler->replacePlaceholdersInText($subject);
            $subject = sanitize_text_field($subject);

            $message = $nodeSettings['message'] ?? '';
            if (empty($message)) {
                $message = NodeTypeCoreSendEmail::getDefaultMessage();
            }
            $message = $this->runtimeVariablesHandler->replacePlaceholdersInText($message);
            // TODO: Add support for HTML emails. Block editor or separated email templates?
            $message = sanitize_textarea_field($message);


            if ($recipient === 'custom') {
                $customEmails = $nodeSettings['recipient']['custom'] ?? '';

                if (! empty($customEmails)) {
                    $recipient = explode(',', $customEmails);
                }
            } else {
                $recipient = $this->runtimeVariablesHandler->getVariable($recipient);
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
            logError("Error sending email", $e);
        }
    }
}

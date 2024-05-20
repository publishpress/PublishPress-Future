<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\WordPress\Facade\EmailFacade;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CoreSendEmail as NodeTypeCoreSendEmail;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;

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

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer,
        EmailFacade $emailFacade
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
        $this->emailFacade = $emailFacade;
    }

    public function setup(array $step, array $input = [], array $globalVariables = []): void
    {
        $this->nodeRunnerPreparer->setup($step, [$this, 'actionCallback'], $input, $globalVariables);
    }

    public function actionCallback(array $step, array $input, array $globalVariables)
    {
        try {
            $node = $this->nodeRunnerPreparer->getNodeFromStep($step);
            $nodeSettings = $this->nodeRunnerPreparer->getNodeSettings($node);

            ray($nodeSettings)->label('Node Settings');

            $recipient = $nodeSettings['recipient']['recipient'] ?? 'global.site.admin_email';
            $subject = $nodeSettings['subject'] ?? '';
            $message = $nodeSettings['message'] ?? '';

            $subject = sanitize_text_field($subject);

            // TODO: Add support for HTML emails. Block editor or separated email templates?
            $message = sanitize_textarea_field($message);

            if ($recipient === 'custom') {
                $customEmails = $nodeSettings['recipient']['custom'] ?? '';

                if (! empty($customEmails)) {
                    $recipient = explode(',', $customEmails);
                }
            } else {
                $dataSources = [
                    'input' => $input,
                    'global' => $globalVariables,
                ];
                $recipient = $this->parseVariableValue($recipient, $dataSources);
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

    private function parseVariableValue($variableName, array $dataSources)
    {
        $variableName = explode('.', $variableName);

        $variableSource = null;
        if (in_array($variableName[0], array_keys($dataSources))) {
            $variableSource = $dataSources[$variableName[0]];
            $variableName = array_slice($variableName, 1);
        } else {
            return $variableName;
        }

        $value = $variableSource;
        if (count($variableName) > 1) {
            foreach ($variableName as $variableNameSegment) {
                $value = $this->getValueFromVariable($variableNameSegment, $value);
            }
        } else if (count($variableName) === 1) {
            $value = $variableSource[$variableName[0]];
        }

        return $value;
    }

    private function getValueFromVariable($variableName, $variable)
    {
        if (is_array($variable) && isset($variable[$variableName])) {
            $variable = $variable[$variableName];
        } else if (is_object($variable) && isset($variable->{$variableName})) {
            $variable = $variable->{$variableName};
        } else {
            throw new Exception('Invalid data key: ' . $variableName . ' for data: ' . print_r($variable, true));
        }

        return $variable;
    }
}

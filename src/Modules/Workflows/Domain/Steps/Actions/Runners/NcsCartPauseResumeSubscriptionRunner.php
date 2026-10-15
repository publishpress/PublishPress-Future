<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\NcsCartPauseResumeSubscription;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;

/**
 * Pauses or resumes a PublishPress Cart subscription.
 *
 * Cart exposes no headless pause function — only an AJAX handler
 * (ppcart_pause_restart_subscription) that reads $_POST, checks a nonce and
 * dies. This runner mirrors that handler's core using Cart's own helpers
 * (PPCart_Subscription, ppcart_stripe_client, the ppcart_subscription_pause_restart
 * filter for non-Stripe gateways), so it stays consistent with the plugin while
 * being callable from a workflow.
 */
class NcsCartPauseResumeSubscriptionRunner implements StepRunnerInterface
{
    use NcsCartResolverTrait;

    /**
     * @var StepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var ExecutionContextInterface
     */
    private $executionContext;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        StepProcessorInterface $stepProcessor,
        ExecutionContextInterface $executionContext,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->executionContext = $executionContext;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return NcsCartPauseResumeSubscription::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->stepProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(array $step)
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

                if (! class_exists('PPCart_Subscription')) {
                    $this->logger->debugWithArgs('PublishPress Cart not active, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $nodeSettings = $this->stepProcessor->getNodeSettings(
                    $this->stepProcessor->getNodeFromStep($step)
                );

                $subscriptionId = $this->resolveExpressionField($nodeSettings, 'subscriptionId');
                if ($subscriptionId === '' || ! ctype_digit($subscriptionId)) {
                    $this->logger->debugWithArgs('No valid subscription ID, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }
                $subscriptionId = (int) $subscriptionId;

                if (get_post_type($subscriptionId) !== 'ppcart_subscription') {
                    $this->logger->debugWithArgs(
                        'Post %1$s is not a Cart subscription, skipping | Slug: %2$s',
                        $subscriptionId,
                        $nodeSlug
                    );
                    return;
                }

                $action = $nodeSettings['action'] ?? 'pause';
                if (is_array($action)) {
                    $action = $action['value'] ?? 'pause';
                }
                // Cart uses 'started' internally for resume; status becomes active/paused.
                $type = ($action === 'resume') ? 'started' : 'paused';
                $newStatus = ($type === 'started') ? 'active' : 'paused';

                $sub = new \PPCart_Subscription($subscriptionId);
                $done = false;

                if ($sub->pay_method === 'stripe'
                    && function_exists('ppcart_stripe_client')
                    && ! empty($sub->subscription_id)
                ) {
                    global $ppcart_stripe;
                    $apiKey = is_array($ppcart_stripe) ? ($ppcart_stripe['sk'] ?? '') : '';
                    if ($apiKey === '') {
                        $this->logger->debugWithArgs(
                            'Stripe key unavailable, skipping | Slug: %1$s',
                            $nodeSlug
                        );
                        return;
                    }

                    $stripe = ppcart_stripe_client($apiKey);
                    $data = ($type === 'started')
                        ? ['pause_collection' => '']
                        : ['pause_collection' => ['behavior' => 'void']];
                    $stripe->subscriptions->update($sub->subscription_id, $data);
                    $done = true;
                } else {
                    $done = (bool) apply_filters('ppcart_subscription_pause_restart', false, $sub, $type);
                }

                if (! $done) {
                    $this->logger->debugWithArgs(
                        'Subscription %1$s pause/resume not applied | Slug: %2$s',
                        $subscriptionId,
                        $nodeSlug
                    );
                    return;
                }

                $sub->status = $newStatus;
                $sub->sub_status = $newStatus;
                $sub->store();

                $this->logger->debugWithArgs(
                    'Subscription %1$s %2$s | Slug: %3$s',
                    $subscriptionId,
                    ($type === 'started') ? 'resumed' : 'paused',
                    $nodeSlug
                );
            }
        );
    }
}

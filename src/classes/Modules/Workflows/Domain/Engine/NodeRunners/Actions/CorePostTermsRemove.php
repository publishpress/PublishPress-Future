<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\WordPress\Facade\ErrorFacade;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsRemove as NodeTypeCorePostTermsRemove;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;

class CorePostTermsRemove implements NodeRunnerInterface
{
    public const NODE_NAME = NodeTypeCorePostTermsRemove::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var ErrorFacade
     */
    private $errorFacade;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer,
        \Closure $expirablePostModelFactory,
        ErrorFacade $errorFacade
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->errorFacade = $errorFacade;
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerPreparer->setup($step, [$this, 'actionCallback'], $contextVariables);
    }

    public function actionCallback(int $postId, array $nodeSettings)
    {
        $postModel = call_user_func($this->expirablePostModelFactory, $postId);

        $taxonomy = $nodeSettings['taxonomyTerms']['taxonomy'];
        $termsToRemove = $nodeSettings['taxonomyTerms']['terms'] ?? [];
        $selectAll = $nodeSettings['taxonomyTerms']['selectAll'] ?? false;

        $originalTerms = $postModel->getTermIDs($taxonomy);

        $updatedTerms = $selectAll ? [] : array_diff($originalTerms, $termsToRemove);

        $result = $postModel->setTerms($updatedTerms, $taxonomy);

        $resultIsError = $this->errorFacade->isWpError($result);

        // if (! $resultIsError) {
        //     $this->log = [
        //         'expiration_taxonomy' => $taxonomy,
        //         'original_terms' => $originalTerms,
        //         'terms_added' => $termsToAdd,
        //         'updated_terms' => $updatedTerms,
        //     ];
        // } else {
        //     $this->log['error'] = $result->get_error_message();
        // }
    }
}

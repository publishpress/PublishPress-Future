<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Framework\WordPress\Models\TermsModel;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

class PostCategoryRemove implements ExpirationActionInterface
{
    const SERVICE_NAME = 'expiration.actions.post_category_remove';

    /**
     * @var ExpirablePostModel
     */
    private $postModel;

    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\ErrorFacade
     */
    private $errorFacade;

    /**
     * @var array
     */
    private $log = [];

    /**
     * @param ExpirablePostModel $postModel
     * @param \PublishPressFuture\Framework\WordPress\Facade\ErrorFacade $errorFacade
     */
    public function __construct($postModel, $errorFacade)
    {
        $this->postModel = $postModel;
        $this->errorFacade = $errorFacade;
    }

    public function __toString()
    {
        return ExpirationActionsAbstract::POST_CATEGORY_REMOVE;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        if (empty($this->log)) {
            return __('No terms were removed from the post.', 'post-expirator');
        } elseif (isset($this->log['error'])) {
            return $this->log['error'];
        }

        $termsModel = new TermsModel();

        return sprintf(
            __(
                'The following terms (%s) were removed from the post: "%s". The new list of terms on the post is: %s.',
                'post-expirator'
            ),
            $this->log['expiration_taxonomy'],
            $termsModel->getTermNamesByIdAsString($this->log['removed_terms'], $this->log['expiration_taxonomy']),
            $termsModel->getTermNamesByIdAsString($this->log['updated_terms'], $this->log['expiration_taxonomy'])
        );
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $expirationTaxonomy = $this->postModel->getExpirationTaxonomy();
        $originalTerms = $this->postModel->getTermIDs($expirationTaxonomy);
        $termsToRemove = $this->postModel->getExpirationCategoryIDs();

        $updatedTerms = array_diff($originalTerms, $termsToRemove);

        $removedTerms = array_intersect($originalTerms, $termsToRemove);

        $result = $this->postModel->setTerms($updatedTerms, $expirationTaxonomy);

        $resultIsError = $this->errorFacade->isWpError($result);

        if (! $resultIsError) {
            $this->log = [
                'expiration_taxonomy' => $expirationTaxonomy,
                'original_terms' => $originalTerms,
                'removed_terms' => $removedTerms,
                'updated_terms' => $updatedTerms,
            ];
        } else {
            $this->log['error'] = $result->get_error_message();
        }

        return ! $resultIsError;
    }
}

<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Framework\WordPress\Models\TermsModel;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

class PostCategorySet implements ExpirationActionInterface
{
    const SERVICE_NAME = 'expiration.actions.post_category_set';

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
        return ExpirationActionsAbstract::POST_CATEGORY_SET;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        if (empty($this->log)) {
            return __('No terms were changed on the post.', 'post-expirator');
        } elseif (isset($this->log['error'])) {
            return $this->log['error'];
        }

        $termsModel = new TermsModel();

        return sprintf(
            __(
                'The following terms (%s) were set to the post: "%s". The old list of terms on the post was: %s.',
                'post-expirator'
            ),
            $this->log['expiration_taxonomy'],
            $termsModel->getTermNamesByIdAsString($this->log['updated_terms'], $this->log['expiration_taxonomy']),
            $termsModel->getTermNamesByIdAsString($this->log['original_terms'], $this->log['expiration_taxonomy'])
        );
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $expirationTaxonomy = $this->postModel->getExpirationTaxonomy();
        $originalTerms = $this->postModel->getTermIDs($expirationTaxonomy);
        $updatedTerms = $this->postModel->getExpirationCategoryIDs();

        $result = $this->postModel->setTerms($updatedTerms, $expirationTaxonomy);

        $resultIsError = $this->errorFacade->isWpError($result);

        if (! $resultIsError) {
            $this->log = [
                'expiration_taxonomy' => $expirationTaxonomy,
                'original_terms' => $originalTerms,
                'updated_terms' => $updatedTerms,
            ];
        } else {
            $this->log['error'] = $result->get_error_message();
        }

        return ! $resultIsError;
    }
}

<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Framework\WordPress\Facade\ErrorFacade;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;

class PostCategoryAdd implements ExpirationActionInterface
{
    /**
     * @var ExpirablePostModel
     */
    private $postModel;

    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\ErrorFacade
     */
    private $errorFacade;

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
        return ExpirationActionsAbstract::POST_CATEGORY_ADD;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        $expirationTaxonomy = $this->postModel->getExpirationTaxonomy();
        $expirationTermsName = $this->postModel->getExpirationCategoryNames();

        $postTermsName = array_merge(
            $this->postModel->getTermNames($expirationTaxonomy),
            $expirationTermsName
        );

        return sprintf(
            __('The following terms (%s) were added to the post: "%s". The full list of terms on the post is: %s.', 'post-expirator'),
            $expirationTaxonomy,
            implode(', ', $expirationTermsName),
            implode(', ', $postTermsName)
        );
    }

    /**
     * @inheritDoc
     */
    public function getExpirationLog()
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $expirationTaxonomy = $this->postModel->getExpirationTaxonomy();
        $newTerms = $this->postModel->getExpirationCategoryIDs();
        $postTerms = $this->postModel->getTermIDs($expirationTaxonomy);

        $mergedTerms = array_merge($postTerms, $newTerms);

        $result = $this->postModel->setTerms($mergedTerms, $expirationTaxonomy);

        return ! $this->errorFacade->isWpError($result);
    }
}

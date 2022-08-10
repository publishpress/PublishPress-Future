<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

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
     * @param ExpirablePostModel $postModel
     */
    public function __construct($postModel)
    {
        $this->postModel = $postModel;
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

        $this->postModel->setTerms($mergedTerms, $expirationTaxonomy);
    }
}

<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

class PostCategoryRemove implements ExpirationActionInterface
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
        return ExpirationActionsAbstract::POST_CATEGORY_REMOVE;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        $expirationTaxonomy = $this->postModel->getExpirationTaxonomy();
        $expirationTermsName = $this->postModel->getExpirationCategoryNames();
        $postTermsName = $this->postModel->getTermNames($expirationTaxonomy);

        $removedTerms = array_intersect($postTermsName, $expirationTermsName);
        $newListOfTerms = array_diff($postTermsName, $expirationTermsName);

        return sprintf(
            __(
                'The following terms (%s) were removed from the post: "%s". The new list of terms on the post is: %s.',
                'post-expirator'
            ),
            $expirationTaxonomy,
            implode(', ', $removedTerms),
            implode(', ', $newListOfTerms)
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
        $termsToRemove = $this->postModel->getExpirationCategoryIDs();
        $postTerms = $this->postModel->getTermIDs($expirationTaxonomy);

        $newPostTerms = array_diff($postTerms, $termsToRemove);

        $this->postModel->setTerms($newPostTerms, $expirationTaxonomy);
    }
}

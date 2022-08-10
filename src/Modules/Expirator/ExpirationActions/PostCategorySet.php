<?php

namespace PublishPressFuture\Modules\Expirator\ExpirationActions;

use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;

class PostCategorySet implements ExpirationActionInterface
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
        return ExpirationActionsAbstract::POST_CATEGORY_SET;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        $expirationTaxonomy = $this->postModel->getExpirationTaxonomy();
        $expirationTermsName = $this->postModel->getExpirationCategoryNames();
        $postTermsName = $this->postModel->getTermNames($expirationTaxonomy);

        return sprintf(
            __(
                'The following terms (%s) were set to the post: "%s". The old list of terms on the post was: %s.',
                'post-expirator'
            ),
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


        $this->postModel->setTerms($newTerms, $expirationTaxonomy);
    }
}

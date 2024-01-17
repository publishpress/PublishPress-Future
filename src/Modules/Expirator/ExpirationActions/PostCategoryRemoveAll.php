<?php

namespace PublishPress\Future\Modules\Expirator\ExpirationActions;

use PublishPress\Future\Framework\WordPress\Models\TermsModel;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;

defined('ABSPATH') or die('Direct access not allowed.');

class PostCategoryRemoveAll implements ExpirationActionInterface
{
    use TaxonomyRelatedTrait;

    const SERVICE_NAME = 'expiration.actions.post_category_remove_all';

    /**
     * @var ExpirablePostModel
     */
    private $postModel;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\ErrorFacade
     */
    private $errorFacade;

    /**
     * @var array
     */
    private $log = [];

    /**
     * @param ExpirablePostModel $postModel
     * @param \PublishPress\Future\Framework\WordPress\Facade\ErrorFacade $errorFacade
     */
    public function __construct($postModel, $errorFacade)
    {
        $this->postModel = $postModel;
        $this->errorFacade = $errorFacade;
    }

    public function __toString()
    {
        return ExpirationActionsAbstract::POST_CATEGORY_REMOVE_ALL;
    }

    /**
     * @inheritDoc
     */
    public function getNotificationText()
    {
        if (empty($this->log)) {
            return sprintf(
                __('No terms were removed from the %s.', 'post-expirator'),
                strtolower($this->postModel->getPostTypeSingularLabel())
            );
        } elseif (isset($this->log['error'])) {
            return $this->log['error'];
        }

        $termsModel = new TermsModel();

        return sprintf(
            __(
                'The following terms (%s) were removed from the %s: %s.',
                'post-expirator'
            ),
            $this->log['expiration_taxonomy'],
            strtolower($this->postModel->getPostTypeSingularLabel()),
            $termsModel->getTermNamesByIdAsString($this->log['removed_terms'], $this->log['expiration_taxonomy'])
        );
    }

    /**
     * @inheritDoc
     */
    public function execute()
    {
        $expirationTaxonomy = $this->postModel->getExpirationTaxonomy();
        $termsToRemove = $this->postModel->getTermIDs($expirationTaxonomy);

        $result = $this->postModel->setTerms([], $expirationTaxonomy);

        $resultIsError = $this->errorFacade->isWpError($result);

        if (! $resultIsError) {
            $this->log = [
                'expiration_taxonomy' => $expirationTaxonomy,
                'original_terms' => $termsToRemove,
                'removed_terms' => $termsToRemove,
                'updated_terms' => [],
            ];
        } else {
            $this->log['error'] = $result->get_error_message();
        }

        return ! $resultIsError;
    }

    public static function getLabel(string $postType = ''): string
    {
        $taxonomy = self::getTaxonomyLabel($postType);

        return sprintf(
            // translators: %s is the taxonomy name (plural)
            __('Remove all %s', 'post-expirator'),
            $taxonomy
        );
    }

    public function getDynamicLabel($postType = '')
    {
        return self::getLabel($postType);
    }
}

<?php
namespace PublishPress\FuturePro\Modules\Workflows\Domain\LegacyAction;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\ExpirationActionInterface;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;

class TriggerWorkflow implements ExpirationActionInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $log = [];

    private $postModel;

    public function __construct(HookableInterface $hooks, $postModel)
    {
        $this->hooks = $hooks;
        $this->postModel = $postModel;
    }

    public function execute()
    {
        $postId = $this->postModel->getPostId();
        $post = get_post($postId);

        ray($postId, $post)->blue()->label('TriggerWorkflow');

        $this->hooks->doAction(HooksAbstract::ACTION_LEGACY_ACTION, $postId, $post);
    }

    /**
     * @return string
     */
    public function getNotificationText()
    {
        if (empty($this->log)) {
            return __('The workflow was not triggered.', 'post-expirator');
        } elseif (isset($this->log['error'])) {
            return $this->log['error'];
        }

        return __('The workflow was triggered by the legacy action', 'post-expirator');
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return self::getLabel();
    }

    public static function getLabel(string $postType = ''): string
    {
        return __("Trigger Workflow", 'publishpress-future-pro');
    }

    /**
     * @return string
     */
    public function getDynamicLabel($postType = '')
    {
        return self::getLabel($postType);
    }
}

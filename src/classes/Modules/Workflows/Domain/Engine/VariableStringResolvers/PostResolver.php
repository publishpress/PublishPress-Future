<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\VariableStringResolverInterface;

class PostResolver implements VariableStringResolverInterface
{
    /**
     * @var object
     */
    private $post;

    public function __construct(object $post)
    {
        $this->post = $post;
    }

    public function getType(): string
    {
        return 'post';
    }

    public function getValueAsString($property = ''): string
    {
        switch($property) {
            case 'ID':
            case 'id':
                return (string)$this->post->ID;

            case 'post_title':
            case 'title':
                return (string)$this->post->post_title;

            case 'post_content':
            case 'content':
                return (string)$this->post->post_content;

            case 'post_excerpt':
            case 'excerpt':
                return (string)$this->post->post_excerpt;

            case 'post_type':
            case 'type':
                return (string)$this->post->post_type;

            case 'post_status':
            case 'status':
                return (string)$this->post->post_status;

            case 'post_date':
            case 'date':
                return (string)$this->post->post_date;

            case 'post_modified':
            case 'modified':
                return (string)$this->post->post_modified;

            case 'permalink':
                return (string)$this->getPermalink($this->post->ID);
        }

        return '';
    }

    protected function getPermalink($postId)
    {
        return get_permalink($postId);
    }
}

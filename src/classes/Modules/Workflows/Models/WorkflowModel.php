<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use Exception;
use PublishPress\FuturePro\Modules\Workflows\Module;
use WP_Post;

class WorkflowModel
{
    const META_KEY_DICTIONARY = '_workflow_dictionary';

    const META_KEY_FLOW = '_workflow_flow';

    private $post;

    private $flow = [];

    public function load(int $id): bool
    {
        $this->reset();

        $post = get_post($id);

        if ((! ($post instanceof WP_Post)) || $post->post_type !== Module::POST_TYPE_WORKFLOW) {
            return false;
        }

        $this->post = $post;

        return true;
    }

    private function reset(): void
    {
        $this->post = null;
        $this->flow = [];
    }

    public function getName(): string
    {
        return $this->post->post_title;
    }

    public function setName(string $name)
    {
        $this->post->post_title = $name;
    }

    public function getDescription(): string
    {
        return $this->post->post_content;
    }

    public function setDescription(string $description)
    {
        $this->post->post_content = $description;
    } 

    public function save()
    {
        wp_update_post($this->post);
    }

    public function getFlow(): string
    {
        if (empty($this->flow)) {
            try {
                $this->flow = get_post_meta($this->post->ID, self::META_KEY_FLOW, true);
            } catch (Exception $e) {
                $this->flow = '';
            }
        }

        return $this->flow;
    }

    public function setFlow(string $flow)
    {
        $this->flow = $flow;
    }
}

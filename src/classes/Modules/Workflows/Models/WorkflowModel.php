<?php

namespace PublishPress\FuturePro\Modules\Workflows\Models;

use Exception;
use WP_Post;

class WorkflowModel
{
    const META_KEY_DICTIONARY = '_workflow_dictionary';

    const META_KEY_FLOW = '_workflow_flow';

    private $post;

    private $dictionary = [];

    private $flow = [];

    public function load(int $id): bool
    {
        $this->post = get_post($id);

        return $this->post instanceof WP_Post;
    }

    public function getName(): string
    {
        return $this->post->post_title;
    }

    public function setName(string $name)
    {
        $this->post->post_title = $name;
    }

    public function getSlug(): string
    {
        return $this->post->post_name;
    }

    public function setSlug(string $slug)
    {
        $this->post->post_name = $slug;
    }

    public function save()
    {
        wp_update_post($this->post);
    }

    public function getDictionary(): array
    {
        if (empty($this->dictionary)) {
            try {
                $this->dictionary = get_post_meta($this->post->ID, self::META_KEY_DICTIONARY, true);
            } catch (Exception $e) {
                $this->dictionary = [];
            }
        }

        return $this->dictionary;
    }

    public function setDictionary(array $dictionary)
    {
        $this->dictionary = $dictionary;
    }

    public function getFlow(): array
    {
        if (empty($this->flow)) {
            try {
                $this->flow = get_post_meta($this->post->ID, self::META_KEY_FLOW, true);
            } catch (Exception $e) {
                $this->flow = [];
            }
        }

        return $this->flow;
    }

    public function setFlow(array $flow)
    {
        $this->flow = $flow;
    }
}

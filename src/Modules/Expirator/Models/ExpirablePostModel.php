<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Models;

use PublishPressFuture\Core\Framework\WordPress\Facade\PostModel;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;

class ExpirablePostModel
{
    /**
     * @var PostModel
     */
    private $postModel;

    /**
     * @var string
     */
    private $type = '';

    /**
     * @var string[]
     */
    private $categories = [];

    /**
     * @var string
     */
    private $taxonomy = '';

    /**
     * @var bool
     */
    private $enabled = null;

    /**
     * @var int
     */
    private $date = null;

    /**
     * @var array
     */
    private $options = [];

    /**
     * @param PostModel
     */
    public function __construct($postModel)
    {
        $this->postModel = $postModel;

        $this->enabled = 'saved' === $this->postModel->getMeta('_expiration-date-status', true)
            && ! empty($date);
    }

    public function asArray()
    {
        return [
            'expireType' => $this->getType(),
            'category' => $this->getCategories(),
            'categoryTaxonomy' => $this->getTaxonomy(),
            'enabled' => $this->getEnabled(),
            'date' => $this->getDate(),
        ];
    }

    /**
     * @return string
     */
    public function getType()
    {
        if (empty($this->type)) {
            $this->type = $this->postModel->getMeta('_expiration-date-type', true);

            $options = $this->getOptions();

            if (empty($this->type)) {
                $this->type = isset($options['expireType'])
                    ? $options['expireType'] : ExpirationActionsAbstract::POST_STATUS_TO_DRAFT;
            }
        }

        return $this->type;
    }

    /**
     * @return false|string[]
     */
    public function getCategories()
    {
        if (empty($this->categories)) {
            $this->categories = (array)$this->postModel->getMeta('_expiration-date-categories', true);

            $options = $this->getOptions();

            if (empty($this->categories)) {
                $this->categories = isset($options['category']) ? $options['category'] : false;
            }
        }

        return $this->categories;
    }

    /**
     * @return string|false
     */
    public function getTaxonomy()
    {
        if (empty($this->taxonomy)) {
            $this->taxonomy = $this->postModel->getMeta('_expiration-date-taxonomy', true);

            $options = $this->getOptions();

            if (empty($this->taxonomy)) {
                $this->taxonomy = isset($options['categoryTaxonomy']) ? $options['categoryTaxonomy'] : '';
            }
        }

        return $this->taxonomy;
    }

    /**
     * @return bool
     */
    public function getEnabled()
    {
        if (is_null($this->enabled)) {
            $date = $this->getDate();

            $this->enabled = $this->postModel->getMeta('_expiration-date-status', true) === 'saved'
                && ! (empty($date));
        }

        return (bool)$this->enabled;
    }

    /**
     * @return int|false
     */
    public function getDate()
    {
        if (is_null($this->date)) {
            $this->date = $this->postModel->getMeta('_expiration-date', true);
        }

        return $this->date;
    }

    /**
     * @return array|false
     */
    public function getOptions()
    {
        if (empty($this->options)) {
            // Option _expiration-date-options is deprecated when using block editor.
            $this->options = $this->postModel->getMeta('_expiration-date-options', true);
        }

        return $this->options;
    }
}

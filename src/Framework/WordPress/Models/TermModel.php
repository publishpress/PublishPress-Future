<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Models;


use PublishPressFuture\Framework\WordPress\Exceptions\NonexistentTermException;

class TermModel
{
    /**
     * @var int
     */
    private $termId;

    /**
     * @var \WP_Term;
     */
    private $termInstance;

    /**
     * @param int|\WP_Term $term
     */
    public function __construct($term)
    {
        if (is_object($term)) {
            $this->termInstance = $term;
            $this->termId = $term->term_id;
        }

        if (is_numeric($term)) {
            $this->termId = (int)$term;
        }
    }

    /**
     * @return \WP_Term
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentTermException
     */
    public function getTermInstance()
    {
        if (empty($this->termInstance)) {
            $this->termInstance = get_term($this->termId);

            if (! is_object($this->termInstance) || is_wp_error($this->termInstance)) {
                throw new NonexistentTermException();
            }
        }

        return $this->termInstance;
    }

    /**
     * @return bool
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentTermException
     */
    public function termExists()
    {
        $instance = $this->getTermInstance();

        return is_object($instance);
    }

    public function getTermID()
    {
        return (int)$this->termId;
    }

    /**
     * @throws \PublishPressFuture\Framework\WordPress\Exceptions\NonexistentTermException
     */
    public function getName()
    {
        $term = $this->getTermInstance();

        return $term->name;
    }
}

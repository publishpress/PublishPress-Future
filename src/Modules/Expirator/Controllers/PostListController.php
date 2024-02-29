<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PostExpirator_Display;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\Models\PostTypesModel;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

defined('ABSPATH') or die('Direct access not allowed.');

class PostListController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @param HookableInterface $hooksFacade
     */
    public function __construct(HookableInterface $hooksFacade)
    {
        $this->hooks = $hooksFacade;
    }

    public function initialize()
    {
        $this->hooks->addFilter(ExpiratorHooks::FILTER_MANAGE_POSTS_COLUMNS, [$this, 'addColumns'], 10, 2);
        $this->hooks->addFilter(ExpiratorHooks::FILTER_MANAGE_PAGES_COLUMNS, [$this, 'addColumns'], 11, 1);
        $this->hooks->addFilter(ExpiratorHooks::FILTER_POSTS_JOIN, [$this, 'joinExpirationDate'], 10, 2);

        $this->hooks->addAction(ExpiratorHooks::ACTION_MANAGE_PAGES_CUSTOM_COLUMN, [$this, 'managePostsCustomColumn']);
        $this->hooks->addAction(ExpiratorHooks::ACTION_MANAGE_POSTS_CUSTOM_COLUMN, [$this, 'managePostsCustomColumn']);
        $this->hooks->addAction(ExpiratorHooks::ACTION_ADMIN_INIT, [$this, 'manageSortableColumns'], 100);
        $this->hooks->addAction(ExpiratorHooks::ACTION_POSTS_ORDER_BY, [$this, 'orderByExpirationDate'], 10, 2);
        $this->hooks->addAction(CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPTS, [$this, 'enqueueScripts']);
    }

    /**
     * @param array $columns
     * @return array
     */
    public function addColumns($columns, $postType = 'page')
    {
        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

        $defaults = $settingsFacade->getPostTypeDefaults($postType);

        // If settings are not configured, show the metabox by default only for posts and pages
        if ((! isset($defaults['activeMetaBox']) && in_array($postType, array(
                    'post',
                    'page'
                ), true)) || (is_array(
                    $defaults
                ) && in_array((string)$defaults['activeMetaBox'], ['active', '1']))) {
            $columns['expirationdate'] = __('Future Action', 'post-expirator');
        }

        return $columns;
    }

    /**
     * @param string $column
     * @param int $postId
     */
    public function managePostsCustomColumn($column)
    {
        if ($column !== 'expirationdate') {
            return;
        }

        $this->renderColumn();
    }

    /**
     * @param \PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel $expirablePostModel
     * @param string $column
     */
    private function renderColumn()
    {
        global $post;

        $container = Container::getInstance();
        $settings = $container->get(ServicesAbstract::SETTINGS);

        PostExpirator_Display::getInstance()->render_template('expire-column', [
            'id' => $post->ID,
            'postType' => $post->post_type,
            'columnStyle' => $settings->getColumnStyle(),
        ]);
    }

    public function manageSortableColumns()
    {
        $container = Container::getInstance();
        $postTypesModel = new PostTypesModel($container);
        $postTypes = $postTypesModel->getPostTypes();

        foreach ($postTypes as $postType) {
            $this->hooks->addFilter('manage_edit-' . $postType . '_sortable_columns', [$this, 'sortableColumn']);
        }
    }

    public function sortableColumn($columns)
    {
        $columns['expirationdate'] = 'expirationdate';

        return $columns;
    }

    public function orderByExpirationDate($orderby, $query)
    {
        if (! is_admin()  || ! $query->is_main_query()) {
            return $orderby;
        }

        if ('expirationdate' === $query->get('orderby')) {
            $order = strtoupper($query->get('order'));

            if (! in_array($order, [
                'ASC',
                'DESC'
            ], true)) {
                $order = 'ASC';
            }

            $orderby = ActionArgsSchema::getTableName() . '.scheduled_date ' . $order;
        }

        return $orderby;
    }

    /**
     * @param string $join
     * @param \WP_Query $query
     * @return string
     */
    public function joinExpirationDate($join, $query)
    {
        global $wpdb;

        if (! is_admin() || ! $query->is_main_query()) {
            return $join;
        }

        $actionArgsSchemaTableName = ActionArgsSchema::getTableName();

        if ('expirationdate' === $query->get('orderby')) {
            $join .= " LEFT JOIN {$actionArgsSchemaTableName} ON {$actionArgsSchemaTableName}.post_id = {$wpdb->posts}.ID AND {$actionArgsSchemaTableName}.enabled = '1'";
        }

        return $join;
    }

    public function enqueueScripts($screenId)
    {
        if ('edit.php' === $screenId) {
            wp_enqueue_style(
                'postexpirator-edit',
                POSTEXPIRATOR_BASEURL . 'assets/css/edit.css',
                false,
                POSTEXPIRATOR_VERSION
            );
        }
    }
}

<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PostExpirator_Display;
use PostExpirator_Facade;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\CapabilitiesAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

class RestAPIController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade
     */
    private $sanitization;

    /**
     * @var \Closure
     */
    private $currentUserModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\RequestFacade
     */
    private $request;

    /**
     * @var TaxonomiesModel
     */
    private $taxonomiesModel;

    /**
     * @param HookableInterface $hooksFacade
     * @param callable $expirablePostModelFactory
     * @param \PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade $sanitization
     * @param \Closure $currentUserModelFactory
     * @param \PublishPress\Future\Framework\WordPress\Facade\RequestFacade $request
     */
    public function __construct(
        HookableInterface $hooksFacade,
        $expirablePostModelFactory,
        $sanitization,
        $currentUserModelFactory,
        $request
    ) {
        $this->hooks = $hooksFacade;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->sanitization = $sanitization;
        $this->currentUserModelFactory = $currentUserModelFactory;
        $this->request = $request;

        $container = Container::getInstance();
        $taxonomiesModelFactory = $container->get(ServicesAbstract::TAXONOMIES_MODEL_FACTORY);
        $this->taxonomiesModel = $taxonomiesModelFactory();
    }

    public function initialize()
    {

        $this->hooks->addAction(
            HooksAbstract::ACTION_REST_API_INIT,
            [$this, 'handleRestAPIInit']
        );
    }

    public function handleRestAPIInit()
    {
        $this->registerRestRoute();
        $this->registerRestField();
    }

    private function registerRestRoute()
    {
        $apiNamespace = 'publishpress-future/v1';

        register_rest_route( $apiNamespace, '/post-expiration/(?P<postId>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'api_get_expiration_data'],
            'permission_callback' => function () {
                return current_user_can(CapabilitiesAbstract::EXPIRE_POST);
            },
            'args' => [
                'postId' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_numeric($param);
                    },
                    'sanitize_callback' => 'absint',
                    'required' => true,
                    'type' => 'integer',
                ],
            ]
        ]);

        register_rest_route($apiNamespace, '/post-expiration/(?P<postId>\d+)', [
            'methods' => 'POST',
            'callback' => [$this, 'api_save_expiration_data'],
            'permission_callback' => function () {
                return current_user_can(CapabilitiesAbstract::EXPIRE_POST);
            },
            'args' => [
                'postId' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_numeric($param);
                    },
                    'sanitize_callback' => 'absint',
                    'required' => true,
                    'type' => 'integer',
                ],
                'enabled' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_bool($param);
                    },
                    'sanitize_callback' => 'sanitize_text_field',
                    'required' => false,
                    'type' => 'bool',
                ],
                'date' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_numeric($param);
                    },
                    'sanitize_callback' => 'absint',
                    'required' => true,
                    'type' => 'integer',
                ],
                'action' => [
                    'validate_callback' => function ($param, $request, $key) {
                        // Get available future action actions using the service EXPIRATION_ACTIONS_MODEL.
                        $container = Container::getInstance();
                        $expirationActionsModel = $container->get(ServicesAbstract::EXPIRATION_ACTIONS_MODEL);
                        $expirationActions = array_keys($expirationActionsModel->getActions());

                        return in_array($param, $expirationActions) || $param === '';
                    },
                    'sanitize_callback' => 'sanitize_text_field',
                    'required' => true,
                    'type' => 'string',
                ],
                'terms' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_array($param);
                    },
                    'sanitize_callback' => function ($param, $request, $key) {
                        return array_map('absint', $param);
                    },
                    'required' => true,
                    'type' => 'array',
                ],
            ]
        ]);

        register_rest_route( $apiNamespace, '/taxonomies/(?P<postType>[a-z\-_0-9A-Z]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'api_get_post_type_taxonomies'],
            'permission_callback' => function () {
                return current_user_can(CapabilitiesAbstract::EXPIRE_POST);
            },
            'args' => [
                'postType' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return sanitize_key($param);
                    },
                    'sanitize_callback' => 'sanitize_key',
                    'required' => true,
                    'type' => 'string',
                ],
            ]
        ]);
    }

    private function registerRestField()
    {
        $container = Container::getInstance();
        $settingsModelFactory = $container->get(ServicesAbstract::POST_TYPE_SETTINGS_MODEL_FACTORY);

        $settingsModel = $settingsModelFactory();
        $settings = $settingsModel->getPostTypesSettings();

        $activePostTypes = array_filter($settings, function ($postTypeSettings) {
            return $postTypeSettings['active'];
        });
        $activePostTypes = array_keys($activePostTypes);

        foreach ($activePostTypes as $postType) {
            register_rest_field(
                $postType,
                'publishpress_future_action',
                [
                    'get_callback' => function ($post) {
                        $postModelFactory = $this->expirablePostModelFactory;
                        $postModel = $postModelFactory($post['id']);

                        $isEnabled = $postModel->isExpirationEnabled();

                        if ('auto-draft' === $post['status'] && !$isEnabled) {
                            return [
                                'enabled' => false,
                                'date' => '',
                                'action' => '',
                                'terms' => [],
                                'taxonomy' => '',
                            ];
                        }

                        $date = $postModel->getExpirationDateString(false);
                        $action = $postModel->getExpirationType();
                        $terms = $postModel->getExpirationCategoryIDs();
                        $taxonomy = $postModel->getExpirationTaxonomy();

                        if (empty($date)) {
                            $defaultDataModelFactory = Container::getInstance()->get(ServicesAbstract::POST_TYPE_DEFAULT_DATA_MODEL_FACTORY);
                            $defaultDataModel = $defaultDataModelFactory->create($post['post_type']);

                            $defaultExpirationDate = $defaultDataModel->getActionDateParts();
                            $date = $defaultExpirationDate['iso'];

                            $action = $defaultDataModel->getDefaultActionForPostType($post['post_type']);
                            $terms = [];
                            $taxonomy = '';
                        }

                        return [
                            'enabled' => $postModel->isExpirationEnabled(),
                            'date' => $date,
                            'action' => $action,
                            'terms' => $terms,
                            'taxonomy' => $taxonomy,
                        ];
                    },
                    'update_callback' => function ($value, $post) {
                        if (isset($value['enabled']) && (bool)$value['enabled']) {
                            $opts = [
                                'expireType' => sanitize_text_field($value['action']),
                                'category' => array_map('sanitize_text_field', $value['terms']),
                                'categoryTaxonomy' => sanitize_text_field($value['taxonomy']),
                            ];

                            $opts['category'] = $this->taxonomiesModel->normalizeTermsCreatingIfNecessary(
                                $opts['categoryTaxonomy'],
                                $opts['category']
                            );

                            do_action(
                                HooksAbstract::ACTION_SCHEDULE_POST_EXPIRATION,
                                $post->ID,
                                strtotime($value['date']),
                                $opts
                            );
                            return true;
                        }

                        $this->hooks->doAction(HooksAbstract::ACTION_UNSCHEDULE_POST_EXPIRATION, $post->ID);

                        return true;
                    },
                    'schema' => [
                        'description' => 'Future action',
                        'type' => 'object',
                    ]
                ]
            );
        }
    }
}

<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;

defined('ABSPATH') or die('Direct access not allowed.');
?>
<div class="post-expire-col" data-id="<?php echo esc_attr($id); ?>"
     data-expire-attributes="<?php echo esc_attr(wp_json_encode($attributes)); ?>">
    <?php
    $iconClass = '';
    $iconTitle = '';

    $container = Container::getInstance();
    $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
    $postModel = $factory($id);

    $expirationEnabled = $postModel->isExpirationEnabled();
    $expirationDate = $postModel->getExpirationDateAsUnixTime();

    if ($expirationEnabled) {
        $format = get_option('date_format') . ' ' . get_option('time_format');
        $action = $postModel->getExpirationAction();

        if (is_object($action)) {
            ?><span class="dashicons dashicons-clock icon-scheduled" aria-hidden="true"></span> <?php

            if ($column_style === 'simple') {
                echo esc_html(PostExpirator_Util::get_wp_date($format, $expirationDate));
            } else {
                echo sprintf(
                    esc_html__('%1$s%2$s%3$s on %5$s%4$s%6$s', 'post-expirator'),
                    '<span class="future-action-action-name">',
                    esc_html($action->getDynamicLabel()),
                    '</span>',
                    esc_html(PostExpirator_Util::get_wp_date($format, $expirationDate)),
                    '<span class="future-action-action-date">',
                    '</span>'
                );

                $categoryActions = [
                    ExpirationActionsAbstract::POST_CATEGORY_ADD,
                    ExpirationActionsAbstract::POST_CATEGORY_SET,
                    ExpirationActionsAbstract::POST_CATEGORY_REMOVE,
                ];

                if (in_array($action, $categoryActions)) {
                    $actionTerms = $postModel->getExpirationCategoryNames();
                    if (!empty($actionTerms)) {
                        ?>
                        <div class="future-action-gray">[<?php echo esc_html(implode(', ', $actionTerms)); ?>]</div>
                        <?php
                    }
                }
            }

        } else {
            ?><span class="dashicons dashicons-warning icon-missed" aria-hidden="true"></span> <?php
            echo esc_html__('Action could not be scheduled due to a configuration issue. Please attempt to schedule it again.', 'post-expirator');
        }
    } else {
        ?>
        <span aria-hidden="true">—</span>
        <span class="screen-reader-text"><?php echo esc_html__('No future action', 'post-expirator'); ?></span>
        <?php
    }

    $actionEnabled = $postModel->isExpirationEnabled();
    $actionDate = $postModel->getExpirationDateString(false);
    $actionTaxonomy = $postModel->getExpirationTaxonomy();
    $action = $postModel->getExpirationAction();
    $actionTerms = implode(',', $postModel->getExpirationCategoryIDs());

    // The hidden fields will be used by quick edit to feed the react component.
    ?>
    <input type="hidden" id="future_action_date-<?php echo esc_attr($id); ?>" name="future_action_date" value="<?php echo esc_attr($actionDate); ?>" />
    <input type="hidden" id="future_action_enabled-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($actionEnabled); ?>" />
    <input type="hidden" id="future_action_action-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($action); ?>" />
    <input type="hidden" id="future_action_terms-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($actionTerms); ?>" />
    <input type="hidden" id="future_action_taxonomy-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($actionTaxonomy); ?>" />
</div>

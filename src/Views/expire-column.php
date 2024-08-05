<?php

/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

$container = Container::getInstance();
$factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
$postModel = $factory($id);

$actionEnabled = $postModel->isExpirationEnabled();
$actionDate = $postModel->getExpirationDateString(false);
$actionDateUnix = $postModel->getExpirationDateAsUnixTime();
$actionTaxonomy = $postModel->getExpirationTaxonomy();
$actionType = $postModel->getExpirationType();
$action = $postModel->getExpirationAction();
$actionTerms = implode(',', $postModel->getExpirationCategoryIDs());

?>
<div
    id="post-expire-column-<?php echo esc_attr($id); ?>"
    class="post-expire-col"
    data-id="<?php echo esc_attr($id); ?>"
    data-action-new-status="<?php echo esc_attr($postModel->getExpirationNewStatus()); ?>"
    data-action-enabled="<?php echo esc_attr($actionEnabled ? '1' : '0'); ?>"
    data-action-date="<?php echo esc_attr($actionDate); ?>"
    data-action-date-unix="<?php echo esc_attr($actionDateUnix); ?>"
    data-action-taxonomy="<?php echo esc_attr($actionTaxonomy); ?>"
    data-action-type="<?php echo esc_attr($actionType); ?>"
    data-action-terms="<?php echo esc_attr($actionTerms); ?>"
    >
    <?php
    $iconClass = '';
    $iconTitle = '';

    if ($actionEnabled) {
        $format = get_option('date_format') . ' ' . get_option('time_format');
        $container = Container::getInstance();

        $formatedDate = $container->get(ServicesAbstract::DATETIME)->getWpDate($format, $actionDateUnix);

        if (is_object($action)) {
            ?><span class="dashicons dashicons-clock icon-scheduled" aria-hidden="true"></span> <?php

if ($columnStyle === 'simple') {
    echo esc_html($formatedDate);
} else {
    echo sprintf(
    // phpcs:ignore Generic.Files.LineLength.TooLong
    // translators: %1$s opens a span tag, %2$s is the action name, %3$s ends a span tag, %4$s is the a span tag, %5$s is the a span tag, %6$s is the a span tag
        esc_html__('%1$s%2$s%3$s on %5$s%4$s%6$s', 'post-expirator'),
        '<span class="future-action-action-name">',
        esc_html($action->getDynamicLabel($postModel->getPostType())),
        '</span>',
        esc_html($formatedDate),
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

    if ($actionType === ExpirationActionsAbstract::CHANGE_POST_STATUS) {
        $newStatus = $postModel->getExpirationNewStatus();
        $newStatus = get_post_status_object($newStatus);
        if ($newStatus) {
            ?>
                        <div class="future-action-gray">[<?php echo esc_html($newStatus->label); ?>]</div>
                        <?php
        }
    }
}
        } else {
            ?>
            <span class="dashicons dashicons-warning icon-missed" aria-hidden="true"></span>
            <?php
            echo esc_html__(
                'Action was not scheduled due to a configuration issue. Please attempt to schedule it again.',
                'post-expirator'
            );
        }
    } else {
        ?>
        <span aria-hidden="true">—</span>
        <span class="screen-reader-text"><?php echo esc_html__('No future action', 'post-expirator'); ?></span>
        <?php
    }
    ?>
</div>

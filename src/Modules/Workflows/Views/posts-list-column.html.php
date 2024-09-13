<?php

defined('ABSPATH') or die('Direct access not allowed.');

$wpDateFormat = get_option('date_format') . ' ' . get_option('time_format');

foreach ($enabledWorkflows as $workflowModel) :
    $schedules = $postModel->getManuallyEnabledWorkflowsSchedule($workflowModel->getId());
    $workflowLabel = $workflowModel->getManualSelectionLabel();

    if (empty($schedules)) :
        continue;
    endif;

    foreach ($schedules as $schedule) :
        if (empty($schedule)) :
            continue;
        endif;

        $timestamp = $schedule['timestamp'];
        if (! is_numeric($timestamp)) :
            $timestamp = strtotime($timestamp);
        endif;

        ?>
        <div class="post-expire-col">
            <span class="dashicons dashicons-clock icon-scheduled" aria-hidden="true"></span>
            <span class="future-action-action-name"><?php echo esc_html($workflowLabel); ?></span>
            <span class="future-action-action-date"><?php echo esc_html(wp_date($wpDateFormat, $timestamp)); ?></span>
        </div>
        <?php
    endforeach;
endforeach;

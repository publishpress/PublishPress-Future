<?php

defined('ABSPATH') or die('Direct access not allowed.');
?>

<a class="pp-future-workflow-preview" href="<?php echo esc_url($screenshotFull); ?>" target="_blank">
    <img
        src="<?php echo esc_url($screenshot); ?>"
        alt="<?php echo esc_attr__('Screenshot', 'post-expirator'); ?>"
        style="max-width: 100px; height: auto;"
    />
</a>

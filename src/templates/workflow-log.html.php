<div class="wrap">
    <h1 class="wp-heading-inline"><?php echo __('Future Log', 'publishpress-future-pro'); ?></h1>
    <?php
    $deleteUrlArgs = [
        'action' => 'delete-all-logs',
        'nonce' => wp_create_nonce('delete-all-logs'),
    ];
    ?>
    <a class="page-title-action" id="delete-all-logs" href="<?php echo add_query_arg($deleteUrlArgs); ?>">
        <?php echo __('Delete All Logs', 'publishpress-future-pro'); ?>
    </a>

    <p>TODO: Add setting to disable the log</p>
    <p>TODO: Add Filters</p>

    <?php
    $table->display(); ?>
</div>

<?php
PostExpirator_Facade::load_assets('settings');
PostExpirator_Display::getInstance()->publishpress_footer();
?>

<style type="text/css">
    .wp-list-table .column-id {
        width: 5%;
    }

    .wp-list-table .column-post {
        width: 30%;
    }

    .wp-list-table .column-content {
        width: 45%;
    }

    .wp-list-table .column-created_at {
        width: 20%;
    }
</style>

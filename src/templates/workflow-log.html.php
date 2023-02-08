<div class="wrap">
    <div id="icon-users" class="icon32"></div>
    <h2>Future Log</h2>

    <p>TODO: Add support to sortable columns</p>
    <p>TODO: Add Pagination</p>
    <p>TODO: Add Filters</p>
    <p>TODO: Add button to delete all logs</p>

    <?php
    $table->display(); ?>
</div>

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

<?php

defined('ABSPATH') or die('Direct access not allowed.');

?>
<div class="pp-columns-wrapper<?php echo $showSideBar ? ' pp-enable-sidebar' : ''; ?>">
    <div class="pp-column-left">
        <div id="publishpress-future-settings-post-types"></div>
    </div>

<?php
    if ($showSideBar) {
        include __DIR__ . '/ad-banner-right-sidebar.php';
    }
?>
</div>

<?php

use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Modules\Expirator\Tables\ScheduledActionsTable;

defined('ABSPATH') or die('Direct access not allowed.');

?>
<form method="post">
    <?php
    $container = Container::getInstance();
    $tableFactory = $container->get(ServicesAbstract::SCHEDULED_ACTIONS_TABLE_FACTORY);
    $table = $tableFactory();
    $table->display_page();
    ?>
</form>
<?php PostExpirator_Display::getInstance()->publishpress_footer();

<?php
use PublishPressFuture\Modules\Expirator\Schemas\ActionArgsSchema;

ActionArgsSchema::dropTableIfExists();
ActionArgsSchema::createTableIfNotExists();

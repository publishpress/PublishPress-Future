<?php

use PublishPressFuture\Core\Container;
use PublishPressFuture\Core\ServicesAbstract;
use PublishPressFuture\Module\Debug\ActionHooksAbstract as DebugHooksAbstract;
use PublishPressFuture\Module\Debug\Logger;
use PublishPressFuture\Module\Debug\LoggerInterface;

/**
 * The class that adds debug entries to the database.
 *
 * @deprecated 2.8.0
 */
class PostExpiratorDebug
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var string
     * @deprecated 2.8.0
     */
    private $debug_table;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->hooks = Container::getInstance()->get(ServicesAbstract::HOOKS_FACADE);
    }

    /**
     * Drop Database Table.
     */
    public function removeDBTable()
    {
        $this->hooks->doAction(DebugHooksAbstract::DROP_DATABASE_TABLE);
    }

    /**
     * Insert into Database Table.
     */
    public function save($data)
    {
        $this->hooks->doAction(DebugHooksAbstract::LOG_DEBUG, $data['message']);
    }

    /**
     * Get the HTML of the table's data.
     */
    public function getTable()
    {
        return $this->hooks->applyFilters(DebugHooksAbstract::FETCH_ALL_LOGS, []);

    }

    /**
     * Truncate Database Table.
     */
    public function purge()
    {
        $this->hooks->doAction(DebugHooksAbstract::DELETE_LOGS);
    }
}

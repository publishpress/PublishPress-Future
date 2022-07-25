<?php

use PublishPressFuture\Core\Container;
use PublishPressFuture\Core\ServicesAbstract;
use PublishPressFuture\Module\Debug\HooksAbstract as DebugHooksAbstract;
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
        $this->hooks->doAction(DebugHooksAbstract::ACTION_LOGGER_DROP_DATABASE_TABLE);
    }

    /**
     * Insert into Database Table.
     */
    public function save($data)
    {
        $this->hooks->doAction(DebugHooksAbstract::ACTION_LOGGER_DEBUG, $data['message']);
    }

    /**
     * Get the HTML of the table's data.
     */
    public function getTable()
    {
        return $this->hooks->applyFilters(DebugHooksAbstract::FILTER_LOGGER_FETCH_ALL, []);

    }

    /**
     * Truncate Database Table.
     */
    public function purge()
    {
        $this->hooks->doAction(DebugHooksAbstract::ACTION_LOGGER_DELETE_LOGS);
    }
}

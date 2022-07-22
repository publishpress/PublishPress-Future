<?php

use PublishPressFuture\Core\Container;
use PublishPressFuture\Core\ServicesAbstract;
use PublishPressFuture\Module\Debug\Logger;

/**
 * The class that adds debug entries to the database.
 *
 * @deprecated 2.8.0
 */
class PostExpiratorDebug
{
    /**
     * @var Logger
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
        $this->logger = Container::getInstance()->get(ServicesAbstract::LOGGER);
    }

    /**
     * Drop Database Table.
     */
    public function removeDBTable()
    {
        $this->logger->dropDatabaseTable();
    }

    /**
     * Insert into Database Table.
     */
    public function save($data)
    {
        $this->logger->debug($data['message']);
    }

    /**
     * Get the HTML of the table's data.
     */
    public function getTable()
    {
        return $this->logger->fetchEntries();

    }

    /**
     * Truncate Database Table.
     */
    public function purge()
    {
        $this->logger->deleteLogs();
    }
}

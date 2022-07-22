<?php

namespace PublishPressFuture\Module\Debug;

use Psr\Log\LogLevel;
use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\WordPress\DatabaseFacade;
use PublishPressFuture\Core\WordPress\SiteFacade;

class Logger implements LoggerInterface
{
    /**
     * @var string
     */
    private $dbTableName;

    /**
     * @var DatabaseFacade
     */
    private $db;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var SiteFacade
     */
    private $site;

    public function __construct(HookableInterface $hooksFacade, $databaseFacade, $siteFacade)
    {
        $this->db = $databaseFacade;
        $this->hooks = $hooksFacade;
        $this->site = $siteFacade;

        $this->dbTableName = $this->db->getTablePrefix() . 'postexpirator_debug';
    }

    public function initialize()
    {
        if ($this->databaseTableDoNotExists()) {
            $this->createDatabaseTable();
        }
    }

    private function getDatabaseTableName()
    {
        return $this->db->escape($this->dbTableName);
    }

    private function databaseTableDoNotExists()
    {
        $databaseTableName = $this->getDatabaseTableName();

        return $this->db->getVar("SHOW TABLES LIKE '{$databaseTableName}'") !== $this->dbTableName;
    }

    private function createDatabaseTable()
    {
        $databaseTableName = $this->getDatabaseTableName();

        $tableStructure = "CREATE TABLE `{$databaseTableName}` (
            `id` INT(9) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `timestamp` TIMESTAMP NOT NULL,
            `blog` INT(9) NOT NULL,
            `message` text NOT NULL
        );";

        $this->db->modifyStructure($tableStructure);
    }

    public function deleteLogs()
    {
        $databaseTableName = $this->getDatabaseTableName();

        $this->db->query("TRUNCATE TABLE {$databaseTableName}");
    }

    /**
     * System is unusable.
     *
     * @param string $message
     * @param array $context
     * @return void
     */
    public function emergency($message, $context = [])
    {
        $this->log(LogLevel::EMERGENCY, $message, $context);
    }

    /**
     * Action must be taken immediately.
     *
     * Example: Entire website down, database unavailable, etc. This should
     * trigger the SMS alerts and wake you up.
     *
     * @param string $message
     * @param array $context
     * @return void
     */
    public function alert($message, $context = [])
    {
        $this->log(LogLevel::ALERT, $message, $context);
    }

    /**
     * Critical conditions.
     *
     * Example: Application component unavailable, unexpected exception.
     *
     * @param string $message
     * @param array $context
     * @return void
     */
    public function critical($message, $context = [])
    {
        $this->log(LogLevel::CRITICAL, $message, $context);
    }

    /**
     * Runtime errors that do not require immediate action but should typically
     * be logged and monitored.
     *
     * @param string $message
     * @param array $context
     * @return void
     */
    public function error($message, $context = [])
    {
        $this->log(LogLevel::ERROR, $message, $context);
    }

    /**
     * Exceptional occurrences that are not errors.
     *
     * Example: Use of deprecated APIs, poor use of an API, undesirable things
     * that are not necessarily wrong.
     *
     * @param string $message
     * @param array $context
     * @return void
     */
    public function warning($message, $context = [])
    {
        $this->log(LogLevel::WARNING, $message, $context);
    }

    /**
     * Normal but significant events.
     *
     * @param string $message
     * @param array $context
     * @return void
     */
    public function notice($message, $context = [])
    {
        $this->log(LogLevel::NOTICE, $message, $context);
    }

    /**
     * Interesting events.
     *
     * Example: User logs in, SQL logs.
     *
     * @param string $message
     * @param array $context
     * @return void
     */
    public function info($message, $context = [])
    {
        $this->log(LogLevel::INFO, $message, $context);
    }

    /**
     * Detailed debug information.
     *
     * @param string $message
     * @param array $context
     * @return void
     */
    public function debug($message, $context = [])
    {
        $this->log(LogLevel::DEBUG, $message, $context);
    }

    /**
     * Logs with an arbitrary level.
     *
     * @param mixed $level
     * @param string $message
     * @param array $context
     * @return void
     */
    public function log($level, $message, $context = [])
    {
        $levelDescription = strtoupper($level);

        $databaseTableName = $this->getDatabaseTableName();

        $fullMessage = sprintf(
            '%s: %s',
            $levelDescription,
            $message
        );

        if (! empty($context)) {
            $fullMessage .= '[' . implode(', ', $context) . ']';
        }

        $this->db->query(
            $this->db->prepare(
                "INSERT INTO {$databaseTableName} (`timestamp`,`message`,`blog`) VALUES (FROM_UNIXTIME(%d),%s,%s)",
                time(),
                $fullMessage,
                $this->site->getBlogId()
            )
        );
    }

    /**
     * @return array
     */
    public function fetchAll()
    {
        $databaseTableName = $this->getDatabaseTableName();

        return (array)$this->db->getResults("SELECT * FROM {$databaseTableName} ORDER BY `id` ASC");
    }

    /**
     * @return void
     */
    public function dropDatabaseTable()
    {
        $databaseTableName = $this->getDatabaseTableName();

        $this->db->dropTable($databaseTableName);
    }
}

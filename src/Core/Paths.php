<?php

namespace PublishPressFuture\Core;

class Paths
{
    /**
     * @var string
     */
    private $baseDir;

    public function __construct($baseDir)
    {
        $this->baseDir = (string) $baseDir;
    }

    public function getBaseDirPath()
    {
        return rtrim($this->baseDir, '/');
    }

    public function getVendorDirPath()
    {
        return $this->getBaseDirPath() . '/vendor';
    }
}

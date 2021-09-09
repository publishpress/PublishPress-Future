<?php

use PublishPressBuilder\PackageBuilderTasks;

/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see http://robo.li/
 */
class RoboFile extends PackageBuilderTasks
{
    public function __construct()
    {
        parent::__construct();

        $this->appendToFileToIgnore(
            [
                'docker-compose.yml',
                'codecept.conf.js',
                'codeceptjs',
                'Gruntfile.js',
                'jsconfig.json',
                'logs',
                'phpcs.xml',
            ]
        );

        $this->setVersionConstantName('POSTEXPIRATOR_VERSION');
    }
}

<?php

use PublishPressBuilder\PackageBuilderTasks;

/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see http://robo.li/
 */
class RoboFile extends PackageBuilderTasks
{

    /**
     * The constructor.
     */
    public function __construct()
    {
        $this->setPluginFilename('post-expirator.php');
        $this->setVersionConstantName('POSTEXPIRATOR_VERSION');

        $this->appendToFileToIgnore(
            array(
                'docker-compose.yml',
                'codecept.conf.js',
                'codeceptjs',
                'Gruntfile.js',
                'jsconfig.json',
                'logs',
                '.phpcs.xml',
                '.distignore',
                '.phplint-cache',
                '.php-cs-fixer.cache',
                'psalm.xml',
                'report.csv',
                '.github',
                '.vscode',
                '.acceptance.env.template.yml',
                'publishpress-future.code-workspace',
                'screenshot-1.png',
                'screenshot-2.png',
                'screenshot-3.png'
            )
        );

        parent::__construct();
    }
}

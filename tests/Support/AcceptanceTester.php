<?php

declare(strict_types=1);

namespace Tests\Support;


/**
 * Inherited Methods
 * @method void wantTo($text)
 * @method void wantToTest($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method void pause($vars = [])
 *
 * @SuppressWarnings(PHPMD)
*/
class AcceptanceTester extends \Codeception\Actor
{
    use _generated\AcceptanceTesterActions;

    /**
     * Define custom actions here
     */
    use GherkinSteps\Users;
    use GherkinSteps\Menu;
    use GherkinSteps\Plugins;
    use GherkinSteps\Post;
    use GherkinSteps\PostGutenberg;
    use GherkinSteps\PostClassicEditor;
    use GherkinSteps\Settings;
    use GherkinSteps\Options;
    use GherkinSteps\Debug;
    use GherkinSteps\Cli;
}

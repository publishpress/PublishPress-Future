<?php

declare(strict_types=1);

namespace Tests\Support;

use Codeception\Actor;
use Steps\Cli;
use Steps\Debug;
use Steps\Menu;
use Steps\Options;
use Steps\Plugins;
use Steps\Post;
use Steps\PostClassicEditor;
use Steps\PostGutenberg;
use Steps\Settings;
use Steps\Users;

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
    use Users;
    use Menu;
    use Plugins;
    use Post;
    use PostGutenberg;
    use PostClassicEditor;
    use Settings;
    use Options;
    use Debug;
    use Cli;
}

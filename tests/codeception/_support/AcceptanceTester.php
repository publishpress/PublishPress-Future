<?php

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
 * @method void wantToTest($text)
 * @method void wantTo($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method void pause()
 *
 * @SuppressWarnings(PHPMD)
*/
class AcceptanceTester extends Actor
{
    use _generated\AcceptanceTesterActions;

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

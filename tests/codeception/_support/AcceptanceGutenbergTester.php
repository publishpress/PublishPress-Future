<?php


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
class AcceptanceGutenbergTester extends \Codeception\Actor
{
    use _generated\AcceptanceGutenbergTesterActions;
    use \Steps\Users;
    use \Steps\Menu;
    use \Steps\Plugins;
    use \Steps\Post;
    use \Steps\PostGutenberg;
    use \Steps\Debug;
}

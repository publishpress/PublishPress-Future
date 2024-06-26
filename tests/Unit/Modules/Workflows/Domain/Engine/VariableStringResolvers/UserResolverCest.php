<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\PostResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\UserResolver;
use stdClass;
use Tests\Support\UnitTester;

class UserResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new UserResolver(new stdClass);

        $I->assertEquals('user', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $I->assertEquals('23', $resolver->getValueAsString('ID'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyDoesNotExist(UnitTester $I)
    {
        $user = new stdClass();

        $resolver = new UserResolver($user);

        $I->assertEquals('', $resolver->getValueAsString('non_existent_key'));
    }
}

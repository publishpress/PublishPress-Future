<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\UserResolver;
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
        $I->assertEquals('23', $resolver->getValueAsString('id'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyDoesNotExist(UnitTester $I)
    {
        $user = new stdClass();

        $resolver = new UserResolver($user);

        $I->assertEquals('', $resolver->getValueAsString('non_existent_key'));
    }

    public function issetReturnsTrueWhenPropertyExists(UnitTester $I)
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $I->assertTrue(isset($resolver->ID));
        $I->assertTrue(isset($resolver->id));
    }

    public function issetReturnsFalseWhenPropertyDoesNotExist(UnitTester $I)
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $I->assertFalse(isset($resolver->non_existent_key));
    }

    public function getReturnsValueWhenPropertyExists(UnitTester $I)
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $I->assertEquals(23, $resolver->ID);
    }

    public function getReturnsNullWhenPropertyDoesNotExist(UnitTester $I)
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $I->assertNull($resolver->non_existent_key);
    }

    public function setDoesNothing(UnitTester $I)
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $resolver->ID = 24;

        $I->assertEquals(23, $resolver->ID);
    }

    public function unsetDoesNothing(UnitTester $I)
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        unset($resolver->ID);

        $I->assertEquals(23, $resolver->ID);
    }

    public function toStringReturnsCorrectValue(UnitTester $I)
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $I->assertEquals('{"ID":23}', (string) $resolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $I->assertEquals(['type' => 'user', 'value' => 23], $resolver->compact());
    }
}

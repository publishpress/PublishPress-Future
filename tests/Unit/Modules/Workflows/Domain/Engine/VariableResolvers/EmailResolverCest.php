<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\EmailResolver;
use Tests\Support\UnitTester;

class EmailResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        $I->assertEquals('email', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        $I->assertEquals('a@a.com', $resolver->getValueAsString());
    }

    public function issetReturnsFalse(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        $I->assertFalse(isset($resolver->variable));
        $I->assertFalse(isset($resolver->non_existent_property));
    }

    public function getReturnsNull(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        $I->assertNull($resolver->variable);
        $I->assertNull($resolver->non_existent_property);
    }

    public function setDoesNothing(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        $resolver->variable = 'b@a.com';

        $I->assertNull($resolver->variable);
        $I->assertEquals('a@a.com', $resolver->getValueAsString());
    }

    public function unsetDoesNothing(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        unset($resolver->variable);

        $I->assertEquals('a@a.com', $resolver->getValueAsString());
    }

    public function __toStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        $I->assertEquals('a@a.com', (string)$resolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        $I->assertEquals(['type' => 'email', 'value' => 'a@a.com'], $resolver->compact());
    }
}

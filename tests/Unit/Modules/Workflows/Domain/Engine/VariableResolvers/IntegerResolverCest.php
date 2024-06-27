<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use Tests\Support\UnitTester;

class IntegerResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new IntegerResolver(23);

        $I->assertEquals('integer', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new IntegerResolver(23);

        $I->assertEquals('23', $resolver->getValueAsString());
    }

    public function getValueAsStringReturnsZeroWhenZero(UnitTester $I)
    {
        $resolver = new IntegerResolver(0);

        $I->assertEquals('0', $resolver->getValueAsString());
    }

    public function getValueAsStringReturnsZeroWhenNegativeZero(UnitTester $I)
    {
        $resolver = new IntegerResolver(-0);

        $I->assertEquals('0', $resolver->getValueAsString());
    }

    public function getValueAsStringReturnsCorrectValueWhenNegative(UnitTester $I)
    {
        $resolver = new IntegerResolver(-23);

        $I->assertEquals('-23', $resolver->getValueAsString());
    }

    public function getValueAsStringReturnsCorrectValueWhenPositive(UnitTester $I)
    {
        $resolver = new IntegerResolver(23);

        $I->assertEquals('23', $resolver->getValueAsString());
    }

    public function issetReturnsFalse(UnitTester $I)
    {
        $resolver = new IntegerResolver(23);

        $I->assertFalse(isset($resolver->variable));
        $I->assertFalse(isset($resolver->non_existent_property));
    }

    public function getReturnsNull(UnitTester $I)
    {
        $resolver = new IntegerResolver(23);

        $I->assertNull($resolver->variable);
        $I->assertNull($resolver->non_existent_property);
    }

    public function setDoesNothing(UnitTester $I)
    {
        $resolver = new IntegerResolver(23);

        $resolver->variable = 24;

        $I->assertNull($resolver->variable);
        $I->assertEquals('23', $resolver->getValueAsString());
    }

    public function unsetDoesNothing(UnitTester $I)
    {
        $resolver = new IntegerResolver(23);

        unset($resolver->variable);

        $I->assertEquals('23', $resolver->getValueAsString());
    }

    public function __toStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new IntegerResolver(23);

        $I->assertEquals('23', (string)$resolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $resolver = new IntegerResolver(34);

        $I->assertEquals(['type' => 'integer', 'value' => 34], $resolver->compact());
    }
}

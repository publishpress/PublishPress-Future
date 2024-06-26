<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\IntegerResolver;
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
}

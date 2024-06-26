<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\ArrayResolver;
use Tests\Support\UnitTester;

class ArrayResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $I->assertEquals('array', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $I->assertEquals('value', $resolver->getValueAsString('key'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $I->assertEquals('', $resolver->getValueAsString('non_existent_key'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsNull(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => null]);

        $I->assertEquals('', $resolver->getValueAsString('key'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsEmptyString(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => '']);

        $I->assertEquals('', $resolver->getValueAsString('key'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsFalse(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => false]);

        $I->assertEquals('', $resolver->getValueAsString('key'));
    }

    public function getValueAsStringReturnsZeroStringWhenPropertyIsZero(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 0]);

        $I->assertEquals('0', $resolver->getValueAsString('key'));
    }
}

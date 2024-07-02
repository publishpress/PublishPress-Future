<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\ArrayResolver;
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

    public function issetReturnsTrueWhenPropertyExists(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $I->assertTrue(isset($resolver->key));
    }

    public function issetReturnsFalseWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $I->assertFalse(isset($resolver->non_existent_key));
    }

    public function getReturnsCorrectValueWhenPropertyExists(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $I->assertEquals('value', $resolver->key);
    }

    public function getReturnsNullWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $I->assertNull($resolver->non_existent_key);
    }

    public function setSetsValue(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $resolver->key = 'new_value';

        $I->assertEquals('value', $resolver->key);
    }

    public function unsetRemovesProperty(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        unset($resolver->key);

        $I->assertNotNull($resolver->key);
    }

    public function toStringReturnsJsonEncodedArray(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $I->assertEquals('{"key":"value"}', (string)$resolver);
    }

    public function toStringReturnsEmptyJsonWhenArrayIsEmpty(UnitTester $I)
    {
        $resolver = new ArrayResolver([]);

        $I->assertEquals('[]', (string)$resolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $resolver = new ArrayResolver(['key' => 'value']);

        $I->assertEquals(['type' => 'array', 'value' => ['key' => 'value']], $resolver->compact());
    }
}

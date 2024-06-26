<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\NodeResolver;
use Tests\Support\UnitTester;

class NodeResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('node', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('34', $resolver->getValueAsString('ID'));
        $I->assertEquals('Node Name', $resolver->getValueAsString('name'));
        $I->assertEquals('Node Label', $resolver->getValueAsString('label'));
        $I->assertEquals('2021-01-01 00:00:00', $resolver->getValueAsString('activation_timestamp'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyNotExists(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('', $resolver->getValueAsString('non_existent_property'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsNull(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('', $resolver->getValueAsString('non_existent_property'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsEmptyString(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('', $resolver->getValueAsString(''));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsFalse(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('', $resolver->getValueAsString(false));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsZero(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('', $resolver->getValueAsString(0));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsZeroString(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('', $resolver->getValueAsString('0'));
    }
}

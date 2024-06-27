<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
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

    public function issetReturnsTrueWhenPropertyExists(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertTrue(isset($resolver->ID));
        $I->assertTrue(isset($resolver->name));
        $I->assertTrue(isset($resolver->label));
        $I->assertTrue(isset($resolver->activation_timestamp));
    }

    public function issetReturnsFalseWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertFalse(isset($resolver->non_existent_property));
    }

    public function getReturnsCorrectValueWhenPropertyExists(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals(34, $resolver->ID);
        $I->assertEquals('Node Name', $resolver->name);
        $I->assertEquals('Node Label', $resolver->label);
        $I->assertEquals('2021-01-01 00:00:00', $resolver->activation_timestamp);
    }

    public function getReturnsNullWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertNull($resolver->non_existent_property);
    }

    public function setSetsValueDoNotChangeTheValues(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $resolver->ID = 35;
        $resolver->name = 'New Node Name';
        $resolver->label = 'New Node Label';
        $resolver->activation_timestamp = '2021-01-02 00:00:00';

        $I->assertEquals(34, $resolver->ID);
        $I->assertEquals('Node Name', $resolver->name);
        $I->assertEquals('Node Label', $resolver->label);
        $I->assertEquals('2021-01-01 00:00:00', $resolver->activation_timestamp);
    }

    public function unsetRemovesProperty(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        unset($resolver->ID);
        unset($resolver->name);
        unset($resolver->label);
        unset($resolver->activation_timestamp);

        $I->assertNotNull($resolver->ID);
        $I->assertNotNull($resolver->name);
        $I->assertNotNull($resolver->label);
        $I->assertNotNull($resolver->activation_timestamp);
    }

    public function toStringReturnsJsonEncodedArray(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('{"ID":34,"name":"Node Name","label":"Node Label","activation_timestamp":"2021-01-01 00:00:00"}', (string)$resolver);
    }

    public function toStringReturnsEmptyJsonWhenArrayIsEmpty(UnitTester $I)
    {
        $resolver = new NodeResolver([]);

        $I->assertEquals('[]', (string)$resolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $resolver = new NodeResolver([
            'ID' => 34,
            'name' => 'Node Name',
            'label' => 'Node Label',
            'activation_timestamp' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals(
            [
                'type' => 'node',
                'value' => [
                    'ID' => 34,
                    'name' => 'Node Name',
                    'label' => 'Node Label',
                    'activation_timestamp' => '2021-01-01 00:00:00'
                ]
            ],
            $resolver->compact()
        );
    }
}

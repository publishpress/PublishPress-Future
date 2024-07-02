<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use Tests\Support\UnitTester;

class WorkflowResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('workflow', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('34', $resolver->getValueAsString('ID'));
        $I->assertEquals('34', $resolver->getValueAsString('id'));
        $I->assertEquals('Workflow Name', $resolver->getValueAsString('title'));
        $I->assertEquals('Workflow description', $resolver->getValueAsString('description'));
        $I->assertEquals('2021-01-01 00:00:00', $resolver->getValueAsString('modified_at'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyNotExists(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('', $resolver->getValueAsString('non_existent_property'));
    }

    public function issetReturnsTrueWhenPropertyExists(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $I->assertTrue(isset($resolver->ID));
        $I->assertTrue(isset($resolver->id));
        $I->assertTrue(isset($resolver->title));
        $I->assertTrue(isset($resolver->description));
        $I->assertTrue(isset($resolver->modified_at));
    }

    public function issetReturnsFalseWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $I->assertFalse(isset($resolver->non_existent_property));
    }

    public function getReturnsCorrectValueWhenPropertyExists(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals(34, $resolver->ID);
        $I->assertEquals('Workflow Name', $resolver->title);
        $I->assertEquals('Workflow description', $resolver->description);
        $I->assertEquals('2021-01-01 00:00:00', $resolver->modified_at);
    }

    public function getReturnsNullWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $I->assertNull($resolver->non_existent_property);
    }

    public function setDoesNothing(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $resolver->id = 35;
        $resolver->title = 'New Workflow Name';
        $resolver->description = 'New Workflow description';
        $resolver->modified_at = '2021-01-02 00:00:00';

        $I->assertEquals(34, $resolver->ID);
        $I->assertEquals('Workflow Name', $resolver->title);
        $I->assertEquals('Workflow description', $resolver->description);
        $I->assertEquals('2021-01-01 00:00:00', $resolver->modified_at);
    }

    public function unsetDoesNothing(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        unset($resolver->id);

        $I->assertEquals(34, $resolver->ID);
        $I->assertEquals('Workflow Name', $resolver->title);
        $I->assertEquals('Workflow description', $resolver->description);
        $I->assertEquals('2021-01-01 00:00:00', $resolver->modified_at);
    }

    public function toStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals('{"title":"Workflow Name","description":"Workflow description","modified_at":"2021-01-01 00:00:00","ID":34}', (string) $resolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $I->assertEquals(['type' => 'workflow', 'value' => 34], $resolver->compact());
    }
}

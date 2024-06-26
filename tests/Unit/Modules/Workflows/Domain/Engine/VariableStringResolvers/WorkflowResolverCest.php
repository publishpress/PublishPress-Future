<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\NodeResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\WorkflowResolver;
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
}

<?php

namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use Tests\Support\UnitTester;

class WorkflowResolverTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    public function setUp(): void
    {
        // Before...
        parent::setUp();

        // Your set up methods here.
    }

    public function tearDown(): void
    {
        // Your tear down methods here.

        // Then...
        parent::tearDown();
    }

    public function testGetTypeReturnsCorrectType(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $this->assertEquals('workflow', $resolver->getType());
    }

    public function testGetValueAsStringReturnsCorrectValue(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $this->assertEquals('34', $resolver->getValueAsString('ID'));
        $this->assertEquals('34', $resolver->getValueAsString('id'));
        $this->assertEquals('Workflow Name', $resolver->getValueAsString('title'));
        $this->assertEquals('Workflow description', $resolver->getValueAsString('description'));
        $this->assertEquals('2021-01-01 00:00:00', $resolver->getValueAsString('modified_at'));
    }

    public function testGetValueAsStringReturnsEmptyStringWhenPropertyNotExists(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $this->assertEquals('', $resolver->getValueAsString('non_existent_property'));
    }

    public function testIssetReturnsTrueWhenPropertyExists(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $this->assertTrue(isset($resolver->ID));
        $this->assertTrue(isset($resolver->id));
        $this->assertTrue(isset($resolver->title));
        $this->assertTrue(isset($resolver->description));
        $this->assertTrue(isset($resolver->modified_at));
    }

    public function testIssetReturnsFalseWhenPropertyDoesNotExist(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $this->assertFalse(isset($resolver->non_existent_property));
    }

    public function testGetReturnsCorrectValueWhenPropertyExists(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $this->assertEquals(34, $resolver->ID);
        $this->assertEquals('Workflow Name', $resolver->title);
        $this->assertEquals('Workflow description', $resolver->description);
        $this->assertEquals('2021-01-01 00:00:00', $resolver->modified_at);
    }

    public function testGetReturnsNullWhenPropertyDoesNotExist(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $this->assertNull($resolver->non_existent_property);
    }

    public function testSetDoesNothing(): void
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

        $this->assertEquals(34, $resolver->ID);
        $this->assertEquals('Workflow Name', $resolver->title);
        $this->assertEquals('Workflow description', $resolver->description);
        $this->assertEquals('2021-01-01 00:00:00', $resolver->modified_at);
    }

    public function testUnsetDoesNothing(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        unset($resolver->id);

        $this->assertEquals(34, $resolver->ID);
        $this->assertEquals('Workflow Name', $resolver->title);
        $this->assertEquals('Workflow description', $resolver->description);
        $this->assertEquals('2021-01-01 00:00:00', $resolver->modified_at);
    }

    public function testToStringReturnsCorrectValue(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $this->assertEquals('{"title":"Workflow Name","description":"Workflow description","modified_at":"2021-01-01 00:00:00","ID":34}', (string) $resolver);
    }

    public function testCompactReturnsCompactedArray(): void
    {
        $resolver = new WorkflowResolver([
            'id' => 34,
            'title' => 'Workflow Name',
            'description' => 'Workflow description',
            'modified_at' => '2021-01-01 00:00:00'
        ]);

        $this->assertEquals(['type' => 'workflow', 'value' => 34], $resolver->compact());
    }
}

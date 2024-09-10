<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use stdClass;
use Tests\Support\UnitTester;

class PostResolverTest extends \lucatume\WPBrowser\TestCase\WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    public function setUp() :void
    {
        // Before...
        parent::setUp();

        // Your set up methods here.
    }

    public function tearDown() :void
    {
        // Your tear down methods here.

        // Then...
        parent::tearDown();
    }

    public function testGetTypeReturnsCorrectType(): void
    {
        $resolver = new PostResolver(new stdClass);

        $this->assertEquals('post', $resolver->getType());
    }

    public function testGetValueAsStringReturnsCorrectValue(): void
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $this->assertEquals('23', $resolver->getValueAsString('ID'));
        $this->assertEquals('23', $resolver->getValueAsString('id'));
    }

    public function testGetValueAsStringReturnsEmptyStringWhenPropertyDoesNotExist(): void
    {
        $post = new stdClass();

        $resolver = new PostResolver($post);

        $this->assertEquals('', $resolver->getValueAsString('non_existent_key'));
    }

    public function testGetValueAsStringReturnsEmptyStringWhenPropertyIsNull(): void
    {
        $post = new stdClass();
        $post->ID = null;

        $resolver = new PostResolver($post);

        $this->assertEquals('', $resolver->getValueAsString('ID'));
    }

    public function testGetValueAsStringReturnsEmptyStringWhenPropertyIsEmptyString(): void
    {
        $post = new stdClass();
        $post->ID = '';

        $resolver = new PostResolver($post);

        $this->assertEquals('', $resolver->getValueAsString('ID'));
    }

    public function testGetValueAsStringReturnsEmptyStringWhenPropertyIsFalse(): void
    {
        $post = new stdClass();
        $post->ID = false;

        $resolver = new PostResolver($post);

        $this->assertEquals('', $resolver->getValueAsString('ID'));
    }

    public function testIssetReturnsTrueWhenPropertyExists(): void
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $this->assertTrue(isset($resolver->ID));
        $this->assertTrue(isset($resolver->id));
    }

    public function testIssetReturnsFalseWhenPropertyDoesNotExist(): void
    {
        $post = new stdClass();

        $resolver = new PostResolver($post);

        $this->assertFalse(isset($resolver->non_existent_key));
    }

    public function testSetDoesNothing(): void
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $resolver->ID = 24;

        $this->assertEquals('23', $resolver->getValueAsString('ID'));
    }

    public function testUnsetDoesNothing(): void
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        unset($resolver->ID);

        $this->assertEquals('23', $resolver->getValueAsString('ID'));
    }

    public function test__toStringReturnsCorrectValue(): void
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $this->assertEquals('23', (string)$resolver);
    }

    public function testCompactReturnsCompactedArray(): void
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $this->assertEquals(['type' => 'post', 'value' => 23], $resolver->compact());
    }
}

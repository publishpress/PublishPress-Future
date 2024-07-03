<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\UserResolver;
use stdClass;
use Tests\Support\UnitTester;

class UserResolverTest extends \lucatume\WPBrowser\TestCase\WPTestCase
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
        $resolver = new UserResolver(new stdClass);

        $this->assertEquals('user', $resolver->getType());
    }

    public function testGetValueAsStringReturnsCorrectValue(): void
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $this->assertEquals('23', $resolver->getValueAsString('ID'));
        $this->assertEquals('23', $resolver->getValueAsString('id'));
    }

    public function testGetValueAsStringReturnsEmptyStringWhenPropertyDoesNotExist(): void
    {
        $user = new stdClass();

        $resolver = new UserResolver($user);

        $this->assertEquals('', $resolver->getValueAsString('non_existent_key'));
    }

    public function testIssetReturnsTrueWhenPropertyExists(): void
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $this->assertTrue(isset($resolver->ID));
        $this->assertTrue(isset($resolver->id));
    }

    public function testIssetReturnsFalseWhenPropertyDoesNotExist(): void
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $this->assertFalse(isset($resolver->non_existent_key));
    }

    public function testGetReturnsValueWhenPropertyExists(): void
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $this->assertEquals(23, $resolver->ID);
    }

    public function testGetReturnsNullWhenPropertyDoesNotExist(): void
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $this->assertNull($resolver->non_existent_key);
    }

    public function testSetDoesNothing(): void
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $resolver->ID = 24;

        $this->assertEquals(23, $resolver->ID);
    }

    public function testUnsetDoesNothing(): void
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        unset($resolver->ID);

        $this->assertEquals(23, $resolver->ID);
    }

    public function testToStringReturnsCorrectValue(): void
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $this->assertEquals('{"ID":23}', (string) $resolver);
    }

    public function testCompactReturnsCompactedArray(): void
    {
        $user = new stdClass();
        $user->ID = 23;

        $resolver = new UserResolver($user);

        $this->assertEquals(['type' => 'user', 'value' => 23], $resolver->compact());
    }
}

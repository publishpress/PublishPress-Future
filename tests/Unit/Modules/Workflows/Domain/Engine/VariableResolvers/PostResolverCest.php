<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use stdClass;
use Tests\Support\UnitTester;

class PostResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new PostResolver(new stdClass);

        $I->assertEquals('post', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $I->assertEquals('23', $resolver->getValueAsString('ID'));
        $I->assertEquals('23', $resolver->getValueAsString('id'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyDoesNotExist(UnitTester $I)
    {
        $post = new stdClass();

        $resolver = new PostResolver($post);

        $I->assertEquals('', $resolver->getValueAsString('non_existent_key'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsNull(UnitTester $I)
    {
        $post = new stdClass();
        $post->ID = null;

        $resolver = new PostResolver($post);

        $I->assertEquals('', $resolver->getValueAsString('ID'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsEmptyString(UnitTester $I)
    {
        $post = new stdClass();
        $post->ID = '';

        $resolver = new PostResolver($post);

        $I->assertEquals('', $resolver->getValueAsString('ID'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsFalse(UnitTester $I)
    {
        $post = new stdClass();
        $post->ID = false;

        $resolver = new PostResolver($post);

        $I->assertEquals('', $resolver->getValueAsString('ID'));
    }

    public function issetReturnsTrueWhenPropertyExists(UnitTester $I)
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $I->assertTrue(isset($resolver->ID));
        $I->assertTrue(isset($resolver->id));
    }

    public function issetReturnsFalseWhenPropertyDoesNotExist(UnitTester $I)
    {
        $post = new stdClass();

        $resolver = new PostResolver($post);

        $I->assertFalse(isset($resolver->non_existent_key));
    }

    public function setDoesNothing(UnitTester $I)
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $resolver->ID = 24;

        $I->assertEquals('23', $resolver->getValueAsString('ID'));
    }

    public function unsetDoesNothing(UnitTester $I)
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        unset($resolver->ID);

        $I->assertEquals('23', $resolver->getValueAsString('ID'));
    }

    public function __toStringReturnsCorrectValue(UnitTester $I)
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $I->assertEquals('23', (string)$resolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $post = new stdClass();
        $post->ID = 23;

        $resolver = new PostResolver($post);

        $I->assertEquals(['type' => 'post', 'value' => 23], $resolver->compact());
    }
}

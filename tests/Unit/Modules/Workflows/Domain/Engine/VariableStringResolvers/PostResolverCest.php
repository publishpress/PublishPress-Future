<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\PostResolver;
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
}

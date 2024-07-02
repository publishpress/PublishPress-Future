<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\BooleanResolver;
use Tests\Support\UnitTester;

class BooleanResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new BooleanResolver(true);

        $I->assertEquals('boolean', $resolver->getType());
    }

    public function getValueAsStringReturnsYesWhenTrue(UnitTester $I)
    {
        $resolver = new BooleanResolver(true);

        $I->assertEquals('Yes', $resolver->getValueAsString());
    }

    public function getValueAsStringReturnsNoWhenFalse(UnitTester $I)
    {
        $resolver = new BooleanResolver(false);

        $I->assertEquals('No', $resolver->getValueAsString());
    }

    public function issetReturnsFalse(UnitTester $I)
    {
        $resolver = new BooleanResolver(true);

        $I->assertFalse(isset($resolver->variable));
        $I->assertFalse(isset($resolver->non_existent_property));
    }

    public function getReturnsNull(UnitTester $I)
    {
        $resolver = new BooleanResolver(true);

        $I->assertNull($resolver->variable);
        $I->assertNull($resolver->non_existent_property);
    }

    public function setDoesNothing(UnitTester $I)
    {
        $resolver = new BooleanResolver(true);

        $resolver->variable = false;
        $resolver->non_existent_property = 'value';

        $I->assertNull($resolver->variable);
    }

    public function unsetDoesNothing(UnitTester $I)
    {
        $resolver = new BooleanResolver(true);

        unset($resolver->variable);
        unset($resolver->non_existent_property);

        $I->assertNull($resolver->variable);
        $I->assertFalse(isset($resolver->non_existent_property));
    }

    public function toStringReturnsYesWhenTrue(UnitTester $I)
    {
        $resolver = new BooleanResolver(true);

        $I->assertEquals('Yes', (string)$resolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $resolver = new BooleanResolver(true);

        $I->assertEquals(['type' => 'boolean', 'value' => true], $resolver->compact());
    }
}

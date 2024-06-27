<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\StringResolver;
use Tests\Support\UnitTester;

class StringResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new StringResolver(true);

        $I->assertEquals('string', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $stringResolver = new StringResolver('String Value');

        $I->assertEquals('String Value', $stringResolver->getValueAsString());
    }

    public function issetReturnsFalse(UnitTester $I)
    {
        $stringResolver = new StringResolver('String Value');

        $I->assertFalse(isset($stringResolver->variable));
        $I->assertFalse(isset($stringResolver->non_existent_property));
    }

    public function getReturnsNull(UnitTester $I)
    {
        $stringResolver = new StringResolver('String Value');

        $I->assertNull($stringResolver->variable);
        $I->assertNull($stringResolver->non_existent_property);
    }

    public function setDoesNothing(UnitTester $I)
    {
        $stringResolver = new StringResolver('String Value');

        $stringResolver->variable = 'New String Value';

        $I->assertNull($stringResolver->variable);
        $I->assertEquals('String Value', $stringResolver->getValueAsString());
    }

    public function unsetDoesNothing(UnitTester $I)
    {
        $stringResolver = new StringResolver('String Value');

        unset($stringResolver->variable);

        $I->assertEquals('String Value', $stringResolver->getValueAsString());
    }

    public function __toStringReturnsCorrectValue(UnitTester $I)
    {
        $stringResolver = new StringResolver('String Value');

        $I->assertEquals('String Value', (string) $stringResolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $resolver = new StringResolver('String Value');

        $I->assertEquals(['type' => 'string', 'value' => 'String Value'], $resolver->compact());
    }
}

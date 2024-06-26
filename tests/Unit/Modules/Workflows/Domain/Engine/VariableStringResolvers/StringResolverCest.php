<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\StringResolver;
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
}

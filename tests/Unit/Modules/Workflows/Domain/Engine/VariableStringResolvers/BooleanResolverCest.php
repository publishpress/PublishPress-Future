<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\BooleanResolver;
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
}

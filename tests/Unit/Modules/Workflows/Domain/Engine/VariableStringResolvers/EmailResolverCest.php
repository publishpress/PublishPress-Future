<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\EmailResolver;
use Tests\Support\UnitTester;

class EmailResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        $I->assertEquals('email', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new EmailResolver('a@a.com');

        $I->assertEquals('a@a.com', $resolver->getValueAsString());
    }
}

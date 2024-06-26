<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\DatetimeResolver;
use Tests\Support\UnitTester;

class DatetimeResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new DatetimeResolver('2021-01-01 00:00:00');

        $I->assertEquals('datetime', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new DatetimeResolver('2021-01-01 00:00:00');

        $I->assertEquals('2021-01-01 00:00:00', $resolver->getValueAsString());
    }
}

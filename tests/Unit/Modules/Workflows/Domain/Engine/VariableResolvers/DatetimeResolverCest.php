<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\DatetimeResolver;
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

    public function issetReturnsFalse(UnitTester $I)
    {
        $resolver = new DatetimeResolver('2021-01-01 00:00:00');

        $I->assertFalse(isset($resolver->variable));
        $I->assertFalse(isset($resolver->non_existent_property));
    }

    public function getReturnsNull(UnitTester $I)
    {
        $resolver = new DatetimeResolver('2021-01-01 00:00:00');

        $I->assertNull($resolver->variable);
        $I->assertNull($resolver->non_existent_property);
    }

    public function setDoesNothing(UnitTester $I)
    {
        $resolver = new DatetimeResolver('2021-01-01 00:00:00');

        $resolver->variable = '2021-01-01 00:00:01';
        $resolver->non_existent_property = 'value';

        $I->assertNull($resolver->variable);
    }

    public function unsetDoesNothing(UnitTester $I)
    {
        $resolver = new DatetimeResolver('2021-01-01 00:00:00');
    }

    public function __toStringReturnsCorrectValue(UnitTester $I)
    {
        $resolver = new DatetimeResolver('2021-01-01 00:00:00');

        $I->assertEquals('2021-01-01 00:00:00', (string)$resolver);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $resolver = new DatetimeResolver('2021-01-01 00:00:00');

        $I->assertEquals(['type' => 'datetime', 'value' => '2021-01-01 00:00:00'], $resolver->compact());
    }
}

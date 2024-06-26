<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use Codeception\Stub;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers\SiteResolver;
use Tests\Support\UnitTester;

class SiteResolverCest
{
    public function getTypeReturnsCorrectType(UnitTester $I)
    {
        $resolver = new SiteResolver([]);

        $I->assertEquals('site', $resolver->getType());
    }

    public function getValueAsStringReturnsCorrectValue(UnitTester $I)
    {
        $siteResolver = Stub::make(SiteResolver::class, ['getSiteName' => 'Site Name']);

        $I->assertEquals('Site Name', $siteResolver->getValueAsString('name'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = new SiteResolver(['key' => 'value']);

        $I->assertEquals('', $resolver->getValueAsString('non_existent_key'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsEmpty(UnitTester $I)
    {
        $siteResolver = Stub::make(SiteResolver::class, ['getSiteName' => 'Site Name']);

        $I->assertEquals('', $siteResolver->getValueAsString(''));
    }
}

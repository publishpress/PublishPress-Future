<?php


namespace Tests\Modules\Workflows\Domain\Engine\VariableResolvers;

use Codeception\Stub;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\SiteResolver;
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
        $resolver = new SiteResolver();

        $I->assertEquals('', $resolver->getValueAsString('non_existent_key'));
    }

    public function getValueAsStringReturnsEmptyStringWhenPropertyIsEmpty(UnitTester $I)
    {
        $resolver = Stub::make(SiteResolver::class, ['getSiteName' => 'Site Name']);

        $I->assertEquals('', $resolver->getValueAsString(''));
    }

    public function issetReturnsTrueWhenPropertyExists(UnitTester $I)
    {
        $resolver = Stub::make(SiteResolver::class, ['getSiteName' => 'Site Name']);

        $I->assertTrue(isset($resolver->name));
    }

    public function issetReturnsFalseWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = Stub::make(SiteResolver::class, ['getSiteName' => 'Site Name']);

        $I->assertFalse(isset($resolver->non_existent_key));
    }

    public function getReturnsValueWhenPropertyExists(UnitTester $I)
    {
        $resolver = Stub::make(SiteResolver::class, ['getSiteName' => 'Site Name']);

        $I->assertEquals('Site Name', $resolver->name);
    }

    public function getReturnsNullWhenPropertyDoesNotExist(UnitTester $I)
    {
        $resolver = Stub::make(SiteResolver::class, ['getSiteName' => 'Site Name']);

        $I->assertNull($resolver->non_existent_key);
    }

    public function compactReturnsCompactedArray(UnitTester $I)
    {
        $resolver = Stub::make(SiteResolver::class, ['getSiteName' => 'Site Name']);

        $I->assertEquals(['type' => 'site', 'value' => 'Site Name'], $resolver->compact());
    }
}

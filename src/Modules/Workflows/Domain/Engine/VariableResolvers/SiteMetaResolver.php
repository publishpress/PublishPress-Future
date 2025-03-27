<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;

class SiteMetaResolver implements VariableResolverInterface
{
    private $siteId;

    private $siteMetaCache = [];

    public function __construct(int $siteId)
    {
        $this->siteId = $siteId;
    }

    public function getType(): string
    {
        return 'site_meta';
    }

    public function getValue(string $name = '')
    {
        if (isset($this->siteMetaCache[$name])) {
            return $this->siteMetaCache[$name];
        }

        $value = get_post_meta($this->siteId, $name, true);
        $this->siteMetaCache[$name] = $value;
        return $value;
    }

    public function getValueAsString(string $name = ''): string
    {
        return (string)$this->getValue($name);
    }

    public function compact($name = ''): array
    {
        return $this->getValue($name);
    }

    public function getVariable($name = '')
    {
        return $this->getValue($name);
    }

    public function setValue(string $name, $value): void
    {
        $this->siteMetaCache[$name] = $value;
    }

    public function __isset($name): bool
    {
        return metadata_exists('site', $this->siteId, $name);
    }

    public function __get($name)
    {
        return $this->getValue($name);
    }

    public function __set($name, $value): void
    {
        return;
    }

    public function __unset($name): void
    {
        return;
    }

    public function __toString(): string
    {
        return $this->getType();
    }
}

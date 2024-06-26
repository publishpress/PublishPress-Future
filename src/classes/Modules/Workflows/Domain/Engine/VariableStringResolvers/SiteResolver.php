<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\VariableStringResolverInterface;
use WP_Post;

class SiteResolver implements VariableStringResolverInterface
{
    public function getType(): string
    {
        return 'site';
    }

    public function getValueAsString($property = ''): string
    {
        switch($property) {
            case 'name':
                return $this->getSiteName();

            case 'description':
                return $this->getSiteDescription();

            case 'url':
                return $this->getSiteUrl();

            case 'home_url':
                return $this->getHomeUrl();

            case 'admin_email':
                return $this->getAdminEmail();
        }

        return '';
    }

    protected function getSiteName()
    {
        return get_option('blogname');
    }

    protected function getSiteDescription()
    {
        return get_option('blogdescription');
    }

    protected function getSiteUrl()
    {
        return get_site_url();
    }

    protected function getHomeUrl()
    {
        return get_home_url();
    }

    protected function getAdminEmail()
    {
        return get_option('admin_email');
    }
}

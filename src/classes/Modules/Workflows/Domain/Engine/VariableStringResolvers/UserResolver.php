<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\VariableStringResolverInterface;

class UserResolver implements VariableStringResolverInterface
{
    /**
     * @var object
     */
    private $user;

    public function __construct(object $user)
    {
        $this->user = $user;
    }

    public function getType(): string
    {
        return 'user';
    }

    public function getValueAsString($property = ''): string
    {
        switch($property) {
            case 'ID':
            case 'id':
                return (string)$this->user->ID;

            case 'user_login':
            case 'login':
                return (string)$this->user->user_login;

            case 'user_email':
            case 'email':
                return (string)$this->user->user_email;

            case 'roles':
                return implode(', ', $this->user->roles);

            case 'caps':
                return implode(', ', array_keys($this->user->caps));

            case 'display_name':
                return $this->user->display_name;

            case 'registered':
                return $this->user->user_registered;
        }

        return '';
    }
}

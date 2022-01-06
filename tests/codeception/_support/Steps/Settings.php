<?php

namespace Steps;

trait Settings
{
    /**
     * @Given default expiration is not activated for :postType
     */
    public function defaultExpirationNotActivatedForPostType($postType)
    {
        $this->haveOptionInDatabase(
            'expirationdateDefaults' . ucfirst($postType),
            maybe_serialize(
                [
                    'expireType' => 'draft',
                    'autoEnable' => 0,
                    'activeMetaBox' => 'active',
                    'emailnotification' => '',
                    'default-expire-type' => '',
                    'default-custom-date' => '',
                ]
            )
        );
    }

    /**
     * @Given default expiration is activated for :postType
     */
    public function defaultExpirationActivatedForPostType($postType)
    {
        $this->haveOptionInDatabase(
            'expirationdateDefaults' . ucfirst($postType),
            maybe_serialize(
                [
                    'expireType' => 'draft',
                    'autoEnable' => 1,
                    'activeMetaBox' => 'active',
                    'emailnotification' => '',
                    'default-expire-type' => '',
                    'default-custom-date' => '',
                ]
            )
        );
    }
}

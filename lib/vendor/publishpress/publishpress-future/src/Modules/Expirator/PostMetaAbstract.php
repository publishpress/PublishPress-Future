<?php

namespace PublishPress\Future\Modules\Expirator;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class PostMetaAbstract
{
    const EXPIRATION_TIMESTAMP = '_expiration-date';

    const EXPIRATION_STATUS = '_expiration-date-status';

    const EXPIRATION_DATE_OPTIONS = '_expiration-date-options';

    const EXPIRATION_TYPE = '_expiration-date-type';

    const EXPIRATION_POST_STATUS = '_expiration-date-post-status';

    const EXPIRATION_TERMS = '_expiration-date-categories';

    const EXPIRATION_TAXONOMY = '_expiration-date-taxonomy';
}

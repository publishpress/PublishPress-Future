<?php

namespace PublishPress\FuturePro\Modules\Workflows\Rest;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\RestApiManagerInterface;

class RestApiManager implements RestApiManagerInterface
{
    const API_BASE = 'publishpress-future';

    public function register()
    {
        $restApiV1 = new RestApiV1();
        $restApiV1->register();
    }
}

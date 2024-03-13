<?php

namespace PublishPress\Future\Modules\Expirator;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class ExpirationActionsAbstract
{
    const POST_STATUS_TO_DRAFT = 'draft';
    const POST_STATUS_TO_PRIVATE = 'private';
    const POST_STATUS_TO_TRASH = 'trash';
    const DELETE_POST = 'delete';
    const STICK_POST = 'stick';
    const UNSTICK_POST = 'unstick';
    const POST_CATEGORY_SET = 'category';
    const POST_CATEGORY_ADD = 'category-add';
    const POST_CATEGORY_REMOVE = 'category-remove';
    const POST_CATEGORY_REMOVE_ALL = 'category-remove-all';
    const CHANGE_POST_STATUS = "change-status";
}

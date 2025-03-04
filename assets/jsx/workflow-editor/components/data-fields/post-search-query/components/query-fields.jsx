import { __ } from '@wordpress/i18n';

export const queryFields = [
    {
        label: __('Post ID', 'post-expirator'),
        value: 'post.ID',
    },
    {
        label: __('Post Title', 'post-expirator'),
        value: 'post.post_title',
    },
    {
        label: __('Post Content', 'post-expirator'),
        value: 'post.post_content',
    },
    {
        label: __('Post Excerpt', 'post-expirator'),
        value: 'post.post_excerpt',
    },
    {
        label: __('Post Author', 'post-expirator'),
        value: 'post.post_author',
    },
    {
        label: __('Post Date', 'post-expirator'),
        value: 'post.post_date',
    },
    {
        label: __('Post Status', 'post-expirator'),
        value: 'post.post_status',
    },
    {
        label: __('Post Type', 'post-expirator'),
        value: 'post.post_type',
    },
    {
        label: __('Post Parent', 'post-expirator'),
        value: 'post.post_parent',
    },
];

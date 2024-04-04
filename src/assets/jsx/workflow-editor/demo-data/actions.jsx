export const actionCategories = [
    {
        slug: 'post',
        title: 'Post',
        icon: 'document',
    },
    {
        slug: 'user',
        title: 'User',
        icon: 'users',
    }
];

export const actionNodes = [
    {
        id: '1',
        type: 'action',
        name: 'core/update-post',
        title: 'Update post',
        initialAttributes: {},
        category: 'post',
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'document',
            background: '#ffffff',
            foreground: '#1e1e1e',
        },
    },
    {
        id: '2',
        type: 'action',
        name: 'core/delete-post',
        title: 'Delete post',
        initialAttributes: {},
        category: 'post',
        disabled: false,
        isDisabled: false,
        frecency: 3,
        icon: {
            src: 'document',
            background: '#ffffff',
            foreground: '#1e1e1e',
        },
    },
    {
        id: '3',
        type: 'action',
        name: 'core/change-user-role',
        title: 'Change user role',
        initialAttributes: {},
        category: 'user',
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'users',
            background: '#ffffff',
            foreground: '#1e1e1e',
        },
    },
];

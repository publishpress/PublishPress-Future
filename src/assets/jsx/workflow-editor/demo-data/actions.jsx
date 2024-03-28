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
            foreground: '#676767',
        },
    },
    {
        id: '2',
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
            foreground: '#676767',
        },
    },
    {
        id: '3',
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
            foreground: '#676767',
        },
    },
];

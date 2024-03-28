export const triggerCategories = [
    {
        slug: 'schedulling',
        title: 'Scheduled Date & Time',
        icon: {
            src: 'calendar',
        }
    },
    {
        slug: 'post',
        title: 'Post',
        icon: {
            src: 'document',
        }
    },
    {
        slug: 'user',
        title: 'User',
        icon: {
            src: 'users',
        }
    },
    {
        slug: 'woocommerce',
        title: 'WooCommerce',
        icon: {
            src: 'woo'
        }
    }
];

export const triggerNodes = [
    {
        id: '1',
        name: 'core/scheduling',
        title: 'Scheduled date & time',
        initialAttributes: {},
        category: 'schedulling',
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'calendar',
            background: '#ffffff',
            foreground: '#676767',
        },
    },
    {
        id: '2',
        name: 'core/save-post',
        title: 'Post is saved',
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
        id: '5',
        name: 'core/publish-post',
        title: 'Post is published',
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
        name: 'core/create-user',
        title: 'User is created',
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
    {
        id: '4',
        name: 'woocommerce/order-created',
        title: 'Order is created',
        initialAttributes: {},
        category: 'woocommerce',
        disabled: false,
        isDisabled: false,
        frecency: 1,
        icon: {
            src: 'woo',
            background: '#ffffff',
            foreground: '#676767',
        },
    }
];
